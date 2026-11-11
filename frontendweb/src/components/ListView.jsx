import React from 'react';
import { ContestCard } from './ContestCard';
import { groupContestsByTimeline } from '../utils/timeUtils';
import { CalendarX, Sparkles, Radio, Calendar, Layers } from 'lucide-react';

export function ListView({
  contests,
  timezone,
  onSelectContest,
  onResetFilters
}) {
  const groups = groupContestsByTimeline(contests);

  if (contests.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon-box">
          <CalendarX size={32} strokeWidth={1.75} />
        </div>
        <h3 className="empty-state-title">No contests match your radar</h3>
        <p className="empty-state-desc">
          Try broadening your platform filters or resetting division selections to view upcoming competitive programming rounds.
        </p>
        <button className="primary-apple-btn" onClick={onResetFilters}>
          <Sparkles size={14} />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      {/* 1. Happening Right Now */}
      {groups.live.length > 0 && (
        <section className="timeline-block">
          <div className="timeline-heading-row">
            <h2 className="timeline-heading live-heading">
              <Radio size={16} className="live-pulse-icon" />
              <span>Happening Right Now</span>
            </h2>
            <span className="timeline-badge live-badge-count">
              {groups.live.length} active
            </span>
          </div>
          <div className="cards-grid">
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

      {/* 2. Today */}
      {groups.today.length > 0 && (
        <section className="timeline-block">
          <div className="timeline-heading-row">
            <h2 className="timeline-heading">
              <span>Today</span>
            </h2>
            <span className="timeline-badge">
              {groups.today.length} {groups.today.length === 1 ? 'round' : 'rounds'}
            </span>
          </div>
          <div className="cards-grid">
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

      {/* 3. Tomorrow */}
      {groups.tomorrow.length > 0 && (
        <section className="timeline-block">
          <div className="timeline-heading-row">
            <h2 className="timeline-heading">
              <span>Tomorrow</span>
            </h2>
            <span className="timeline-badge">
              {groups.tomorrow.length} {groups.tomorrow.length === 1 ? 'round' : 'rounds'}
            </span>
          </div>
          <div className="cards-grid">
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

      {/* 4. This Week */}
      {groups.thisWeek.length > 0 && (
        <section className="timeline-block">
          <div className="timeline-heading-row">
            <h2 className="timeline-heading">
              <span>This Week</span>
            </h2>
            <span className="timeline-badge">
              {groups.thisWeek.length} {groups.thisWeek.length === 1 ? 'round' : 'rounds'}
            </span>
          </div>
          <div className="cards-grid">
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

      {/* 5. Later */}
      {groups.later.length > 0 && (
        <section className="timeline-block">
          <div className="timeline-heading-row">
            <h2 className="timeline-heading">
              <span>Later</span>
            </h2>
            <span className="timeline-badge">
              {groups.later.length} {groups.later.length === 1 ? 'round' : 'rounds'}
            </span>
          </div>
          <div className="cards-grid">
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
