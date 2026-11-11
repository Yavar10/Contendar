import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ContestCard } from './ContestCard';
import { groupContestsByTimeline } from '../utils/timeUtils';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
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
          <MaterialCommunityIcons name="calendar-blank-outline" size={32} color={COLORS.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>No Contests Found</Text>
        <Text style={styles.emptyDesc}>
          Try adjusting your search query, clearing division chips, or toggling platforms.
        </Text>
        <TouchableOpacity style={styles.resetBtn} onPress={onResetFilters} activeOpacity={0.7}>
          <Feather name="refresh-cw" size={13} color="#fff" />
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
          <View style={[styles.sectionBadge, isLive && styles.sectionBadgeLive]}>
            <Text style={[styles.sectionBadgeText, isLive && styles.sectionBadgeTextLive]}>
              {items.length} {items.length === 1 ? 'round' : 'rounds'}
            </Text>
          </View>
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
    marginBottom: 14
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 4
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
    backgroundColor: COLORS.accentRed
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase'
  },
  sectionTitleLive: {
    color: COLORS.accentRed
  },
  sectionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8
  },
  sectionBadgeLive: {
    backgroundColor: COLORS.badgeLiveBg
  },
  sectionBadgeText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700'
  },
  sectionBadgeTextLive: {
    color: COLORS.accentRed
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 16,
    marginTop: 16
  },
  emptyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4
  },
  emptyDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accentBlue,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  }
});
