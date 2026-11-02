import React from 'react';
import { Radio, Calendar, CheckCircle2, Cpu } from 'lucide-react';

export function StatsRibbon({ contests, platforms }) {
  const liveCount = contests.filter((c) => c.status === 'LIVE').length;
  const upcomingCount = contests.filter((c) => c.status === 'UPCOMING').length;

  return (
    <div className="stats-flight-deck">
      {/* 01. Live Now */}
      <div className={`swiss-panel telemetry-card swiss-crosshair ${liveCount > 0 ? 'card-live-glow' : ''}`}>
        <div className="telemetry-top">
          <span className="telemetry-index mono">
            <span className="bracket">[</span>01 // LIVE_BATTLES<span className="bracket">]</span>
          </span>
          <Radio size={16} className={liveCount > 0 ? 'text-acid' : 'text-muted'} />
        </div>
        <div className="telemetry-main">
          <span className="telemetry-num mono font-display" style={{ color: liveCount > 0 ? 'var(--acid-lime)' : 'inherit' }}>
            {liveCount < 10 ? `0${liveCount}` : liveCount}
          </span>
          <div className="telemetry-meta">
            <span className="telemetry-label font-display">LIVE NOW</span>
            <span className="telemetry-sub mono">
              {liveCount > 0 ? 'IN ARENA SESSIONS' : 'STANDBY MODE'}
            </span>
          </div>
        </div>
      </div>

      {/* 02. Upcoming */}
      <div className="swiss-panel telemetry-card swiss-crosshair">
        <div className="telemetry-top">
          <span className="telemetry-index mono">
            <span className="bracket">[</span>02 // HORIZON<span className="bracket">]</span>
          </span>
          <Calendar size={16} style={{ color: 'var(--swiss-red)' }} />
        </div>
        <div className="telemetry-main">
          <span className="telemetry-num mono font-display" style={{ color: 'var(--swiss-red)' }}>
            {upcomingCount < 10 ? `0${upcomingCount}` : upcomingCount}
          </span>
          <div className="telemetry-meta">
            <span className="telemetry-label font-display">UPCOMING</span>
            <span className="telemetry-sub mono">NEXT 30 DAYS</span>
          </div>
        </div>
      </div>

      {/* 03. Total Events */}
      <div className="swiss-panel telemetry-card swiss-crosshair">
        <div className="telemetry-top">
          <span className="telemetry-index mono">
            <span className="bracket">[</span>03 // TOTAL_CHRONO<span className="bracket">]</span>
          </span>
          <CheckCircle2 size={16} style={{ color: 'var(--cyber-blue)' }} />
        </div>
        <div className="telemetry-main">
          <span className="telemetry-num mono font-display" style={{ color: 'var(--cyber-blue)' }}>
            {contests.length < 10 ? `0${contests.length}` : contests.length}
          </span>
          <div className="telemetry-meta">
            <span className="telemetry-label font-display">SCHEDULED</span>
            <span className="telemetry-sub mono">VERIFIED EVENTS</span>
          </div>
        </div>
      </div>

      {/* 04. Platform Feeds */}
      <div className="swiss-panel telemetry-card swiss-crosshair">
        <div className="telemetry-top">
          <span className="telemetry-index mono">
            <span className="bracket">[</span>04 // TELEMETRY<span className="bracket">]</span>
          </span>
          <Cpu size={16} style={{ color: 'var(--hyper-cyan)' }} />
        </div>
        <div className="telemetry-main">
          <span className="telemetry-num mono font-display" style={{ color: 'var(--hyper-cyan)' }}>
            0{platforms.length || 4}
          </span>
          <div className="telemetry-meta">
            <span className="telemetry-label font-display">FEEDS ACTIVE</span>
            <span className="telemetry-sub mono">CF • LC • CC • AC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
