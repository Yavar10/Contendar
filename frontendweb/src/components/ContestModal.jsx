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
  Info
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
        className="modal-window animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="modal-header">
          <div className="modal-header-platform">
            <PlatformIcon platform={contest.platform} size={20} />
            <div>
              <span className="modal-platform-name">{contest.platformName}</span>
              <span className="modal-sub-id">#{contest.id}</span>
            </div>
          </div>

          <div className="modal-header-actions">
            {isLive ? (
              <div className="modal-live-pill">
                <span className="live-pulse-dot-sm" />
                <span>Live Now</span>
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

          {/* Countdown & Progress Box */}
          <div className={`modal-countdown-strip ${isLive ? 'is-live-strip' : ''}`}>
            <div className="modal-countdown-row">
              <div className="modal-countdown-text mono">
                <Clock size={15} />
                <span>
                  {isLive ? 'Time Remaining: ' : 'Starts in: '}
                  <strong>{countdown.label}</strong>
                </span>
              </div>
              {isLive && (
                <span className="modal-countdown-pct mono">
                  {Math.round(countdown.progress)}% completed
                </span>
              )}
            </div>
            {isLive && (
              <div className="modal-progress-track">
                <div
                  className="modal-progress-bar"
                  style={{ width: `${Math.min(100, Math.max(0, countdown.progress))}%` }}
                />
              </div>
            )}
          </div>

          {/* Divisions */}
          <div className="modal-section">
            <span className="modal-section-title">
              Eligible Divisions & Rating Categories
            </span>
            <div className="modal-chips-row">
              {contest.divisions.map((d, i) => (
                <span key={i} className="modal-chip">
                  {d}
                </span>
              ))}
              {contest.type && (
                <span className="modal-chip modal-chip-type">
                  {contest.type}
                </span>
              )}
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="modal-grid-2x2">
            <div className="modal-grid-cell">
              <span className="grid-cell-label">Start Time</span>
              <span className="grid-cell-value mono">
                {formatDateTime(contest.startTimeMs, timezone)}
              </span>
            </div>

            <div className="modal-grid-cell">
              <span className="grid-cell-label">End Time</span>
              <span className="grid-cell-value mono">
                {formatDateTime(contest.endTimeMs, timezone)}
              </span>
            </div>

            <div className="modal-grid-cell">
              <span className="grid-cell-label">Duration</span>
              <span className="grid-cell-value mono">
                {formatDuration(contest.durationSeconds)}
              </span>
            </div>

            <div className="modal-grid-cell">
              <span className="grid-cell-label">Format</span>
              <span className="grid-cell-value">
                {contest.type || 'Official Rated'}
              </span>
            </div>
          </div>

          {/* Description */}
          {contest.description && (
            <div className="modal-desc">
              <Info size={15} className="desc-icon" />
              <span>{contest.description}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="modal-footer-btns">
            <button className="footer-action-btn" onClick={handleGCal}>
              <CalendarPlus size={14} />
              <span>GCal</span>
            </button>
            <button className="footer-action-btn" onClick={handleIcs}>
              <Download size={14} />
              <span>.ics</span>
            </button>
            <button className="footer-action-btn" onClick={handleCopyLink}>
              {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-primary-btn"
          >
            <span>Enter Contest</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
