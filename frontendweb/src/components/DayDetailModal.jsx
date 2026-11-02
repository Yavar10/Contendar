import React from 'react';
import { X, Calendar as CalendarIcon, Clock, ArrowUpRight } from 'lucide-react';
import { formatDateTime, formatDuration } from '../utils/timeUtils';

export function DayDetailModal({ dayData, timezone, onClose, onSelectContest }) {
  if (!dayData) return null;

  const { date, contests } = dayData;
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date).toUpperCase();

  return (
    <div className="modal-backdrop-swiss" onClick={onClose}>
      <div
        className="modal-dossier animate-scale-up swiss-crosshair"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div className="dossier-header">
          <div className="dossier-meta-group">
            <span className="dossier-id mono font-bold">
              [DAY_CHRONO // {contests.length} EVENTS]
            </span>
            <div className="dossier-platform-tag mono">
              <CalendarIcon size={14} />
              <span className="font-display">{formattedDate}</span>
            </div>
          </div>

          <button className="btn-close-dossier mono" onClick={onClose} aria-label="Close dossier">
            <X size={16} />
          </button>
        </div>

        {/* Contest List */}
        <div className="dossier-body">
          <div className="day-contests-list">
            {contests.map((c) => {
              const platformPrefix = {
                codeforces: 'CF',
                leetcode: 'LC',
                codechef: 'CC',
                atcoder: 'AC'
              }[c.platform] || 'CP';

              const isLive = c.status === 'LIVE';

              return (
                <div
                  key={c.id}
                  className="swiss-panel day-contest-item"
                  style={{
                    borderLeft: `4px solid ${c.platformColor || 'var(--cyber-blue)'}`,
                    '--item-accent': c.platformColor || 'var(--cyber-blue)'
                  }}
                  onClick={() => onSelectContest(c)}
                >
                  <div className="day-item-top">
                    <span className="day-platform-code mono font-bold">
                      [{platformPrefix}] {c.platformName}
                    </span>

                    {isLive ? (
                      <span className="status-live-stamp mono font-bold" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        ● LIVE NOW
                      </span>
                    ) : (
                      <span className="status-upcoming-stamp mono" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        UPCOMING
                      </span>
                    )}
                  </div>

                  <h4 className="day-item-title font-display">{c.title}</h4>

                  <div className="division-tags-row">
                    {c.divisions.map((d, i) => (
                      <span key={i} className="division-tag-stamp mono" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="day-item-meta mono">
                    <span>{formatDateTime(c.startTimeMs, timezone)}</span>
                    <span className="day-item-duration">
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
        <div className="dossier-footer" style={{ justifyContent: 'flex-end' }}>
          <button className="btn-brutal-action mono" onClick={onClose}>
            [ CLOSE CHRONO ]
          </button>
        </div>
      </div>
    </div>
  );
}
