import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  CalendarPlus,
  Download,
  Copy,
  Check,
  Clock,
  Calendar,
  Layers,
  Info,
  Timer,
  ChevronRight,
  Globe
} from 'lucide-react';
import { formatDateTime, formatDuration, getCountdown } from '../utils/timeUtils';
import { createGoogleCalendarUrl, downloadSingleContestIcs } from '../utils/calendarSync';
import { PlatformIcon } from './PlatformIcons';

export function ContestModal({ contest, timezone, onClose }) {
  if (!contest) return null;

  const [nowMs, setNowMs] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(contest.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGCal = () => {
    window.open(createGoogleCalendarUrl(contest), '_blank');
  };

  const handleIcs = () => {
    downloadSingleContestIcs(contest);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-window contest-detail-modal animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="modal-header">
          <div className="modal-header-platform">
            <PlatformIcon platform={contest.platform} size={20} />
            <div>
              <span className="modal-platform-name">{contest.platformName}</span>
              <span className="modal-sub-id">Round #{contest.id}</span>
            </div>
          </div>

          <div className="modal-header-actions">
            {isLive ? (
              <div className="modal-live-pill">
                <span className="live-pulse-dot-sm" />
                <span>Live Battle</span>
              </div>
            ) : (
              <div className="modal-upcoming-pill">
                <span>Upcoming</span>
              </div>
            )}

            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-content">
          {/* Contest Title */}
          <h2 className="modal-title">
            {contest.title}
          </h2>

          {/* Division Tags */}
          <div className="modal-division-row">
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

          {/* Apple Live Activity / Countdown Strip */}
          <div className={`modal-countdown-strip ${isLive ? 'is-live-strip' : ''}`}>
            <div className="modal-countdown-row">
              <div className="modal-countdown-text mono">
                <Timer size={16} />
                <span>
                  {isLive ? 'Time Remaining: ' : 'Starts in: '}
                  <strong>{countdown.label}</strong>
                </span>
              </div>
              <span className="modal-countdown-badge mono">
                {isLive ? 'Active' : 'Scheduled'}
              </span>
            </div>
          </div>

          {/* Grouped Information Table (Apple Settings style) */}
          <div className="modal-info-card">
            <div className="modal-info-row">
              <span className="modal-info-label">
                <Calendar size={14} />
                <span>Start Time</span>
              </span>
              <span className="modal-info-value mono">
                {formatDateTime(contest.startTimeMs, timezone)}
              </span>
            </div>

            <div className="modal-info-separator" />

            <div className="modal-info-row">
              <span className="modal-info-label">
                <Clock size={14} />
                <span>Duration</span>
              </span>
              <span className="modal-info-value mono">
                {formatDuration(contest.durationSeconds)}
              </span>
            </div>

            <div className="modal-info-separator" />

            <div className="modal-info-row">
              <span className="modal-info-label">
                <Globe size={14} />
                <span>Display Timezone</span>
              </span>
              <span className="modal-info-value">
                {timezone === 'local' ? 'Local System Time' : timezone}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="modal-footer">
          <div className="modal-secondary-actions">
            <button
              className="footer-action-btn"
              onClick={handleGCal}
              title="Add to Google Calendar"
            >
              <CalendarPlus size={14} />
              <span>Google Calendar</span>
            </button>
            <button
              className="footer-action-btn"
              onClick={handleIcs}
              title="Download .ics Calendar Event"
            >
              <Download size={14} />
              <span>Export .ics</span>
            </button>
            <button
              className="footer-action-btn"
              onClick={handleCopyLink}
              title="Copy link to clipboard"
            >
              {copied ? (
                <>
                  <Check size={14} style={{ color: 'var(--accent-live)' }} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-apple-btn"
          >
            <span>{isLive ? 'Enter Contest' : 'Open Contest'}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
