import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsRibbon } from './components/StatsRibbon';
import { FilterBar } from './components/FilterBar';
import { ListView } from './components/ListView';
import { CalendarView } from './components/CalendarView';
import { ContestModal } from './components/ContestModal';
import { DayDetailModal } from './components/DayDetailModal';
import { getPlatforms, getContests } from './services/api';
import { WifiOff, RefreshCw, X } from 'lucide-react';
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
      />

      {/* API Down Prompt Banner */}
      {apiError && !bannerDismissed && (
        <div className="api-down-banner" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div className="api-down-banner-content">
            <WifiOff size={16} className="api-down-icon" style={{ color: '#ef4444' }} />
            <div className="api-down-text">
              <strong style={{ color: '#ef4444' }}>Backend API is unreachable</strong>
              <span>Cannot connect to backend server. Start the backend with "npm run dev" to load contests.</span>
            </div>
            <button
              className="api-down-retry-btn"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}
            >
              <RefreshCw size={13} className={isRefreshing ? 'spin-icon' : ''} />
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
      <main className="container" style={{ flex: 1, paddingBottom: '60px', marginTop: '24px' }}>
        {/* Loading Spinner */}
        {isLoading ? (
          <div
            className="rounded-card"
            style={{
              padding: '64px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div className="gentle-spinner" />
            <div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}>
                Connecting to backend API...
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                Fetching verified contest schedules
              </p>
            </div>
          </div>
        ) : apiError && allContests.length === 0 ? (
          /* Backend API Down Prompt Card */
          <div
            className="rounded-card"
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '560px',
              margin: '32px auto 0',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.04)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <WifiOff size={28} color="#ef4444" />
            </div>
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700 }}>
                Backend Server Unreachable
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px', lineHeight: 1.5 }}>
                Could not connect to the contest radar backend server at <code style={{ color: '#ef4444' }}>https://contendar.onrender.com/api</code>.
                <br />
                Please check your network connection or verify that the backend is active.
              </p>
            </div>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 16px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#3b82f6'
              }}
            >
              cd backend &amp;&amp; npm run dev
            </div>
            <button
              className="api-down-retry-btn"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              style={{
                marginTop: '8px',
                padding: '8px 20px',
                fontSize: '0.875rem',
                background: '#3b82f6',
                color: '#fff',
                borderColor: 'transparent'
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} />
              <span>{isRefreshing ? 'Retrying...' : 'Retry Connection'}</span>
            </button>
          </div>
        ) : (
          <>
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
