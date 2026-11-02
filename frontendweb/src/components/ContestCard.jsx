import React, { useState, useEffect } from 'react';
import { ExternalLink, CalendarPlus, Clock, Download, Radio, ArrowUpRight } from 'lucide-react';
import { formatDateTime, formatDuration, getCountdown } from '../utils/timeUtils';
import { createGoogleCalendarUrl, downloadSingleContestIcs } from '../utils/calendarSync';

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

  const platformPrefix = {
    codeforces: 'CF',
    leetcode: 'LC',
    codechef: 'CC',
    atcoder: 'AC'
  }[contest.platform] || 'CP';

  return (
    <div
      className={`swiss-panel contest-card-swiss swiss-crosshair ${isLive ? 'is-live-card' : ''}`}
      style={{
        '--card-accent': contest.platformColor || '#0055ff'
      }}
      onClick={handleCardClick}
    >
      {/* Top Banner: Platform Stamp & Status Indicator */}
      <div className="card-top-header">
        <div className="platform-stamp mono">
          <span className="platform-tag-prefix">[{platformPrefix}]</span>
          <span className="platform-tag-name font-display">{contest.platformName}</span>
        </div>

        {isLive ? (
          <div className="card-live-stamp mono">
            <div className="equalizer-bars">
              <span className="equalizer-bar" />
              <span className="equalizer-bar" />
              <span className="equalizer-bar" />
            </div>
            <span>LIVE NOW</span>
          </div>
        ) : (
          <div className="card-upcoming-stamp mono">
            <span>UPCOMING</span>
          </div>
        )}
      </div>

      {/* Main Title */}
      <h3 className="contest-title-swiss font-display" title={contest.title}>
        {contest.title}
      </h3>

      {/* Division / Tag Matrix */}
      <div className="division-tags-row">
        {contest.divisions.map((div, i) => (
          <span key={i} className="division-tag-stamp mono">
            {div}
          </span>
        ))}
        {contest.type && (
          <span className="division-tag-stamp tag-type mono">
            {contest.type}
          </span>
        )}
      </div>

      {/* Telemetry Specs Box */}
      <div className="telemetry-specs-box">
        <div className="spec-item">
          <span className="spec-label mono">START_CHRONO</span>
          <span className="spec-val mono">
            {formatDateTime(contest.startTimeMs, timezone)}
          </span>
        </div>

        <div className="spec-item">
          <span className="spec-label mono">DURATION</span>
          <span className="spec-val mono">
            {formatDuration(contest.durationSeconds)}
          </span>
        </div>
      </div>

      {/* Live Countdown / Progress Gauge */}
      <div className={`countdown-bar-brutal ${isLive ? 'countdown-live' : ''}`}>
        <div className="countdown-info-row mono">
          <span className="countdown-chrono-text">
            {isLive ? 'TIME REMAINING: ' : 'COUNTDOWN: '}
            <strong className="countdown-highlight">{countdown.label}</strong>
          </span>
          {isLive && (
            <span className="countdown-percent mono font-bold">
              {Math.round(countdown.progress)}% ELAPSED
            </span>
          )}
        </div>
        {isLive && (
          <div className="countdown-progress-track">
            <div
              className="countdown-progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, countdown.progress))}%` }}
            />
          </div>
        )}
      </div>

      {/* Brutalist Action Button Row */}
      <div className="card-actions-swiss">
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brutal-action btn-action-primary mono"
          onClick={(e) => e.stopPropagation()}
        >
          <span>ENTER ARENA</span>
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </a>

        <button
          className="btn-brutal-action mono"
          onClick={handleGCalClick}
          title="Add to Google Calendar"
        >
          <CalendarPlus size={13} />
          <span>GCAL</span>
        </button>

        <button
          className="btn-brutal-action mono"
          onClick={handleIcsClick}
          title="Download .ics file"
        >
          <Download size={13} />
          <span>.ICS</span>
        </button>
      </div>
    </div>
  );
}
