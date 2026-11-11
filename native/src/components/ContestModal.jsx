import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { formatDateTime, formatDuration, getCountdown } from '../utils/timeUtils';
import {
  openContestArena,
  openGoogleCalendar,
  shareContest,
  copyContestLink
} from '../utils/calendarSync';
import { PlatformIcon } from './PlatformIcons';
import { AppleBottomSheet } from './AppleBottomSheet';

export function ContestModal({ contest, timezone, onClose }) {
  const [nowMs, setNowMs] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!contest) return;
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [Boolean(contest)]);

  const isLive = contest?.status === 'LIVE';

  const countdown = contest
    ? getCountdown(
        contest.startTimeMs,
        contest.status,
        nowMs,
        contest.startTimeMs,
        contest.endTimeMs
      )
    : null;

  const handleCopy = async () => {
    if (!contest) return;
    const ok = await copyContestLink(contest);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AppleBottomSheet
      visible={Boolean(contest)}
      onClose={onClose}
      maxHeight="86%"
    >
      {Boolean(contest) && (
        <>
          {/* Apple Navigation Bar */}
          <View style={styles.header}>
            <View style={styles.headerPlatform}>
              <PlatformIcon platform={contest.platform} size={18} />
              <Text style={styles.headerPlatformName}>{contest.platformName}</Text>
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.6}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Contest Title */}
            <Text style={styles.title}>{contest.title}</Text>

            {/* Countdown Banner */}
            {Boolean(countdown) && (
              <View style={[styles.timerBanner, isLive && styles.timerBannerLive]}>
                <View style={styles.timerContent}>
                  <Text style={[styles.timerLabel, isLive && styles.timerLabelLive]}>
                    {isLive ? 'ENDS IN' : 'STARTS IN'}
                  </Text>
                  <Text style={[styles.timerValue, isLive && styles.timerValueLive]}>
                    {countdown.label.replace(/^(Starts in |Ends in )/i, '')}
                  </Text>
                </View>

                {isLive ? (
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveBadgeText}>LIVE</Text>
                  </View>
                ) : (
                  <View style={styles.upcomingBadge}>
                    <Text style={styles.upcomingBadgeText}>UPCOMING</Text>
                  </View>
                )}
              </View>
            )}

            {/* Live Progress Bar */}
            {isLive && Boolean(countdown) && (
              <View style={styles.progressWrap}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressSubText}>Round progress</Text>
                  <Text style={styles.progressSubText}>{Math.round(countdown.progress)}%</Text>
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

            {/* Inset Grouped Schedule Details */}
            <View style={styles.metaSection}>
              <Text style={styles.sectionHeader}>SCHEDULE DETAILS</Text>
              <View style={styles.groupedTable}>
                <View style={styles.tableRow}>
                  <Text style={styles.rowLabel}>Starts</Text>
                  <Text style={styles.rowValue}>
                    {formatDateTime(contest.startTimeMs, timezone)}
                  </Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.tableRow}>
                  <Text style={styles.rowLabel}>Ends</Text>
                  <Text style={styles.rowValue}>
                    {formatDateTime(contest.endTimeMs, timezone)}
                  </Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.tableRow}>
                  <Text style={styles.rowLabel}>Duration</Text>
                  <Text style={styles.rowValue}>
                    {formatDuration(contest.durationSeconds)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Inset Grouped Divisions */}
            <View style={styles.metaSection}>
              <Text style={styles.sectionHeader}>ELIGIBLE DIVISIONS</Text>
              <View style={styles.divisionsRow}>
                {contest.divisions?.map((div, i) => (
                  <View key={i} style={styles.divisionPill}>
                    <Text style={styles.divisionPillText}>{div}</Text>
                  </View>
                ))}
                {Boolean(contest.type) && (
                  <View style={[styles.divisionPill, styles.typePill]}>
                    <Text style={[styles.divisionPillText, styles.typePillText]}>
                      {contest.type}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Primary Action: Open Arena */}
            <TouchableOpacity
              style={[styles.primaryBtn, isLive && styles.primaryBtnLive]}
              onPress={() => openContestArena(contest.url)}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryBtnText}>Open Contest Arena</Text>
              <Feather name="arrow-up-right" size={16} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Secondary Action Row */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => openGoogleCalendar(contest)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={16} color={COLORS.systemBlue} />
                <Text style={styles.actionBtnText}>Add to Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleCopy}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={16}
                  color={copied ? COLORS.systemGreen : COLORS.label}
                />
                <Text style={[styles.actionBtnText, copied && { color: COLORS.systemGreen }]}>
                  {copied ? 'Copied' : 'Copy Link'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => shareContest(contest)}
                activeOpacity={0.7}
              >
                <Feather name="share-2" size={15} color={COLORS.label} />
                <Text style={styles.actionBtnText}>Share</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      )}
    </AppleBottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  headerPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerPlatformName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.label
  },
  doneBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  doneBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.systemBlue
  },
  body: {
    paddingHorizontal: 20
  },
  bodyContent: {
    paddingBottom: 28
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.35,
    lineHeight: 28,
    color: COLORS.label,
    marginBottom: 16
  },
  timerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12
  },
  timerBannerLive: {
    backgroundColor: 'rgba(255, 69, 58, 0.14)'
  },
  timerContent: {
    flex: 1
  },
  timerLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: COLORS.systemBlue,
    marginBottom: 2
  },
  timerLabelLive: {
    color: COLORS.systemRed
  },
  timerValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.label
  },
  timerValueLive: {
    color: COLORS.label
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 69, 58, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.systemRed
  },
  liveBadgeText: {
    color: COLORS.systemRed,
    fontSize: 10,
    fontWeight: '700'
  },
  upcomingBadge: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  upcomingBadgeText: {
    color: COLORS.systemBlue,
    fontSize: 10,
    fontWeight: '700'
  },
  progressWrap: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  progressSubText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.secondaryLabel
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
  metaSection: {
    marginBottom: 16
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: COLORS.secondaryLabel,
    marginBottom: 6,
    paddingLeft: 2
  },
  groupedTable: {
    backgroundColor: COLORS.tertiarySystemBackground,
    borderRadius: 12,
    overflow: 'hidden'
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(84, 84, 88, 0.36)'
  },
  rowLabel: {
    fontSize: 15,
    color: COLORS.label
  },
  rowValue: {
    fontSize: 15,
    color: COLORS.secondaryLabel
  },
  divisionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  divisionPill: {
    backgroundColor: COLORS.tertiarySystemBackground,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  divisionPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.label
  },
  typePill: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)'
  },
  typePillText: {
    color: COLORS.systemBlue
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.systemBlue,
    height: 48,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 12
  },
  primaryBtnLive: {
    backgroundColor: COLORS.systemRed
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: COLORS.tertiarySystemBackground,
    height: 42,
    borderRadius: 12
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.label
  }
});
