import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';

import { Header } from './src/components/Header';
import { SearchBar } from './src/components/SearchBar';
import { RadarHero } from './src/components/RadarHero';
import { ViewSwitcher } from './src/components/ViewSwitcher';
import { PlatformChips } from './src/components/PlatformChips';
import { ActiveFiltersRow } from './src/components/ActiveFiltersRow';
import { TelemetryTicker } from './src/components/TelemetryTicker';
import { ListView } from './src/components/ListView';
import { CalendarView } from './src/components/CalendarView';

import { ContestModal } from './src/components/ContestModal';
import { DayDetailModal } from './src/components/DayDetailModal';
import { FilterModal } from './src/components/FilterModal';
import { SettingsModal } from './src/components/SettingsModal';

import { getPlatforms, getContests, getApiBaseUrl } from './src/services/api';
import { COLORS } from './src/constants/theme';

export default function App() {
  const [platforms, setPlatforms] = useState([]);
  const [allContests, setAllContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'live' | 'upcoming'
  const [viewMode, setViewMode] = useState('calendar'); // Default to 'calendar' so calendar fits on starting screen
  const [timezone, setTimezone] = useState('local');

  // UI state
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // Loading & status
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Centralized 1-second ticker for all live countdowns (prevents multiple intervals)
  const [nowMs, setNowMs] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

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

        // Default select all platforms on first load
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

  const handleSelectAllDivisions = () => {
    setSelectedDivisions(['All']);
  };

  const handleRemoveDivision = (division) => {
    setSelectedDivisions((prev) => {
      const next = prev.filter((d) => d !== division);
      return next.length > 0 ? next : ['All'];
    });
  };

  const handleResetAllFilters = () => {
    setSelectedPlatforms(platforms.map((p) => p.id));
    setSelectedDivisions(['All']);
    setSearchQuery('');
    setStatusFilter('all');
    setIsSearchVisible(false);
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

  // Active filter badge count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (selectedDivisions.length > 0 && !selectedDivisions.includes('All')) {
      count += selectedDivisions.length;
    }
    if (selectedPlatforms.length > 0 && selectedPlatforms.length < platforms.length) {
      count++;
    }
    return count;
  }, [statusFilter, selectedDivisions, selectedPlatforms, platforms]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" backgroundColor={COLORS.bgPrimary} />

        {/* 1. Apple-style Top Header */}
        <Header
          liveCount={liveCount}
          isSearchVisible={isSearchVisible}
          onToggleSearch={() => {
            if (isSearchVisible) setSearchQuery('');
            setIsSearchVisible(!isSearchVisible);
          }}
          onOpenFilterModal={() => setIsFilterModalOpen(true)}
          activeFilterCount={activeFilterCount}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          hasApiError={Boolean(apiError)}
        />

        {/* 2. Expandable Search Bar */}
        <SearchBar
          visible={isSearchVisible}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => {
            setSearchQuery('');
            setIsSearchVisible(false);
          }}
        />

        {/* 3. Main Scrollable Dashboard */}
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.mainScrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadData(true)}
              tintColor={COLORS.appleBlue}
              colors={[COLORS.appleBlue]}
            />
          }
        >
          {/* A. Graphic Up Top: Alive Radar Hero Section */}
          {!apiError && (
            <RadarHero
              contests={allContests}
              onSelectContest={setSelectedContest}
              nowMs={nowMs}
            />
          )}

          {/* B. Platform Frosted Glass Pills */}
          {platforms.length > 0 && (
            <PlatformChips
              platforms={platforms}
              selectedPlatforms={selectedPlatforms}
              onTogglePlatform={handleTogglePlatform}
              onSelectAllPlatforms={handleSelectAllPlatforms}
              contestCountsByPlatform={contestCountsByPlatform}
            />
          )}

          {/* C. Active Filters Row (if any) */}
          <ActiveFiltersRow
            statusFilter={statusFilter}
            onResetStatus={() => setStatusFilter('all')}
            selectedDivisions={selectedDivisions}
            onRemoveDivision={handleRemoveDivision}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onResetAll={handleResetAllFilters}
          />

          {/* D. Segmented View Switcher: Calendar View vs Timeline */}
          {!apiError && (
            <ViewSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
          )}

          {/* E. Content: Calendar View Fitted at Bottom of Starting Screen, or Timeline */}
          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={COLORS.appleBlue} />
              <Text style={styles.loadingTitle}>Connecting to Radar Feeds...</Text>
              <Text style={styles.loadingSubtitle}>
                Aggregating Codeforces, LeetCode, CodeChef, and AtCoder
              </Text>
            </View>
          ) : apiError && allContests.length === 0 ? (
            /* Backend API Down Prompt Card */
            <View style={styles.errorCard}>
              <View style={styles.errorIconBox}>
                <Feather name="wifi-off" size={28} color={COLORS.appleRed} />
              </View>
              <Text style={styles.errorTitle}>Backend Server Unreachable</Text>
              <Text style={styles.errorDesc}>
                Could not connect to backend at{'\n'}
                <Text style={styles.errorUrl}>{getApiBaseUrl()}</Text>
                {'\n'}Please start the backend server to load live contests.
              </Text>
              <View style={styles.terminalBox}>
                <Text style={styles.terminalText}>cd backend && npm run dev</Text>
              </View>
              <View style={styles.errorActionsRow}>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => loadData(true)}
                  disabled={isRefreshing}
                  activeOpacity={0.7}
                >
                  <Feather name="refresh-cw" size={13} color="#fff" />
                  <Text style={styles.retryBtnText}>
                    {isRefreshing ? 'Retrying...' : 'Retry Connection'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.configBtn}
                  onPress={() => setIsSettingsModalOpen(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="settings-outline" size={13} color={COLORS.textPrimary} />
                  <Text style={styles.configBtnText}>Server IP</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : viewMode === 'calendar' ? (
            /* Fits the Calendar in the Starting Screen at the Bottom */
            <CalendarView
              contests={filteredContests}
              timezone={timezone}
              onSelectContest={setSelectedContest}
              onSelectDay={setSelectedDay}
            />
          ) : (
            <ListView
              contests={filteredContests}
              timezone={timezone}
              onSelectContest={setSelectedContest}
              onResetFilters={handleResetAllFilters}
              nowMs={nowMs}
            />
          )}
        </ScrollView>

        {/* Deep Contest Details Modal */}
        <ContestModal
          contest={selectedContest}
          timezone={timezone}
          onClose={() => setSelectedContest(null)}
        />

        {/* Calendar Day Inspection Drawer */}
        <DayDetailModal
          dayData={selectedDay}
          timezone={timezone}
          onClose={() => setSelectedDay(null)}
          onSelectContest={(contest) => {
            setSelectedDay(null);
            setSelectedContest(contest);
          }}
        />

        {/* Filter Bottom Sheet Modal */}
        <FilterModal
          visible={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          platforms={platforms}
          selectedPlatforms={selectedPlatforms}
          onTogglePlatform={handleTogglePlatform}
          onSelectAllPlatforms={handleSelectAllPlatforms}
          selectedDivisions={selectedDivisions}
          onToggleDivision={handleToggleDivision}
          onSelectAllDivisions={handleSelectAllDivisions}
          onResetAllFilters={handleResetAllFilters}
          resultCount={filteredContests.length}
        />

        {/* Settings & Timezone Modal */}
        <SettingsModal
          visible={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          currentTimezone={timezone}
          onSelectTimezone={setTimezone}
          onRefresh={() => loadData(true)}
          isRefreshing={isRefreshing}
          hasApiError={Boolean(apiError)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary
  },
  mainScroll: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary
  },
  mainScrollContent: {
    paddingBottom: 28
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 18
  },
  loadingTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12
  },
  loadingSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4
  },
  errorCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: 'rgba(255, 69, 58, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.25)',
    borderRadius: 18
  },
  errorIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 69, 58, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  errorTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6
  },
  errorDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12
  },
  errorUrl: {
    color: COLORS.appleRed,
    fontWeight: '700'
  },
  terminalBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16
  },
  terminalText: {
    color: COLORS.appleBlue,
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600'
  },
  errorActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.appleBlue,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  configBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10
  },
  configBtnText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600'
  }
});
