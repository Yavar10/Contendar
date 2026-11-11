import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { formatDateTime, formatDuration, getCountdown } from '../utils/timeUtils';
import { openContestArena, openGoogleCalendar, shareContest } from '../utils/calendarSync';
import { PlatformIcon } from './PlatformIcons';

export function ContestCard({
  contest,
  timezone,
  onSelectContest,
  nowMs
}) {
  const isLive = contest.status === 'LIVE';

  const countdown = getCountdown(
    contest.startTimeMs,
    contest.status,
    nowMs || Date.now(),
    contest.startTimeMs,
    contest.endTimeMs
  );

  const brandColor = contest.platformColor || COLORS.systemBlue;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelectContest(contest)}
      activeOpacity={0.7}
    >
      {/* Top Meta Row: Platform + Division + Timer Badge */}
      <View style={styles.topRow}>
        <View style={styles.platformMeta}>
          <PlatformIcon platform={contest.platform} size={15} />
          <Text style={[styles.platformName, { color: brandColor }]}>
            {contest.platformName}
          </Text>
          {Boolean(contest.divisions?.[0]) && (
            <View style={styles.divisionPill}>
              <Text style={styles.divisionText}>{contest.divisions[0]}</Text>
            </View>
          )}
        </View>

        {isLive ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        ) : (
          <View style={styles.countdownBadge}>
            <Text style={styles.countdownText}>
              {countdown.label.replace(/^Starts in /i, 'in ')}
            </Text>
          </View>
        )}
      </View>

      {/* Contest Title */}
      <Text style={styles.title} numberOfLines={2}>
        {contest.title}
      </Text>

      {/* Live Contest Progress Bar */}
      {isLive && (
        <View style={styles.liveProgressWrap}>
          <View style={styles.liveProgressLabels}>
            <Text style={styles.liveProgressTime}>{countdown.label}</Text>
            <Text style={styles.liveProgressPercent}>{Math.round(countdown.progress)}%</Text>
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

      {/* Bottom Row: Date/Time + Quick Actions */}
      <View style={styles.bottomRow}>
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleText} numberOfLines={1}>
            {formatDateTime(contest.startTimeMs, timezone)} · {formatDuration(contest.durationSeconds)}
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => openGoogleCalendar(contest)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.6}
          >
            <Ionicons name="calendar-outline" size={15} color={COLORS.secondaryLabel} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => shareContest(contest)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.6}
          >
            <Feather name="share-2" size={14} color={COLORS.secondaryLabel} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.arenaPill, { backgroundColor: brandColor }]}
            onPress={() => openContestArena(contest.url)}
            activeOpacity={0.7}
          >
            <Text style={styles.arenaPillText}>Arena</Text>
            <Feather name="arrow-up-right" size={11} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.secondarySystemBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  platformMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  platformName: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  divisionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  divisionText: {
    color: COLORS.secondaryLabel,
    fontSize: 10,
    fontWeight: '600'
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 69, 58, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.systemRed
  },
  liveText: {
    color: COLORS.systemRed,
    fontSize: 10,
    fontWeight: '700'
  },
  countdownBadge: {
    backgroundColor: 'rgba(118, 118, 128, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  countdownText: {
    color: COLORS.secondaryLabel,
    fontSize: 11,
    fontWeight: '600'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 22,
    color: COLORS.label,
    marginBottom: 10
  },
  liveProgressWrap: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10
  },
  liveProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  liveProgressTime: {
    color: COLORS.systemRed,
    fontSize: 11,
    fontWeight: '600'
  },
  liveProgressPercent: {
    color: COLORS.secondaryLabel,
    fontSize: 11,
    fontWeight: '600'
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.systemRed,
    borderRadius: 2
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4
  },
  scheduleInfo: {
    flex: 1,
    marginRight: 8
  },
  scheduleText: {
    color: COLORS.secondaryLabel,
    fontSize: 13
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  quickActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(118, 118, 128, 0.18)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  arenaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12
  },
  arenaPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  }
});
