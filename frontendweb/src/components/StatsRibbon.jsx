import React from 'react';
import { Radio, Calendar, CheckCircle2, Layers } from 'lucide-react';
import { PlatformIcon } from './PlatformIcons';

export function StatsRibbon({ contests, platforms }) {
  const liveContests = contests.filter((c) => c.status === 'LIVE');
  const upcomingContests = contests.filter((c) => c.status === 'UPCOMING');

  return (
    <div className="overview-strip">
      {/* Live Highlight Alert (if active) */}
      {liveContests.length > 0 && (
        <div className="live-banner">
          <div className="live-banner-left">
            <span className="live-pulse-dot" />
            <span className="live-banner-label">Live Now</span>
          </div>
          <div className="live-banner-titles">
            {liveContests.map((c) => (
              <span key={c.id} className="live-contest-chip">
                <PlatformIcon platform={c.platform} size={14} />
                <span>{c.title}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* KPI Tiles Strip */}
      <div className="kpi-grid">
        <div className="kpi-tile">
          <div className="kpi-icon-wrap kpi-live">
            <Radio size={16} />
          </div>
          <div className="kpi-text">
            <span className="kpi-value">{liveContests.length}</span>
            <span className="kpi-label">Live Battles</span>
          </div>
        </div>

        <div className="kpi-tile">
          <div className="kpi-icon-wrap kpi-upcoming">
            <Calendar size={16} />
          </div>
          <div className="kpi-text">
            <span className="kpi-value">{upcomingContests.length}</span>
            <span className="kpi-label">Upcoming (30d)</span>
          </div>
        </div>

        <div className="kpi-tile">
          <div className="kpi-icon-wrap kpi-total">
            <CheckCircle2 size={16} />
          </div>
          <div className="kpi-text">
            <span className="kpi-value">{contests.length}</span>
            <span className="kpi-label">Total Scheduled</span>
          </div>
        </div>

        <div className="kpi-tile">
          <div className="kpi-icon-wrap kpi-platforms">
            <Layers size={16} />
          </div>
          <div className="kpi-text">
            <span className="kpi-value">{platforms.length || 4}</span>
            <span className="kpi-label">Active Platforms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
