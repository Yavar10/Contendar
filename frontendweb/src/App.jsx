import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsRibbon } from './components/StatsRibbon';
import { FilterBar } from './components/FilterBar';
import { ListView } from './components/ListView';
import { CalendarView } from './components/CalendarView';
import { ContestModal } from './components/ContestModal';
import { DayDetailModal } from './components/DayDetailModal';
import { getPlatforms, getContests } from './services/api';
import './styles/components.css';

export default function App() {
  const [platforms, setPlatforms] = useState([]);
  const [allContests, setAllContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'live' | 'upcoming'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [timezone, setTimezone] = useState('local');
  const [selectedContest, setSelectedContest] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial load
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [platformList, contestList] = await Promise.all([
        getPlatforms(),
        getContests()
      ]);

      setPlatforms(platformList);
      setAllContests(contestList);

      // Default select all platforms on first load
      if (selectedPlatforms.length === 0 && platformList.length > 0) {
        setSelectedPlatforms(platformList.map((p) => p.id));
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedPlatforms.length]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic background refresh every 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 180000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Toggle single platform
  const handleTogglePlatform = (platformId) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformId)) {
        // Don't allow deselecting all - if last one, keep it or allow toggle
        const next = prev.filter((id) => id !== platformId);
        return next.length > 0 ? next : [platformId];
      } else {
        return [...prev, platformId];
      }
    });
  };

  // Select all platforms
  const handleSelectAllPlatforms = () => {
    if (selectedPlatforms.length === platforms.length) {
      // Toggle to primary 3 platforms
      setSelectedPlatforms(['codeforces', 'leetcode', 'codechef']);
    } else {
      setSelectedPlatforms(platforms.map((p) => p.id));
    }
  };

  // Toggle single division
  const handleToggleDivision = (division) => {
    if (division === 'All') {
      setSelectedDivisions(['All']);
      return;
    }

    setSelectedDivisions((prev) => {
      const filtered = prev.filter((d) => d !== 'All');
      if (filtered.includes(division)) {
        const next = filtered.filter((d) => d !== division);
        return next.length > 0 ? next : ['All'];
      } else {
        return [...filtered, division];
      }
    });
  };

  // Reset divisions to 'All'
  const handleSelectAllDivisions = () => {
    setSelectedDivisions(['All']);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedPlatforms(platforms.map((p) => p.id));
    setSelectedDivisions(['All']);
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Calculate live count
  const liveCount = useMemo(() => {
    return allContests.filter((c) => c.status === 'LIVE').length;
  }, [allContests]);

  // Calculate contest counts per platform
  const contestCountsByPlatform = useMemo(() => {
    const counts = {};
    allContests.forEach((c) => {
      counts[c.platform] = (counts[c.platform] || 0) + 1;
    });
    return counts;
  }, [allContests]);

  // Client-side instant filtered contests
  const filteredContests = useMemo(() => {
    return allContests.filter((contest) => {
      // 1. Platform filter
      if (
        selectedPlatforms.length > 0 &&
        !selectedPlatforms.includes(contest.platform)
      ) {
        return false;
      }

      // 2. Division filter
      if (
        selectedDivisions.length > 0 &&
        !selectedDivisions.includes('All')
      ) {
        const hasMatchingDivision = contest.divisions.some((d) => {
          const dClean = d.toLowerCase().replace(/[^a-z0-9]/g, '');
          return selectedDivisions.some((targetDiv) => {
            const targetClean = targetDiv.toLowerCase().replace(/[^a-z0-9]/g, '');
            return dClean.includes(targetClean) || targetClean.includes(dClean);
          });
        });
        if (!hasMatchingDivision) return false;
      }

      // 3. Status filter
      if (statusFilter !== 'all') {
        if (contest.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      // 4. Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = contest.title.toLowerCase().includes(q);
        const matchesPlatform = contest.platformName.toLowerCase().includes(q);
        const matchesDivision = contest.divisions.some((d) =>
          d.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesPlatform && !matchesDivision) {
          return false;
        }
      }

      return true;
    });
  }, [allContests, selectedPlatforms, selectedDivisions, statusFilter, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        timezone={timezone}
        onTimezoneChange={setTimezone}
        liveCount={liveCount}
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
        selectedPlatforms={selectedPlatforms}
        selectedDivisions={selectedDivisions}
      />

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, paddingBottom: '60px' }}>
        {/* Analytics Stats Ribbon */}
        <StatsRibbon
          contests={filteredContests}
          platforms={platforms}
        />

        {/* Filter Bar Hub */}
        <FilterBar
          platforms={platforms}
          selectedPlatforms={selectedPlatforms}
          onTogglePlatform={handleTogglePlatform}
          onSelectAllPlatforms={handleSelectAllPlatforms}
          selectedDivisions={selectedDivisions}
          onToggleDivision={handleToggleDivision}
          onSelectAllDivisions={handleSelectAllDivisions}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          contestCountsByPlatform={contestCountsByPlatform}
        />

        {/* Loading Spinner */}
        {isLoading ? (
          <div
            className="glass-panel"
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              className="pulse-indicator"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--accent-primary)'
              }}
            />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Syncing live contest schedules from platforms...
            </p>
          </div>
        ) : (
          <>
            {/* View Mode Switching */}
            {viewMode === 'list' ? (
              <ListView
                contests={filteredContests}
                timezone={timezone}
                onSelectContest={setSelectedContest}
                onResetFilters={handleResetFilters}
              />
            ) : (
              <CalendarView
                contests={filteredContests}
                timezone={timezone}
                onSelectContest={setSelectedContest}
                onSelectDay={setSelectedDay}
              />
            )}
          </>
        )}
      </main>

      {/* Contest Details Modal */}
      {selectedContest && (
        <ContestModal
          contest={selectedContest}
          timezone={timezone}
          onClose={() => setSelectedContest(null)}
        />
      )}

      {/* Day Details Modal */}
      {selectedDay && (
        <DayDetailModal
          dayData={selectedDay}
          timezone={timezone}
          onClose={() => setSelectedDay(null)}
          onSelectContest={(contest) => {
            setSelectedDay(null);
            setSelectedContest(contest);
          }}
        />
      )}
    </div>
  );
}
