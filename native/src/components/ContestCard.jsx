import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { formatDateTime, formatDuration, getCountdown } from '../utils/timeUtils';
import { openContestArena, openGoogleCalendar, shareContest } from '../utils/calendarSync';
import { PlatformIcon } from './PlatformIcons';

export function ContestCard({ contest, timezone, onSelectContest }) {
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = getCountdown(
    contest.startTimeMs,
    contest.status,
    nowMs,
    contest.startTimeMs,
    contest.endTimeMs
  );

  const isLive = contest.status === 'LIVE';

  return (
    <TouchableOpacity
      style={[styles.card, isLive && styles.cardLive]}
      onPress={() => onSelectContest(contest)}
      activeOpacity={0.85}
    >
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.platformBadge}>
          <PlatformIcon platform={contest.platform} size={15} />
          <Text style={styles.platformName}>{contest.platformName}</Text>
        </View>

        {isLive ? (
          <View style={styles.liveBadge}>
            <View style={styles.livePulseDot} />
            <Text style={styles.liveBadgeText}>LIVE NOW</Text>
          </View>
        ) : (
          <View style={styles.countdownBadge}>
            <Feather name="clock" size={11} color={COLORS.accentBlue} />
            <Text style={styles.countdownText}>{countdown.label}</Text>
          </View>
        )}
      </View>

      {/* Contest Title */}
      <Text style={styles.title} numberOfLines={2}>
        {contest.title}
      </Text>

      {/* Division Chips */}
      <View style={styles.divisionsRow}>
        {contest.divisions?.map((div, i) => (
          <View key={i} style={styles.divTag}>
            <Text style={styles.divTagText}>{div}</Text>
          </View>
        ))}
        {contest.type && (
          <View style={[styles.divTag, styles.divTagType]}>
            <Text style={[styles.divTagText, styles.divTagTypeText]}>{contest.type}</Text>
          </View>
        )}
      </View>

      {/* Schedule & Duration Meta */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{formatDateTime(contest.startTimeMs, timezone)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="clock" size={12} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{formatDuration(contest.durationSeconds)}</Text>
        </View>
      </View>

      {/* Live Contest Progress Bar */}
      {isLive && (
        <View style={styles.progressBox}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabelText}>{countdown.label} left</Text>
            <Text style={styles.progressPercentText}>{Math.round(countdown.progress)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(100, Math.max(0, countdown.progress))}%` }
              ]}
            />
          </View>
        </View>
      )}

      {/* Action Footer Buttons */}
      <View style={styles.actionsFooter}>
        <TouchableOpacity
          style={styles.arenaBtn}
          onPress={() => openContestArena(contest.url)}
          activeOpacity={0.7}
        >
          <Text style={styles.arenaBtnText}>Open Arena</Text>
          <Feather name="external-link" size={13} color="#fff" />
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.iconActionBtn}
            onPress={() => openGoogleCalendar(contest)}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-sharp" size={14} color={COLORS.textSecondary} />
            <Text style={styles.iconActionText}>GCal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconActionBtn}
            onPress={() => shareContest(contest)}
            activeOpacity={0.7}
          >
            <Feather name="share-2" size={13} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12
  },
  cardLive: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  platformName: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700'
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.badgeLiveBg,
    borderColor: COLORS.badgeLiveBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentRed
  },
  liveBadgeText: {
    color: COLORS.accentRed,
    fontSize: 10,
    fontWeight: '800'
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.badgeUpcomingBg,
    borderColor: COLORS.badgeUpcomingBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  countdownText: {
    color: COLORS.accentBlue,
    fontSize: 10,
    fontWeight: '700'
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 8
  },
  divisionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10
  },
  divTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6
  },
  divTagText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600'
  },
  divTagType: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)'
  },
  divTagTypeText: {
    color: '#a5b4fc'
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500'
  },
  progressBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  progressLabelText: {
    color: COLORS.accentRed,
    fontSize: 10,
    fontWeight: '700'
  },
  progressPercentText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700'
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accentRed,
    borderRadius: 2
  },
  actionsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle
  },
  arenaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accentBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  arenaBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  secondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  iconActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8
  },
  iconActionText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600'
  }
});

