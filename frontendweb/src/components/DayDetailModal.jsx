import React from 'react';
import { X, Calendar as CalendarIcon, ExternalLink, Clock } from 'lucide-react';
import { formatDateTime, formatDuration } from '../utils/timeUtils';
import { createGoogleCalendarUrl } from '../utils/calendarSync';

export function DayDetailModal({ dayData, timezone, onClose, onSelectContest }) {
  if (!dayData) return null;

  const { date, contests } = dayData;
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon size={20} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{formattedDate}</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {contests.length} contest{contests.length > 1 ? 's' : ''} scheduled
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Contest List */}
        <div className="modal-body">
          {contests.map((c) => (
            <div
              key={c.id}
              className="glass-panel"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
                borderLeft: `4px solid ${c.platformColor || 'var(--accent-primary)'}`
              }}
              onClick={() => onSelectContest(c)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: c.platformColor,
                    textTransform: 'uppercase'
                  }}
                >
                  {c.platformName}
                </span>

                <span
                  className={`status-badge ${c.status === 'LIVE' ? 'live' : 'upcoming'}`}
                  style={{ fontSize: '0.68rem', padding: '2px 8px' }}
                >
                  {c.status}
                </span>
              </div>

              <h4 style={{ fontSize: '0.98rem', margin: 0 }}>{c.title}</h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {c.divisions.map((d, i) => (
                  <span key={i} className="division-tag" style={{ fontSize: '0.7rem' }}>
                    {d}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <span>{formatDateTime(c.startTimeMs, timezone)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  {formatDuration(c.durationSeconds)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
