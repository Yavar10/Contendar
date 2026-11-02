import React from 'react';
import { ContestCard } from './ContestCard';
import { groupContestsByTimeline } from '../utils/timeUtils';
import { CalendarX, Sparkles, Radio } from 'lucide-react';

export function ListView({
  contests,
  timezone,
  onSelectContest,
  onResetFilters
}) {
  const groups = groupContestsByTimeline(contests);

  if (contests.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '60px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <CalendarX size={32} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>
            No Contests Match Your Filters
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px' }}>
            Try expanding your platform selection or removing division filters to see more upcoming contests.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onResetFilters}>
          <Sparkles size={16} />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="list-view-container">
      {/* 1. Live Now Section */}
      {groups.live.length > 0 && (
        <section className="timeline-group">
          <div className="timeline-header">
            <h2 className="timeline-title" style={{ color: '#34d399' }}>
              <Radio size={18} className="pulse-indicator" />
              <span>Happening Right Now</span>
            </h2>
            <span
              className="timeline-count"
              style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}
            >
              {groups.live.length}
            </span>
          </div>
          <div className="contest-grid">
            {groups.live.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                timezone={timezone}
                onSelectContest={onSelectContest}
              />
            ))}
          </div>
        </section>
      )}

      {/* 2. Today Section */}
      {groups.today.length > 0 && (
        <section className="timeline-group">
          <div className="timeline-header">
            <h2 className="timeline-title">
              <span>⚡ Today</span>
            </h2>
            <span className="timeline-count">{groups.today.length}</span>
          </div>
          <div className="contest-grid">
            {groups.today.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                timezone={timezone}
                onSelectContest={onSelectContest}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Tomorrow Section */}
      {groups.tomorrow.length > 0 && (
        <section className="timeline-group">
          <div className="timeline-header">
            <h2 className="timeline-title">
              <span>📅 Tomorrow</span>
            </h2>
            <span className="timeline-count">{groups.tomorrow.length}</span>
          </div>
          <div className="contest-grid">
            {groups.tomorrow.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                timezone={timezone}
                onSelectContest={onSelectContest}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. This Week Section */}
      {groups.thisWeek.length > 0 && (
        <section className="timeline-group">
          <div className="timeline-header">
            <h2 className="timeline-title">
              <span>🗓️ This Week</span>
            </h2>
            <span className="timeline-count">{groups.thisWeek.length}</span>
          </div>
          <div className="contest-grid">
            {groups.thisWeek.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                timezone={timezone}
                onSelectContest={onSelectContest}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Later Section */}
      {groups.later.length > 0 && (
        <section className="timeline-group">
          <div className="timeline-header">
            <h2 className="timeline-title">
              <span>⏳ Later This Month & Beyond</span>
            </h2>
            <span className="timeline-count">{groups.later.length}</span>
          </div>
          <div className="contest-grid">
            {groups.later.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                timezone={timezone}
                onSelectContest={onSelectContest}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
