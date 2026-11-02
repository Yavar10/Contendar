import React, { useState, useEffect } from 'react';
import { ExternalLink, CalendarPlus, Clock, Download, Radio, ShieldCheck } from 'lucide-react';
import { formatDateTime, formatDuration, getCountdown } from '../utils/timeUtils';
import { createGoogleCalendarUrl, downloadSingleContestIcs } from '../utils/calendarSync';

export function ContestCard({ contest, timezone, onSelectContest }) {
  const [nowMs, setNowMs] = useState(Date.now());

  // Update countdown every second
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
    // If click was on an action button, don't trigger the modal
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
      className={`glass-panel contest-card ${isLive ? 'live-card' : ''}`}
      onClick={handleCardClick}
    >
      <div>
        {/* Top bar: Platform Badge & Status */}
        <div className="card-top">
          <div
            className="platform-badge"
            style={{
              backgroundColor: contest.platformBadgeBg || 'rgba(255, 255, 255, 0.08)',
              color: contest.platformColor || '#fff',
              border: `1px solid ${contest.platformColor || '#ffffff22'}`
            }}
          >
            <span
              className="platform-dot"
              style={{ background: contest.platformColor || '#fff' }}
            />
            <span>{contest.platformName}</span>
          </div>

          <div className={`status-badge ${isLive ? 'live' : 'upcoming'}`}>
            {isLive ? (
              <>
                <Radio size={12} className="pulse-indicator" />
                <span>LIVE</span>
              </>
            ) : (
              <span>UPCOMING</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="card-title" title={contest.title}>
          {contest.title}
        </h3>

        {/* Division Tags */}
        <div className="divisions-row">
          {contest.divisions.map((div, i) => (
            <span key={i} className="division-tag">
              {div}
            </span>
          ))}
          {contest.type && (
            <span className="division-tag" style={{ color: '#93c5fd' }}>
              {contest.type}
            </span>
          )}
        </div>

        {/* Timing Meta Grid */}
        <div className="contest-meta-grid">
          <div className="meta-item">
            <span className="meta-item-label">Starts</span>
            <span className="meta-item-value">
              {formatDateTime(contest.startTimeMs, timezone)}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-item-label">Duration</span>
            <span className="meta-item-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} style={{ color: 'var(--text-muted)' }} />
              {formatDuration(contest.durationSeconds)}
            </span>
          </div>
        </div>

        {/* Countdown Box */}
        <div className={`countdown-box ${isLive ? 'live' : ''}`}>
          <span className="countdown-text mono">{countdown.label}</span>
          {isLive && (
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
              {Math.round(countdown.progress)}% done
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="card-actions">
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-btn action-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <span>Open</span>
          <ExternalLink size={13} />
        </a>

        <button
          className="card-btn"
          onClick={handleGCalClick}
          title="Add to Google Calendar"
        >
          <CalendarPlus size={14} />
          <span>GCal</span>
        </button>

        <button
          className="card-btn"
          onClick={handleIcsClick}
          title="Download .ics file"
        >
          <Download size={14} />
          <span>.ics</span>
        </button>
      </div>
    </div>
  );
}
