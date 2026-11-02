import React from 'react';
import { Search, X, Check, Filter, List, Calendar as CalendarIcon, SlidersHorizontal } from 'lucide-react';

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
    <div className="glass-panel filter-hub">
      {/* Top Controls: Search, Status Filter & View Mode Switcher */}
      <div className="filter-row">
        {/* Search Bar */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search contests (e.g. Div 2, Weekly, Starters)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'live', label: '🔴 Live Now' },
            { id: 'upcoming', label: '⏳ Upcoming' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`division-chip ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => onStatusFilterChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="view-switcher">
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Switch to List View"
          >
            <List size={16} />
            <span>List View</span>
          </button>
          <button
            className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => onViewModeChange('calendar')}
            title="Switch to Calendar View"
          >
            <CalendarIcon size={16} />
            <span>Calendar View</span>
          </button>
        </div>
      </div>

      {/* Platform Filter Section */}
      <div>
        <div className="filter-section-title">
          <SlidersHorizontal size={14} />
          <span>Platforms</span>
          <button
            onClick={onSelectAllPlatforms}
            style={{
              marginLeft: 'auto',
              fontSize: '0.72rem',
              color: 'var(--accent-primary)',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {isAllPlatformsSelected ? 'Deselect Extra' : 'Select All Platforms'}
          </button>
        </div>

        <div className="platform-chips">
          {platforms.map((plat) => {
            const isSelected = selectedPlatforms.includes(plat.id);
            const count = contestCountsByPlatform[plat.id] || 0;

            return (
              <button
                key={plat.id}
                className={`platform-chip ${isSelected ? 'active' : ''}`}
                style={{
                  '--chip-color': plat.color,
                  '--chip-bg': plat.badgeBg,
                  '--chip-glow': `${plat.color}33`
                }}
                onClick={() => onTogglePlatform(plat.id)}
              >
                <span
                  className="platform-dot"
                  style={{ background: plat.color }}
                />
                <span>{plat.name}</span>
                <span className="chip-count">{count}</span>
                {isSelected && <Check size={13} style={{ strokeWidth: 3 }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Division Filter Section */}
      <div>
        <div className="filter-section-title">
          <Filter size={14} />
          <span>Filter by Division & Round Type</span>
          <button
            onClick={onSelectAllDivisions}
            style={{
              marginLeft: 'auto',
              fontSize: '0.72rem',
              color: 'var(--accent-primary)',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Reset to All Divisions
          </button>
        </div>

        <div className="division-chips">
          {COMMON_DIVISIONS.map((div) => {
            const isSelected =
              div === 'All'
                ? isAllDivisionsSelected
                : selectedDivisions.includes(div);

            return (
              <button
                key={div}
                className={`division-chip ${isSelected ? 'active' : ''}`}
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
