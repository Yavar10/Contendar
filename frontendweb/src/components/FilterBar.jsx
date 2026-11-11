import React, { useRef, useEffect } from 'react';
import {
  Search,
  X,
  Check,
  List,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  Filter,
  RotateCcw
} from 'lucide-react';
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
  contestCountsByPlatform,
  totalResultsCount
}) {
  const searchInputRef = useRef(null);

  const isAllPlatformsSelected = selectedPlatforms.length === platforms.length;
  const isAllDivisionsSelected = selectedDivisions.includes('All') || selectedDivisions.length === 0;
  const hasActiveFilters = !isAllPlatformsSelected || !isAllDivisionsSelected || statusFilter !== 'all' || searchQuery.trim() !== '';

  // Keyboard shortcut '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="filter-command-panel">
      {/* Search & Status Bar */}
      <div className="filter-main-bar">
        {/* Search Field */}
        <div className="search-field-wrap">
          <Search size={15} className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="search-field"
            placeholder="Search contests, divisions, or platforms..."
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

        {/* Apple Segmented Control for Status */}
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

        {/* Results Counter & Reset Action */}
        <div className="filter-meta-actions">
          {totalResultsCount !== undefined && (
            <span className="filter-count-badge">
              {totalResultsCount} {totalResultsCount === 1 ? 'round' : 'rounds'}
            </span>
          )}
          {hasActiveFilters && (
            <button
              className="filter-reset-pill"
              onClick={() => {
                onSelectAllPlatforms();
                onSelectAllDivisions();
                onStatusFilterChange('all');
                onSearchChange('');
              }}
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span className="hide-mobile">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Platform Filter Pills */}
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

      {/* Division Filter Pills */}
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
                className={`division-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onToggleDivision(div)}
              >
                <span>{div}</span>
                {isSelected && div !== 'All' && (
                  <Check size={11} strokeWidth={2.5} className="division-btn-check" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
