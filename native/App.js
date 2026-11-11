import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Header } from './src/components/Header';
import { ApiBanner } from './src/components/ApiBanner';
import { StatsRibbon } from './src/components/StatsRibbon';
import { FilterBar } from './src/components/FilterBar';
import { ListView } from './src/components/ListView';
import { CalendarView } from './src/components/CalendarView';
import { ContestModal } from './src/components/ContestModal';
import { DayDetailModal } from './src/components/DayDetailModal';
import { TimezoneModal } from './src/components/TimezoneModal';
import { ServerConfigModal } from './src/components/ServerConfigModal';

import { getPlatforms, getContests } from './src/services/api';
import { COLORS } from './src/constants/theme';

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
  const [timezoneModalVisible, setTimezoneModalVisible] = useState(false);
  const [serverModalVisible, setServerModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
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

      setPlatforms(platformResult.data);
      setAllContests(contestResult.data);

      const fallback = platformResult.isFallback || contestResult.isFallback;
      setIsUsingFallback(fallback);
      if (!fallback) setBannerDismissed(false);

      // Default select all platforms on first load
      if (selectedPlatforms.length === 0 && platformResult.data.length > 0) {
        setSelectedPlatforms(platformResult.data.map((p) => p.id));
      }
    } catch (err) {
      console.error('Error loading contest data:', err);
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
        const matchesTitle = contest.title.toLowerCase().includes(q);
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
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" backgroundColor={COLORS.bgPrimary} />

        {/* Top App Header */}
        <Header
          liveCount={liveCount}
          timezone={timezone}
          onOpenTimezoneModal={() => setTimezoneModalVisible(true)}
          onRefresh={() => loadData(true)}
          isRefreshing={isRefreshing}
          onOpenServerModal={() => setServerModalVisible(true)}
          isUsingFallback={isUsingFallback}
        />

        {/* Fallback demo mode alert banner */}
        {isUsingFallback && !bannerDismissed && (
          <ApiBanner
            onRetry={() => loadData(true)}
            onConfigure={() => setServerModalVisible(true)}
            onDismiss={() => setBannerDismissed(true)}
            isRefreshing={isRefreshing}
          />
        )}

        {/* Main scrollable body */}
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.mainScrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadData(true)}
              tintColor={COLORS.accentBlue}
              colors={[COLORS.accentBlue]}
            />
          }
        >
          {/* Analytics Stats Ribbon */}
          <StatsRibbon
            contests={filteredContests}
            platforms={platforms}
          />

          {/* Filter Bar */}
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

          {/* Loading Indicator or Views */}
          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={COLORS.accentBlue} />
              <Text style={styles.loadingTitle}>Loading CP Radar Schedules...</Text>
              <Text style={styles.loadingSubtitle}>
                Syncing verified rounds from Codeforces, LeetCode, CodeChef, and AtCoder
              </Text>
            </View>
          ) : viewMode === 'list' ? (
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
        </ScrollView>

        {/* Contest Details Modal */}
        <ContestModal
          contest={selectedContest}
          timezone={timezone}
          onClose={() => setSelectedContest(null)}
        />

        {/* Day Inspection Modal */}
        <DayDetailModal
          dayData={selectedDay}
          timezone={timezone}
          onClose={() => setSelectedDay(null)}
          onSelectContest={(contest) => {
            setSelectedDay(null);
            setSelectedContest(contest);
          }}
        />

        {/* Timezone Selector Modal */}
        <TimezoneModal
          visible={timezoneModalVisible}
          currentTimezone={timezone}
          onSelectTimezone={setTimezone}
          onClose={() => setTimezoneModalVisible(false)}
        />

        {/* Backend API Settings Modal */}
        <ServerConfigModal
          visible={serverModalVisible}
          onClose={() => setServerModalVisible(false)}
          onServerSaved={() => loadData(true)}
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
    paddingBottom: 40
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 16
  },
  loadingTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 14
  },
  loadingSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16
  }
});
