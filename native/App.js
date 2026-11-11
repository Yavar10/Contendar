import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform
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
import { ListView } from './src/components/ListView';
import { CalendarView } from './src/components/CalendarView';

import { ContestModal } from './src/components/ContestModal';
import { DayDetailModal } from './src/components/DayDetailModal';
import { FilterModal } from './src/components/FilterModal';
import { SettingsModal } from './src/components/SettingsModal';

import { getPlatforms, getContests, getApiBaseUrl } from './src/services/api';
import { syncContestsToWidget } from './src/services/widgetBridge';
import { isSameDay } from './src/utils/timeUtils';
import * as Linking from 'expo-linking';
import { COLORS, TYPOGRAPHY } from './src/constants/theme';

export default function App() {
  const [platforms, setPlatforms] = useState([]);
  const [allContests, setAllContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'live' | 'upcoming'
  const [viewMode, setViewMode] = useState('calendar'); // Default to 'calendar'
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

  // Centralized 1-second ticker for live countdowns
  const [nowMs, setNowMs] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Widget deep link handler (contendar://contest/:id or contendar://date/:isoDate)
  useEffect(() => {
    const handleUrl = (event) => {
      if (!event?.url) return;
      try {
        const parsed = Linking.parse(event.url);
        if (parsed.hostname === 'contest' || parsed.path?.includes('contest')) {
          const contestId = parsed.queryParams?.id || parsed.path?.split('/').pop();
          if (contestId) {
            const target = allContests.find((c) => String(c.id) === String(contestId));
            if (target) {
              setSelectedContest(target);
            }
          }
        } else if (parsed.hostname === 'date' || parsed.path?.includes('date')) {
          const dateStr = parsed.queryParams?.date || parsed.path?.split('/').pop();
          if (dateStr) {
            const targetDate = new Date(dateStr);
            if (!isNaN(targetDate.getTime())) {
              const dayMatches = allContests.filter((c) => isSameDay(c.startTimeMs, targetDate));
              setSelectedDay({ date: targetDate, contests: dayMatches });
            }
          }
        }
      } catch (e) {
        console.warn('Error handling deep link:', e);
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => subscription.remove();
  }, [allContests]);

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

        // Sync fresh contest data to iOS & Android native widgets
        syncContestsToWidget(contestResult.data || [], timezone);

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

  // Filtered contests
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
        <StatusBar style="light" backgroundColor={COLORS.systemBackground} />

        {/* 1. Apple Large Title Navigation Header */}
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

        {/* 2. Expandable Apple Search Bar */}
        <SearchBar
          visible={isSearchVisible}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => {
            setSearchQuery('');
            setIsSearchVisible(false);
          }}
        />

        {/* 3. Main Dashboard Scroll */}
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.mainScrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadData(true)}
              tintColor={COLORS.systemBlue}
              colors={[COLORS.systemBlue]}
            />
          }
        >
          {/* A. Graphic Up Top: Chrono Radar Precision Instrument */}
          {!apiError && (
            <RadarHero
              contests={allContests}
              onSelectContest={setSelectedContest}
              nowMs={nowMs}
            />
          )}

          {/* B. Platform Filter Chips */}
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

          {/* D. iOS Segmented Control: Calendar vs Timeline */}
          {!apiError && (
            <ViewSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
          )}

          {/* E. Content: Calendar View Fitted at Bottom or Timeline */}
          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={COLORS.systemBlue} />
              <Text style={styles.loadingTitle}>Connecting to Feeds...</Text>
              <Text style={styles.loadingSubtitle}>
                Aggregating Codeforces, LeetCode, CodeChef, and AtCoder
              </Text>
            </View>
          ) : apiError && allContests.length === 0 ? (
            /* Apple System Empty / Offline State */
            <View style={styles.errorCard}>
              <View style={styles.errorIconBox}>
                <Ionicons name="cloud-offline-outline" size={32} color={COLORS.systemRed} />
              </View>
              <Text style={styles.errorTitle}>Cannot Connect to Server</Text>
              <Text style={styles.errorDesc}>
                {`Could not connect to backend at\n${getApiBaseUrl()}\nPlease check your internet connection or start the local backend.`}
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
                  <Text style={styles.retryBtnText}>
                    {isRefreshing ? 'Retrying...' : 'Try Again'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.configBtn}
                  onPress={() => setIsSettingsModalOpen(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.configBtnText}>Server IP</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : viewMode === 'calendar' ? (
            /* Fits Calendar View at the Bottom of Starting Screen */
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

        {/* Contest Details Sheet */}
        <ContestModal
          contest={selectedContest}
          timezone={timezone}
          onClose={() => setSelectedContest(null)}
        />

        {/* Calendar Day Inspection Sheet */}
        <DayDetailModal
          dayData={selectedDay}
          timezone={timezone}
          onClose={() => setSelectedDay(null)}
          onSelectContest={(contest) => {
            setSelectedDay(null);
            setSelectedContest(contest);
          }}
        />

        {/* Filter Sheet */}
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

        {/* Settings & Timezone Sheet */}
        <SettingsModal
          visible={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          currentTimezone={timezone}
          onSelectTimezone={(tz) => {
            setTimezone(tz);
            syncContestsToWidget(allContests, tz);
          }}
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
    backgroundColor: COLORS.systemBackground
  },
  mainScroll: {
    flex: 1,
    backgroundColor: COLORS.systemBackground
  },
  mainScrollContent: {
    paddingBottom: 28
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.secondarySystemBackground,
    borderRadius: 20
  },
  loadingTitle: {
    color: COLORS.label,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 14
  },
  loadingSubtitle: {
    color: COLORS.secondaryLabel,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240
  },
  errorCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.secondarySystemBackground,
    borderRadius: 20
  },
  errorIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 69, 58, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  errorTitle: {
    color: COLORS.label,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 6
  },
  errorDesc: {
    color: COLORS.secondaryLabel,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16
  },
  terminalBox: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20
  },
  terminalText: {
    color: COLORS.systemTeal,
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontWeight: '500'
  },
  errorActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  retryBtn: {
    backgroundColor: COLORS.systemBlue,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  configBtn: {
    backgroundColor: 'rgba(118, 118, 128, 0.24)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18
  },
  configBtnText: {
    color: COLORS.label,
    fontSize: 14,
    fontWeight: '500'
  }
});
