import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  CalendarPlus,
  Clock,
  Download,
  Calendar,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';
import { formatDateTime, formatDuration, getCountdown, formatTimeOnly } from '../utils/timeUtils';
import { createGoogleCalendarUrl, downloadSingleContestIcs } from '../utils/calendarSync';
import { PlatformIcon } from './PlatformIcons';

export function ContestCard({ contest, timezone, onSelectContest }) {
  const [nowMs, setNowMs] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = getCountdown(
    contest.startTimeMs,
    contest.status,
    nowMs,
    contest.startTimeMs,
    contest.endTimeMs
  );

  const isLive = contest.status === 'LIVE';

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    onSelectContest(contest);
  };

  const handleGCalClick = (e) => {
    e.stopPropagation();
    window.open(createGoogleCalendarUrl(contest), '_blank');
  };

  const handleIcsClick = (e) => {
    e.stopPropagation();
    downloadSingleContestIcs(contest);
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(contest.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`contest-item-card ${isLive ? 'is-live-card' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-top-strip">
        {/* Platform Tag */}
        <div className="platform-tag">
          <PlatformIcon platform={contest.platform} size={15} />
          <span className="platform-tag-name">{contest.platformName}</span>
        </div>

        {/* Live or Countdown Pill */}
        {isLive ? (
          <div className="live-badge">
            <span className="live-pulse-dot-sm" />
            <span>Live Now</span>
          </div>
        ) : (
          <div className="upcoming-countdown-badge mono">
            <span>{countdown.label}</span>
          </div>
        )}
      </div>

      {/* Contest Title */}
      <h3 className="contest-title" title={contest.title}>
        {contest.title}
      </h3>

      {/* Division Badges */}
      <div className="division-tags-wrap">
        {contest.divisions.map((div, i) => (
          <span key={i} className="division-chip">
            {div}
          </span>
        ))}
        {contest.type && (
          <span className="division-chip division-type-chip">
            {contest.type}
          </span>
        )}
      </div>

      {/* Schedule & Duration Meta */}
      <div className="schedule-meta-box">
        <div className="schedule-item">
          <Calendar size={13} className="schedule-icon" />
          <span className="schedule-text mono">
            {formatDateTime(contest.startTimeMs, timezone)}
          </span>
        </div>
        <div className="schedule-item">
          <Clock size={13} className="schedule-icon" />
          <span className="schedule-text mono">
            {formatDuration(contest.durationSeconds)}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="card-action-footer">
        <div className="card-quick-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="card-quick-btn"
            onClick={handleGCalClick}
            title="Add to Google Calendar"
          >
            <CalendarPlus size={14} />
          </button>
          <button
            className="card-quick-btn"
            onClick={handleIcsClick}
            title="Download .ics Calendar Event"
          >
            <Download size={14} />
          </button>
          <button
            className="card-quick-btn"
            onClick={handleCopyLink}
            title="Copy Contest Link"
          >
            {copied ? <Check size={14} style={{ color: 'var(--accent-live)' }} /> : <Copy size={14} />}
          </button>
        </div>

        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-open-link"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{isLive ? 'Enter' : 'View'}</span>
          <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
}
