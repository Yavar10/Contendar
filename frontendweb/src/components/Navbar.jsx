import React from 'react';
import {
  Calendar,
  Globe,
  Download,
  RefreshCw,
  Sun,
  Moon,
  Settings,
  List,
  Calendar as CalendarIcon,
  Radio,
  Zap
} from 'lucide-react';
import { TIMEZONES } from '../utils/timeUtils';
import { downloadFilteredCalendar } from '../utils/calendarSync';

export function Navbar({
  timezone,
  onTimezoneChange,
  liveCount,
  onRefresh,
  isRefreshing,
  selectedPlatforms,
  selectedDivisions,
  viewMode,
  onViewModeChange,
  theme,
  onThemeToggle,
  onOpenSettings
}) {
  const handleExportAll = () => {
    downloadFilteredCalendar(selectedPlatforms, selectedDivisions);
  };

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Brand Lockup */}
        <div className="brand-lockup" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-symbol">
            <Zap size={16} strokeWidth={2.4} fill="currentColor" />
          </div>
          <div className="brand-text">
            <span className="brand-name">Contendar</span>
            <span className="brand-meta">Chrono Radar</span>
          </div>
        </div>

        {/* View Mode Segmented Switcher (Center / Apple style) */}
        <div className="header-view-segmented">
          <button
            className={`header-segment-btn ${viewMode === 'list' ? 'is-active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List View"
          >
            <List size={14} />
            <span>List</span>
          </button>
          <button
            className={`header-segment-btn ${viewMode === 'calendar' ? 'is-active' : ''}`}
            onClick={() => onViewModeChange('calendar')}
            title="Calendar View"
          >
            <CalendarIcon size={14} />
            <span>Calendar</span>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Live Status Indicator */}
          {liveCount > 0 ? (
            <div className="live-status-pill" title={`${liveCount} active contest(s) happening right now`}>
              <span className="live-pulse-dot" />
              <span className="live-status-text">{liveCount} live</span>
            </div>
          ) : (
            <div className="idle-status-pill hide-mobile">
              <span className="idle-dot" />
              <span>Synced</span>
            </div>
          )}

          {/* Timezone Dropdown */}
          <div className="timezone-control hide-mobile">
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

          {/* Sync .ics Button */}
          <button
            className="action-btn export-btn hide-mobile"
            onClick={handleExportAll}
            title="Export filtered contests to iCalendar (.ics)"
          >
            <Download size={14} />
            <span>Sync .ics</span>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            className="icon-btn theme-toggle-btn"
            onClick={onThemeToggle}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme appearance"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Settings Trigger */}
          <button
            className="icon-btn settings-btn"
            onClick={onOpenSettings}
            title="Preferences & Settings"
            aria-label="Preferences and settings"
          >
            <Settings size={15} />
          </button>

          {/* Refresh Feed */}
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
