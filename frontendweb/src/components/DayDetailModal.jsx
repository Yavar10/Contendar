import React from 'react';
import { X, Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';
import { formatDateTime, formatDuration, formatTimeOnly } from '../utils/timeUtils';
import { PlatformIcon } from './PlatformIcons';

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
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-window day-detail-modal animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-platform">
            <div className="day-modal-icon">
              <CalendarIcon size={18} />
            </div>
            <div>
              <h3 className="modal-platform-name">{formattedDate}</h3>
              <span className="modal-sub-id">
                {contests.length} {contests.length === 1 ? 'contest' : 'contests'} scheduled
              </span>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Contest Agenda List */}
        <div className="modal-body-content">
          <div className="day-items-list">
            {contests.map((c) => {
              const isLive = c.status === 'LIVE';

              return (
                <div
                  key={c.id}
                  className="day-item-card"
                  onClick={() => onSelectContest(c)}
                >
                  <div className="day-item-top">
                    <div className="day-item-platform">
                      <PlatformIcon platform={c.platform} size={15} />
                      <span className="platform-tag-name">{c.platformName}</span>
                    </div>

                    {isLive ? (
                      <span className="modal-live-pill" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        <span className="live-pulse-dot-sm" />
                        Live Now
                      </span>
                    ) : (
                      <span className="modal-upcoming-pill" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        Upcoming
                      </span>
                    )}
                  </div>

                  <h4 className="day-item-title">{c.title}</h4>

                  <div className="division-tags-wrap" style={{ marginBottom: 0 }}>
                    {c.divisions.map((d, i) => (
                      <span key={i} className="division-chip">
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="day-item-meta mono">
                    <span>{formatDateTime(c.startTimeMs, timezone)}</span>
                    <span className="meta-duration">
                      <Clock size={12} />
                      {formatDuration(c.durationSeconds)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
          <button className="primary-apple-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
