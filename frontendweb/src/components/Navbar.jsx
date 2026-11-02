import React from 'react';
import { Zap, Globe, Download, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
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
        {/* Brand */}
        <div className="brand-wrapper">
          <div className="brand-icon">
            <Zap size={22} className="fill-white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="brand-title">ContestPulse</h1>
              <span className="brand-badge">PRO</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Live & Upcoming CP Contests
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions">
          {/* Live Indicator Badge */}
          {liveCount > 0 ? (
            <div
              className="status-badge live"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              title={`${liveCount} contest(s) are happening right now!`}
            >
              <span
                className="pulse-indicator"
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}
              />
              <span>{liveCount} LIVE NOW</span>
            </div>
          ) : (
            <div
              className="status-badge upcoming"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              <CalendarIcon size={14} />
              <span>Synced & Ready</span>
            </div>
          )}

          {/* Timezone Selector */}
          <div className="timezone-select-wrapper">
            <Globe
              size={15}
              style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)', pointerEvents: 'none' }}
            />
            <select
              aria-label="Select Timezone"
              className="timezone-select"
              value={timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
              style={{ paddingLeft: '32px' }}
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
            className="btn btn-secondary"
            onClick={handleExportAll}
            title="Export filtered contests to iCalendar (.ics)"
          >
            <Download size={15} />
            <span className="hide-mobile">Sync .ics</span>
          </button>

          {/* Refresh Button */}
          <button
            className="btn-icon"
            onClick={onRefresh}
            title="Refresh contest feeds"
            aria-label="Refresh contests"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
}
