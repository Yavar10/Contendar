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
  onResetFilters
}) {
  const groups = groupContestsByTimeline(contests);

  if (contests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <MaterialCommunityIcons name="calendar-blank-outline" size={36} color={COLORS.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>No Contests Match Filters</Text>
        <Text style={styles.emptyDesc}>
          Try clearing search, adjusting platform filters, or selecting "All Divisions".
        </Text>
        <TouchableOpacity style={styles.resetBtn} onPress={onResetFilters} activeOpacity={0.7}>
          <Feather name="refresh-cw" size={14} color="#fff" />
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
    paddingTop: 8,
    paddingBottom: 24
  },
  section: {
    marginBottom: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accentRed
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  sectionTitleLive: {
    color: COLORS.accentRed
  },
  sectionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
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
    padding: 36,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 20
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6
  },
  emptyDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accentBlue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  }
});

