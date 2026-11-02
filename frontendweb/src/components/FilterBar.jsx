import React from 'react';
import { Search, X, Check, List, Calendar as CalendarIcon, SlidersHorizontal, Terminal } from 'lucide-react';

const COMMON_DIVISIONS = [
  'All',
  'Div. 1',
  'Div. 2',
  'Div. 3',
  'Div. 4',
  'Educational',
  'Global',
  'Weekly',
  'Biweekly',
  'Starters'
];

export function FilterBar({
  platforms,
  selectedPlatforms,
  onTogglePlatform,
  onSelectAllPlatforms,
  selectedDivisions,
  onToggleDivision,
  onSelectAllDivisions,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
  contestCountsByPlatform
}) {
  const isAllPlatformsSelected = selectedPlatforms.length === platforms.length;
  const isAllDivisionsSelected = selectedDivisions.includes('All') || selectedDivisions.length === 0;

  return (
    <div className="swiss-panel filter-console swiss-crosshair">
      {/* Top Filter Controls: Search, Status, View Switcher */}
      <div className="filter-console-header">
        {/* Search Bar with Terminal Styling */}
        <div className="search-console-wrapper">
          <Terminal size={15} className="search-console-icon" />
          <input
            type="text"
            className="search-console-input mono"
            placeholder=">> SEARCH CONTESTS (E.G. DIV 2, WEEKLY, STARTERS)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-brutal mono"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status Toggle Segment Control */}
        <div className="status-segments">
          {[
            { id: 'all', label: '01 / ALL' },
            { id: 'live', label: '02 / ● LIVE' },
            { id: 'upcoming', label: '03 / ⏳ UPCOMING' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`status-segment-btn mono ${statusFilter === tab.id ? 'active' : ''} ${
                tab.id === 'live' && statusFilter === 'live' ? 'active-live' : ''
              }`}
              onClick={() => onStatusFilterChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="view-mode-console">
          <button
            className={`view-console-btn mono ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Switch to List Chrono"
          >
            <List size={15} />
            <span>LIST</span>
          </button>
          <button
            className={`view-console-btn mono ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => onViewModeChange('calendar')}
            title="Switch to Poster Calendar"
          >
            <CalendarIcon size={15} />
            <span>CALENDAR</span>
          </button>
        </div>
      </div>

      {/* Platform Filter Section */}
      <div className="filter-block">
        <div className="filter-block-header">
          <div className="filter-block-title-group">
            <span className="filter-block-index mono">01</span>
            <span className="filter-block-label font-display">PLATFORM FEEDS</span>
          </div>
          <button
            onClick={onSelectAllPlatforms}
            className="filter-toggle-link mono"
          >
            {isAllPlatformsSelected ? '[ DESELECT EXTRAS ]' : '[ SELECT ALL (4/4) ]'}
          </button>
        </div>

        <div className="platform-badges-grid">
          {platforms.map((plat) => {
            const isSelected = selectedPlatforms.includes(plat.id);
            const count = contestCountsByPlatform[plat.id] || 0;

            const platformPrefix = {
              codeforces: 'CF',
              leetcode: 'LC',
              codechef: 'CC',
              atcoder: 'AC'
            }[plat.id] || plat.name.slice(0, 2).toUpperCase();

            return (
              <button
                key={plat.id}
                className={`platform-badge-brutal ${isSelected ? 'active' : ''}`}
                style={{
                  '--plat-accent': plat.color,
                }}
                onClick={() => onTogglePlatform(plat.id)}
              >
                <span className="plat-prefix mono">[{platformPrefix}]</span>
                <span className="plat-name font-display">{plat.name}</span>
                <span className="plat-counter mono">{count < 10 ? `0${count}` : count}</span>
                {isSelected && <Check size={12} strokeWidth={3} className="plat-check" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Division Filter Section */}
      <div className="filter-block">
        <div className="filter-block-header">
          <div className="filter-block-title-group">
            <span className="filter-block-index mono">02</span>
            <span className="filter-block-label font-display">DIVISIONS & ROUND TYPES</span>
          </div>
          <button
            onClick={onSelectAllDivisions}
            className="filter-toggle-link mono"
          >
            [ RESET DIVISIONS ]
          </button>
        </div>

        <div className="division-stamps-grid">
          {COMMON_DIVISIONS.map((div) => {
            const isSelected =
              div === 'All'
                ? isAllDivisionsSelected
                : selectedDivisions.includes(div);

            return (
              <button
                key={div}
                className={`division-stamp mono ${isSelected ? 'active' : ''}`}
                onClick={() => onToggleDivision(div)}
              >
                {div}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
