import React from 'react';
import { Calendar, Globe, Download, RefreshCw } from 'lucide-react';
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
    <header className="site-header">
      <div className="container header-container">
        {/* Brand */}
        <div className="brand-lockup">
          <div className="brand-symbol">
            <Calendar size={18} strokeWidth={2.2} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Contendar</span>
            <span className="brand-meta">Contest Radar</span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Live indicator if contests are active */}
          {liveCount > 0 ? (
            <div className="live-status-pill" title={`${liveCount} active contest(s) happening right now`}>
              <span className="live-pulse-dot" />
              <span className="live-status-text">{liveCount} live now</span>
            </div>
          ) : (
            <div className="idle-status-pill">
              <span className="idle-dot" />
              <span>All feeds synced</span>
            </div>
          )}

          {/* Timezone picker */}
          <div className="timezone-control">
            <Globe size={13} className="timezone-icon" />
            <select
              aria-label="Select Timezone"
              className="timezone-select"
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

          {/* Calendar export button */}
          <button
            className="action-btn export-btn"
            onClick={handleExportAll}
            title="Export filtered contests to .ics calendar"
          >
            <Download size={14} />
            <span className="hide-mobile">Sync .ics</span>
          </button>

          {/* Refresh button */}
          <button
            className="icon-btn refresh-btn"
            onClick={onRefresh}
            title="Refresh contest feeds"
            aria-label="Refresh contest feeds"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
}
