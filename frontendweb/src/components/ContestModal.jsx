import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  CalendarPlus,
  Download,
  Copy,
  Check,
  Clock,
  Radio,
  Layers,
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              className="platform-dot"
              style={{
                width: '12px',
                height: '12px',
                background: contest.platformColor || 'var(--accent-primary)'
              }}
            />
            <span
              style={{
                fontWeight: 700,
                color: contest.platformColor,
                fontSize: '0.88rem',
                textTransform: 'uppercase'
              }}
            >
              {contest.platformName}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

            <button className="btn-icon" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Title */}
          <h2 style={{ fontSize: '1.35rem', lineHeight: 1.3, margin: 0 }}>
            {contest.title}
          </h2>

          {/* Live / Upcoming Countdown Ribbon */}
          <div className={`countdown-box ${isLive ? 'live' : ''}`} style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} />
              <span className="countdown-text mono" style={{ fontSize: '0.95rem' }}>
                {countdown.label}
              </span>
            </div>
            {isLive && (
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                {Math.round(countdown.progress)}% completed
              </span>
            )}
          </div>

          {/* Divisions Pill List */}
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px'
              }}
            >
              Eligible Divisions / Rating Groups
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {contest.divisions.map((d, i) => (
                <span
                  key={i}
                  className="division-tag"
                  style={{
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    background: 'rgba(99, 102, 241, 0.1)'
                  }}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Time & Duration Details */}
          <div className="contest-meta-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="meta-item">
              <span className="meta-item-label">Starts At</span>
              <span className="meta-item-value">
                {formatDateTime(contest.startTimeMs, timezone)}
              </span>
            </div>

            <div className="meta-item">
              <span className="meta-item-label">Ends At</span>
              <span className="meta-item-value">
                {formatDateTime(contest.endTimeMs, timezone)}
              </span>
            </div>

            <div className="meta-item">
              <span className="meta-item-label">Duration</span>
              <span className="meta-item-value">
                {formatDuration(contest.durationSeconds)}
              </span>
            </div>

            <div className="meta-item">
              <span className="meta-item-label">Format / Type</span>
              <span className="meta-item-value">{contest.type || 'Standard'}</span>
            </div>
          </div>

          {/* Description */}
          {contest.description && (
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: '8px'
              }}
            >
              <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-muted)' }} />
              <span>{contest.description}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={handleGCal}>
              <CalendarPlus size={15} />
              <span>Add to GCal</span>
            </button>
            <button className="btn btn-secondary" onClick={handleIcs}>
              <Download size={15} />
              <span>.ics</span>
            </button>
            <button className="btn btn-secondary" onClick={handleCopyLink}>
              {copied ? <Check size={15} style={{ color: '#10b981' }} /> : <Copy size={15} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <span>Open Contest</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}
