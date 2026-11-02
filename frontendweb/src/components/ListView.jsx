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
      <div className="swiss-panel empty-state-swiss swiss-crosshair">
        <div className="empty-icon-box mono">
          <CalendarX size={36} className="text-muted" />
        </div>
        <div>
          <span className="swiss-index-stamp">
            <span className="bracket">[</span>TELEMETRY // NO MATCH<span className="bracket">]</span>
          </span>
          <h3 className="empty-state-title font-display">
            NO CONTESTS MATCH CURRENT FILTERS
          </h3>
          <p className="empty-state-desc mono">
            Expand platform filters or reset division selections to restore active radar tracking.
          </p>
        </div>
        <button className="btn btn-brutal-primary mono" onClick={onResetFilters}>
          <Sparkles size={14} />
          <span>[ RESET ALL FILTERS ]</span>
        </button>
      </div>
    );
  }

  return (
    <div className="list-view-chrono">
      {/* 1. Live Now Section */}
      {groups.live.length > 0 && (
        <section className="chrono-section">
          <div className="chrono-section-header">
            <div className="chrono-title-group">
              <span className="chrono-num mono text-acid">01 //</span>
              <h2 className="chrono-heading font-display text-acid">
                ACTIVE ARENAS [LIVE RADAR]
              </h2>
            </div>
            <span className="chrono-count-badge badge-live mono">
              {groups.live.length < 10 ? `0${groups.live.length}` : groups.live.length} ACTIVE
            </span>
          </div>
          <div className="contest-grid-swiss">
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
        <section className="chrono-section">
          <div className="chrono-section-header">
            <div className="chrono-title-group">
              <span className="chrono-num mono">02 //</span>
              <h2 className="chrono-heading font-display">
                TODAY'S LINEUP
              </h2>
            </div>
            <span className="chrono-count-badge mono">
              {groups.today.length < 10 ? `0${groups.today.length}` : groups.today.length} EVENTS
            </span>
          </div>
          <div className="contest-grid-swiss">
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
        <section className="chrono-section">
          <div className="chrono-section-header">
            <div className="chrono-title-group">
              <span className="chrono-num mono">03 //</span>
              <h2 className="chrono-heading font-display">
                TOMORROW
              </h2>
            </div>
            <span className="chrono-count-badge mono">
              {groups.tomorrow.length < 10 ? `0${groups.tomorrow.length}` : groups.tomorrow.length} EVENTS
            </span>
          </div>
          <div className="contest-grid-swiss">
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
        <section className="chrono-section">
          <div className="chrono-section-header">
            <div className="chrono-title-group">
              <span className="chrono-num mono">04 //</span>
              <h2 className="chrono-heading font-display">
                THIS WEEK'S HORIZON
              </h2>
            </div>
            <span className="chrono-count-badge mono">
              {groups.thisWeek.length < 10 ? `0${groups.thisWeek.length}` : groups.thisWeek.length} EVENTS
            </span>
          </div>
          <div className="contest-grid-swiss">
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
        <section className="chrono-section">
          <div className="chrono-section-header">
            <div className="chrono-title-group">
              <span className="chrono-num mono">05 //</span>
              <h2 className="chrono-heading font-display">
                LONG-RANGE CHRONO
              </h2>
            </div>
            <span className="chrono-count-badge mono">
              {groups.later.length < 10 ? `0${groups.later.length}` : groups.later.length} EVENTS
            </span>
          </div>
          <div className="contest-grid-swiss">
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
