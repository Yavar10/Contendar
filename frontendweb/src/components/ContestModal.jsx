import React, { useState, useEffect } from 'react';
import {
  X,
  CalendarPlus,
  Download,
  Copy,
  Check,
  Clock,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { formatDateTime, formatDuration, getCountdown } from '../utils/timeUtils';
import { createGoogleCalendarUrl, downloadSingleContestIcs } from '../utils/calendarSync';

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

  const platformPrefix = {
    codeforces: 'CF',
    leetcode: 'LC',
    codechef: 'CC',
    atcoder: 'AC'
  }[contest.platform] || 'CP';

  return (
    <div className="modal-backdrop-swiss" onClick={onClose}>
      <div
        className="modal-dossier animate-scale-up swiss-crosshair"
        onClick={(e) => e.stopPropagation()}
        style={{
          '--modal-accent': contest.platformColor || 'var(--cyber-blue)'
        }}
      >
        {/* Dossier Header */}
        <div className="dossier-header">
          <div className="dossier-meta-group">
            <span className="dossier-id mono font-bold">
              [DOSSIER // {contest.id}]
            </span>
            <div className="dossier-platform-tag mono">
              <span>[{platformPrefix}]</span>
              <span className="font-display">{contest.platformName}</span>
            </div>
          </div>

          <div className="dossier-header-actions">
            {isLive ? (
              <div className="status-live-stamp mono">
                <div className="equalizer-bars">
                  <span className="equalizer-bar" />
                  <span className="equalizer-bar" />
                  <span className="equalizer-bar" />
                </div>
                <span>LIVE NOW</span>
              </div>
            ) : (
              <div className="status-upcoming-stamp mono">
                <span>UPCOMING</span>
              </div>
            )}

            <button className="btn-close-dossier mono" onClick={onClose} aria-label="Close dossier">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Dossier Body */}
        <div className="dossier-body">
          {/* Contest Title */}
          <h2 className="dossier-title font-display">
            {contest.title}
          </h2>

          {/* Countdown & Progress Gauge */}
          <div className={`dossier-countdown-box ${isLive ? 'countdown-live' : ''}`}>
            <div className="dossier-countdown-row mono">
              <div className="dossier-time-left">
                <Clock size={15} />
                <span>
                  {isLive ? 'REMAINING: ' : 'COUNTDOWN: '}
                  <strong className="text-white">{countdown.label}</strong>
                </span>
              </div>
              {isLive && (
                <span className="dossier-progress-label mono font-bold text-acid">
                  {Math.round(countdown.progress)}% COMPLETE
                </span>
              )}
            </div>
            {isLive && (
              <div className="dossier-progress-bar">
                <div
                  className="dossier-progress-fill"
                  style={{ width: `${Math.min(100, Math.max(0, countdown.progress))}%` }}
                />
              </div>
            )}
          </div>

          {/* Division Matrix Stamps */}
          <div>
            <span className="dossier-section-title mono">
              [ 01 // ELIGIBLE DIVISIONS & RATING GROUPS ]
            </span>
            <div className="dossier-tags-row">
              {contest.divisions.map((d, i) => (
                <span key={i} className="division-stamp mono font-bold">
                  {d}
                </span>
              ))}
              {contest.type && (
                <span className="division-stamp tag-type mono font-bold">
                  {contest.type}
                </span>
              )}
            </div>
          </div>

          {/* Chrono Telemetry Specifications Matrix */}
          <div>
            <span className="dossier-section-title mono">
              [ 02 // CHRONO & PLATFORM TELEMETRY ]
            </span>
            <div className="dossier-specs-table">
              <div className="spec-row">
                <span className="spec-key mono">START_CHRONO:</span>
                <span className="spec-data mono font-bold">
                  {formatDateTime(contest.startTimeMs, timezone)}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-key mono">END_CHRONO:</span>
                <span className="spec-data mono font-bold">
                  {formatDateTime(contest.endTimeMs, timezone)}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-key mono">DURATION:</span>
                <span className="spec-data mono font-bold">
                  {formatDuration(contest.durationSeconds)}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-key mono">CONTEST_TYPE:</span>
                <span className="spec-data mono font-bold">
                  {contest.type || 'Standard Rated'}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-key mono">PLATFORM_HUB:</span>
                <span className="spec-data mono font-bold">
                  {contest.platformName}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {contest.description && (
            <div className="dossier-desc-box">
              <Info size={15} className="desc-icon" />
              <span className="mono">{contest.description}</span>
            </div>
          )}
        </div>

        {/* Dossier Footer Actions */}
        <div className="dossier-footer">
          <div className="dossier-footer-left">
            <button className="btn-brutal-action mono" onClick={handleGCal}>
              <CalendarPlus size={14} />
              <span>+ GCAL</span>
            </button>
            <button className="btn-brutal-action mono" onClick={handleIcs}>
              <Download size={14} />
              <span>.ICS</span>
            </button>
            <button className="btn-brutal-action mono" onClick={handleCopyLink}>
              {copied ? <Check size={14} className="text-acid" /> : <Copy size={14} />}
              <span>{copied ? 'COPIED!' : 'COPY LINK'}</span>
            </button>
          </div>

          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutal-action btn-action-primary mono"
          >
            <span>ENTER ARENA</span>
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  );
}
