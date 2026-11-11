import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { ListView } from './components/ListView';
import { CalendarView } from './components/CalendarView';
import { ContestModal } from './components/ContestModal';
import { DayDetailModal } from './components/DayDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { getPlatforms, getContests, API_BASE } from './services/api';
import { useTheme } from './utils/theme';
import { WifiOff, RefreshCw, X, Sparkles } from 'lucide-react';
import './styles/components.css';

export function AppSkeleton() {
  return (
    <div className="container" style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Slight Hero Skeleton */}
      <div className="skeleton-box" style={{ height: '148px', borderRadius: '24px' }} />

      {/* Filter Bar Skeleton */}
      <div className="skeleton-box" style={{ height: '96px', borderRadius: '18px' }} />

      {/* Cards Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-box" style={{ height: '170px', borderRadius: '14px' }} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { theme, setTheme } = useTheme();
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Initial load
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [platformResult, contestResult] = await Promise.all([
        getPlatforms(),
        getContests()
      ]);

      if (!platformResult.success || !contestResult.success) {
        const errorMsg = platformResult.error || contestResult.error || 'Backend API is unreachable';
        setApiError(errorMsg);
        setPlatforms([]);
        setAllContests([]);
      } else {
        setApiError(null);
        setPlatforms(platformResult.data || []);
        setAllContests(contestResult.data || []);

        if (selectedPlatforms.length === 0 && (platformResult.data || []).length > 0) {
          setSelectedPlatforms(platformResult.data.map((p) => p.id));
        }
      }
    } catch (err) {
      console.error('Error loading contest data:', err);
      setApiError(err.message || 'Failed to connect to backend server');
      setPlatforms([]);
      setAllContests([]);
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

  // Theme toggle helper (switches between light and dark)
  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // Toggle single platform
  const handleTogglePlatform = (platformId) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformId)) {
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
        const hasMatchingDivision = contest.divisions?.some((d) => {
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
        const matchesTitle = contest.title?.toLowerCase().includes(q);
        const matchesPlatform = (contest.platformName || '').toLowerCase().includes(q);
        const matchesDivision = contest.divisions?.some((d) =>
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* API Down Prompt Banner */}
      {apiError && !bannerDismissed && (
        <div className="api-down-banner">
          <div className="api-down-banner-content">
            <WifiOff size={16} style={{ color: '#ef4444' }} />
            <div className="api-down-text">
              <strong style={{ color: '#ef4444' }}>Live radar server unreachable</strong>
              <span>Could not connect to {API_BASE}. Start the server or check connection.</span>
            </div>
            <button
              className="api-down-retry-btn"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>Retry</span>
            </button>
            <button
              className="api-down-dismiss-btn"
              onClick={() => setBannerDismissed(true)}
              title="Dismiss"
              aria-label="Dismiss banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, paddingBottom: '60px', marginTop: '28px' }}>
        {/* Shimmer Skeleton Loader */}
        {isLoading ? (
          <AppSkeleton />
        ) : apiError && allContests.length === 0 ? (
          /* Backend API Down Card */
          <div className="empty-state-card" style={{ border: '1px solid rgba(239, 68, 68, 0.28)' }}>
            <div
              className="empty-state-icon-box"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.25)' }}
            >
              <WifiOff size={28} />
            </div>
            <h2 className="empty-state-title">Backend Radar Offline</h2>
            <p className="empty-state-desc">
              Unable to reach the live contest radar endpoint at <code style={{ color: '#ef4444' }}>{API_BASE}</code>.
            </p>
            <button
              className="primary-apple-btn"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              style={{ background: '#ef4444' }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Connecting...' : 'Retry Connection'}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Editorial Dashboard Hero Header */}
            <HeroSection
              contests={allContests}
              platforms={platforms}
              timezone={timezone}
              onSelectContest={setSelectedContest}
              onOpenSettings={() => setSettingsOpen(true)}
            />

            {/* Filter Command Panel */}
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
              totalResultsCount={filteredContests.length}
            />

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

      {/* Apple Settings Modal */}
      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        timezone={timezone}
        onTimezoneChange={setTimezone}
        platforms={platforms}
        selectedPlatforms={selectedPlatforms}
        onTogglePlatform={handleTogglePlatform}
        onSelectAllPlatforms={handleSelectAllPlatforms}
      />
    </div>
  );
}
