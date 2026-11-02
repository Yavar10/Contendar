import React from 'react';
import { Radio, Calendar, CheckCircle, Layers } from 'lucide-react';

export function StatsRibbon({ contests, platforms }) {
  const liveCount = contests.filter((c) => c.status === 'LIVE').length;
  const upcomingCount = contests.filter((c) => c.status === 'UPCOMING').length;

  return (
    <div className="stats-ribbon">
      {/* Live Now */}
      <div className="glass-panel stat-card">
        <div
          className="stat-icon-wrapper"
          style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
        >
          <Radio size={22} className={liveCount > 0 ? 'pulse-indicator' : ''} />
        </div>
        <div className="stat-info">
          <span className="stat-value" style={{ color: liveCount > 0 ? '#34d399' : 'inherit' }}>
            {liveCount}
          </span>
          <span className="stat-label">Live Contests</span>
        </div>
      </div>

      {/* Upcoming Contests */}
      <div className="glass-panel stat-card">
        <div
          className="stat-icon-wrapper"
          style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
        >
          <Calendar size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{upcomingCount}</span>
          <span className="stat-label">Upcoming</span>
        </div>
      </div>

      {/* Total Tracked */}
      <div className="glass-panel stat-card">
        <div
          className="stat-icon-wrapper"
          style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}
        >
          <CheckCircle size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{contests.length}</span>
          <span className="stat-label">Total Events</span>
        </div>
      </div>

      {/* Platforms Monitored */}
      <div className="glass-panel stat-card">
        <div
          className="stat-icon-wrapper"
          style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
        >
          <Layers size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{platforms.length}</span>
          <span className="stat-label">Platforms Active</span>
        </div>
      </div>
    </div>
  );
}
