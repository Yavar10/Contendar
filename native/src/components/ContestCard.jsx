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

  const brandColor = contest.platformColor || COLORS.accentBlue;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderLeftColor: brandColor },
        isLive && styles.cardLive
      ]}
      onPress={() => onSelectContest(contest)}
      activeOpacity={0.8}
    >
      {/* Top Meta Line: Platform + Division + Timer Badge */}
      <View style={styles.topRow}>
        <View style={styles.platformMeta}>
          <PlatformIcon platform={contest.platform} size={14} />
          <Text style={[styles.platformName, { color: brandColor }]}>
            {contest.platformName}
          </Text>
          {contest.divisions?.[0] && (
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
            onPress={(e) => {
              openGoogleCalendar(contest);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={(e) => {
              shareContest(contest);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Feather name="share-2" size={13} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.arenaPill, { backgroundColor: brandColor }]}
            onPress={(e) => {
              openContestArena(contest.url);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.arenaText}>Arena</Text>
            <Feather name="arrow-up-right" size={12} color="#fff" />
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
    borderLeftWidth: 3.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8
  },
  cardLive: {
    borderColor: 'rgba(239, 68, 68, 0.35)',
    backgroundColor: 'rgba(239, 68, 68, 0.04)'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  platformMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  platformName: {
    fontSize: 11,
    fontWeight: '700'
  },
  divisionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  divisionText: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600'
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.badgeLiveBg,
    borderColor: COLORS.badgeLiveBorder,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.accentRed
  },
  liveText: {
    color: COLORS.accentRed,
    fontSize: 9,
    fontWeight: '800'
  },
  countdownBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  countdownText: {
    color: COLORS.accentBlue,
    fontSize: 10,
    fontWeight: '700'
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    marginBottom: 8
  },
  liveProgressWrap: {
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 6,
    borderRadius: 6
  },
  liveProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3
  },
  liveProgressTime: {
    color: COLORS.accentRed,
    fontSize: 9,
    fontWeight: '700'
  },
  liveProgressPercent: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700'
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 1.5,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accentRed
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4
  },
  scheduleInfo: {
    flex: 1,
    marginRight: 8
  },
  scheduleText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500'
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  quickActionBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  arenaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  arenaText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800'
  }
});
