import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ContestCard } from './ContestCard';
import { groupContestsByTimeline } from '../utils/timeUtils';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export function ListView({
  contests,
  timezone,
  onSelectContest,
  onResetFilters,
  nowMs
}) {
  const groups = groupContestsByTimeline(contests);

  if (contests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <Ionicons name="calendar-clear-outline" size={36} color={COLORS.tertiaryLabel} />
        </View>
        <Text style={styles.emptyTitle}>No Contests Found</Text>
        <Text style={styles.emptyDesc}>
          Try adjusting your search query, clearing division chips, or toggling platforms.
        </Text>
        <TouchableOpacity style={styles.resetBtn} onPress={onResetFilters} activeOpacity={0.7}>
          <Text style={styles.resetBtnText}>Reset All Filters</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderSection = (title, items, isLive = false) => {
    if (!items || items.length === 0) return null;

    return (
      <View key={title} style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            {isLive && <View style={styles.livePulseDot} />}
            <Text style={[styles.sectionTitle, isLive && styles.sectionTitleLive]}>
              {title}
            </Text>
          </View>
          <Text style={styles.sectionCountText}>
            {items.length} {items.length === 1 ? 'Round' : 'Rounds'}
          </Text>
        </View>

        {items.map((contest) => (
          <ContestCard
            key={contest.id}
            contest={contest}
            timezone={timezone}
            onSelectContest={onSelectContest}
            nowMs={nowMs}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderSection('Happening Right Now', groups.live, true)}
      {renderSection('Today', groups.today)}
      {renderSection('Tomorrow', groups.tomorrow)}
      {renderSection('This Week', groups.thisWeek)}
      {renderSection('Later', groups.later)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24
  },
  section: {
    marginBottom: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 8
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.systemRed
  },
  sectionTitle: {
    color: COLORS.secondaryLabel,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase'
  },
  sectionTitleLive: {
    color: COLORS.systemRed
  },
  sectionCountText: {
    color: COLORS.tertiaryLabel,
    fontSize: 12,
    fontWeight: '500'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(118, 118, 128, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.label,
    marginBottom: 6
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 280
  },
  resetBtn: {
    backgroundColor: COLORS.systemBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 18
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  }
});
