import React from 'react';
import { Search, X, Check, List, Calendar as CalendarIcon, SlidersHorizontal, Filter } from 'lucide-react';
import { PlatformIcon } from './PlatformIcons';

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
    <div className="filter-command-panel">
      {/* Search, Status, and View Toggle Header */}
      <div className="filter-main-bar">
        {/* Search input with keyboard indicator */}
        <div className="search-field-wrap">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-field"
            placeholder="Filter by contest title, division, or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery ? (
            <button
              className="search-clear-action"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          ) : (
            <span className="search-shortcut-hint">/</span>
          )}
        </div>

        {/* Status Toggle (Segmented control) */}
        <div className="segmented-control">
          {[
            { id: 'all', label: 'All' },
            { id: 'live', label: 'Live' },
            { id: 'upcoming', label: 'Upcoming' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`segmented-tab ${statusFilter === tab.id ? 'is-active' : ''} ${
                tab.id === 'live' && statusFilter === 'live' ? 'is-live' : ''
              }`}
              onClick={() => onStatusFilterChange(tab.id)}
            >
              {tab.id === 'live' && <span className="live-pulse-dot-sm" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="view-toggle-wrap">
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'is-active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Switch to List View"
          >
            <List size={15} />
            <span className="hide-mobile">List</span>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'calendar' ? 'is-active' : ''}`}
            onClick={() => onViewModeChange('calendar')}
            title="Switch to Calendar View"
          >
            <CalendarIcon size={15} />
            <span className="hide-mobile">Calendar</span>
          </button>
        </div>
      </div>

      {/* Platform Filter Row */}
      <div className="filter-row">
        <div className="filter-row-label">
          <SlidersHorizontal size={13} />
          <span>Platforms</span>
          <button
            onClick={onSelectAllPlatforms}
            className="filter-reset-action"
          >
            {isAllPlatformsSelected ? 'Reset' : 'Select All'}
          </button>
        </div>

        <div className="platform-pills">
          {platforms.map((plat) => {
            const isSelected = selectedPlatforms.includes(plat.id);
            const count = contestCountsByPlatform[plat.id] || 0;

            return (
              <button
                key={plat.id}
                className={`platform-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onTogglePlatform(plat.id)}
              >
                <PlatformIcon platform={plat.id} size={15} />
                <span className="platform-btn-name">{plat.name}</span>
                <span className="platform-btn-count">{count}</span>
                {isSelected && <Check size={12} strokeWidth={2.5} className="platform-btn-check" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Division Filter Row */}
      <div className="filter-row">
        <div className="filter-row-label">
          <Filter size={13} />
          <span>Divisions</span>
          <button
            onClick={onSelectAllDivisions}
            className="filter-reset-action"
          >
            All
          </button>
        </div>

        <div className="division-pills">
          {COMMON_DIVISIONS.map((div) => {
            const isSelected =
              div === 'All'
                ? isAllDivisionsSelected
                : selectedDivisions.includes(div);

            return (
              <button
                key={div}
                className={`division-tag-btn ${isSelected ? 'is-selected' : ''}`}
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
