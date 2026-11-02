import React, { useState, useEffect } from 'react';
import { ExternalLink, CalendarPlus, Clock, Download, Calendar } from 'lucide-react';
import { formatDateTime, formatDuration, getCountdown } from '../utils/timeUtils';
import { createGoogleCalendarUrl, downloadSingleContestIcs } from '../utils/calendarSync';
import { PlatformIcon } from './PlatformIcons';

export function ContestCard({ contest, timezone, onSelectContest }) {
  const [nowMs, setNowMs] = useState(Date.now());

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

  return (
    <div
      className={`contest-item-card ${isLive ? 'is-live-card' : ''}`}
      onClick={handleCardClick}
    >
      <div>
        {/* Top Header Row */}
        <div className="card-header-row">
          <div className="platform-tag">
            <PlatformIcon platform={contest.platform} size={15} />
            <span className="platform-tag-name">{contest.platformName}</span>
          </div>

          {isLive ? (
            <div className="live-badge">
              <span className="live-pulse-dot-sm" />
              <span>Live Now</span>
            </div>
          ) : (
            <div className="upcoming-countdown-badge">
              <span>{countdown.label}</span>
            </div>
          )}
        </div>

        {/* Contest Title */}
        <h3 className="contest-title" title={contest.title}>
          {contest.title}
        </h3>

        {/* Division Tags */}
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
            <span className="schedule-text">
              {formatDateTime(contest.startTimeMs, timezone)}
            </span>
          </div>
          <div className="schedule-item">
            <Clock size={13} className="schedule-icon" />
            <span className="schedule-text">
              {formatDuration(contest.durationSeconds)}
            </span>
          </div>
        </div>

        {/* Live Contest Progress Bar */}
        {isLive && (
          <div className="live-progress-box">
            <div className="live-progress-meta">
              <span className="live-progress-time">{countdown.label} remaining</span>
              <span className="live-progress-pct">{Math.round(countdown.progress)}%</span>
            </div>
            <div className="live-progress-track">
              <div
                className="live-progress-bar"
                style={{ width: `${Math.min(100, Math.max(0, countdown.progress))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="card-actions-bar">
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <span>Open Arena</span>
          <ExternalLink size={13} />
        </a>

        <div className="card-actions-right">
          <button
            className="action-btn-secondary"
            onClick={handleGCalClick}
            title="Add to Google Calendar"
          >
            <CalendarPlus size={14} />
            <span className="btn-label">GCal</span>
          </button>

          <button
            className="action-btn-secondary"
            onClick={handleIcsClick}
            title="Download iCal file (.ics)"
          >
            <Download size={14} />
            <span className="btn-label">.ics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
