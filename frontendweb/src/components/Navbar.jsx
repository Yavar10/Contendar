import React from 'react';
import { Zap, Globe, Download, RefreshCw, Radio } from 'lucide-react';
import { TIMEZONES } from '../utils/timeUtils';
import { downloadFilteredCalendar } from '../utils/calendarSync';

export function Navbar({
  timezone,
  onTimezoneChange,
  liveCount,
  onRefresh,
  isRefreshing,
  selectedPlatforms,
  selectedDivisions
}) {
  const handleExportAll = () => {
    downloadFilteredCalendar(selectedPlatforms, selectedDivisions);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Group */}
        <div className="brand-wrapper" title="CONTENDAR — Competitive Programming Chrono Radar">
          <div className="brand-stamp-icon">
            <Zap size={20} className="fill-current" />
          </div>
          <div className="brand-text-block">
            <div className="brand-title-row">
              <span className="brand-title">CONTENDAR</span>
              <span className="brand-tag mono">v2.5 // RADAR</span>
            </div>
            <div className="brand-subtext mono">
              <span>[CP.CHRONO.TELEMETRY]</span>
              <span className="brand-subtext-sep">/</span>
              <span className="brand-status-feed">4 FEEDS ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions">
          {/* Live Indicator Badge */}
          {liveCount > 0 ? (
            <div
              className="live-radar-badge"
              title={`${liveCount} contest(s) are happening right now!`}
            >
              <div className="equalizer-bars">
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
              </div>
              <span className="live-radar-text mono">
                {liveCount} {liveCount === 1 ? 'SESSION' : 'SESSIONS'} LIVE
              </span>
            </div>
          ) : (
            <div className="radar-idle-badge mono">
              <span className="blinking-radar-dot" style={{ background: '#5d677a', boxShadow: 'none' }} />
              <span>RADAR IDLE // ALL SYNCED</span>
            </div>
          )}

          {/* Timezone Selector */}
          <div className="timezone-select-wrapper">
            <span className="timezone-prefix mono">TZ //</span>
            <select
              aria-label="Select Timezone"
              className="timezone-select mono"
              value={timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.id} value={tz.id}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sync / Export ICS button */}
          <button
            className="btn btn-brutal-primary"
            onClick={handleExportAll}
            title="Export filtered contests to iCalendar (.ics)"
          >
            <Download size={14} />
            <span className="mono font-bold">EXPORT .ICS</span>
          </button>

          {/* Refresh Button */}
          <button
            className="btn-icon-brutal"
            onClick={onRefresh}
            title="Refresh contest feeds"
            aria-label="Refresh contests"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-acid' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
}
