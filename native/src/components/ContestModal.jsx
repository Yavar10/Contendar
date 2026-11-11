import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { formatDateTime, formatDuration, getCountdown } from '../utils/timeUtils';
import {
  openContestArena,
  openGoogleCalendar,
  shareContest,
  copyContestLink
} from '../utils/calendarSync';
import { PlatformIcon } from './PlatformIcons';

export function ContestModal({ contest, timezone, onClose }) {
  if (!contest) return null;

  const [nowMs, setNowMs] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
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

  const handleCopy = async () => {
    const ok = await copyContestLink(contest);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      visible={Boolean(contest)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.dismissOverlay} onPress={onClose} activeOpacity={1} />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.platformRow}>
              <PlatformIcon platform={contest.platform} size={20} />
              <View>
                <Text style={styles.platformName}>{contest.platformName}</Text>
                <Text style={styles.contestId}>#{contest.id}</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              {isLive ? (
                <View style={styles.liveBadge}>
                  <View style={styles.livePulseDot} />
                  <Text style={styles.liveBadgeText}>LIVE NOW</Text>
                </View>
              ) : (
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingBadgeText}>UPCOMING</Text>
                </View>
              )}

              <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.title}>{contest.title}</Text>

            {/* Countdown Banner */}
            <View style={[styles.timerBanner, isLive && styles.timerBannerLive]}>
              <Feather
                name="clock"
                size={16}
                color={isLive ? COLORS.accentRed : COLORS.accentBlue}
              />
              <View style={styles.timerContent}>
                <Text style={[styles.timerLabel, isLive && styles.timerLabelLive]}>
                  {isLive ? 'ENDS IN' : 'STARTS IN'}
                </Text>
                <Text style={[styles.timerValue, isLive && styles.timerValueLive]}>
                  {countdown.label.replace(/^(Starts in |Ends in )/i, '')}
                </Text>
              </View>
            </View>

            {/* Live Progress Bar */}
            {isLive && (
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

            {/* Division Badges */}
            <View style={styles.metaSection}>
              <Text style={styles.sectionHeader}>ELIGIBLE DIVISIONS</Text>
              <View style={styles.divisionsRow}>
                {contest.divisions?.map((div, i) => (
                  <View key={i} style={styles.divisionPill}>
                    <Text style={styles.divisionPillText}>{div}</Text>
                  </View>
                ))}
                {contest.type && (
                  <View style={[styles.divisionPill, styles.typePill]}>
                    <Text style={[styles.divisionPillText, styles.typePillText]}>
                      {contest.type}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Schedule Info Card */}
            <View style={styles.metaSection}>
              <Text style={styles.sectionHeader}>SCHEDULE DETAILS</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Starts</Text>
                  <Text style={styles.infoValue}>
                    {formatDateTime(contest.startTimeMs, timezone)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ends</Text>
                  <Text style={styles.infoValue}>
                    {formatDateTime(contest.endTimeMs, timezone)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>
                    {formatDuration(contest.durationSeconds)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            {contest.description && (
              <View style={styles.metaSection}>
                <Text style={styles.sectionHeader}>ROUND OVERVIEW</Text>
                <Text style={styles.descriptionText}>{contest.description}</Text>
              </View>
            )}

            {/* Primary Action: Open Arena */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => openContestArena(contest.url)}
              activeOpacity={0.7}
            >
              <Feather name="external-link" size={16} color="#fff" />
              <Text style={styles.primaryBtnText}>Open Contest Arena</Text>
            </TouchableOpacity>

            {/* Action Row */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => openGoogleCalendar(contest)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-sharp" size={16} color={COLORS.accentBlue} />
                <Text style={styles.actionBtnText}>Add to GCal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleCopy}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={16}
                  color={copied ? COLORS.accentGreen : COLORS.textPrimary}
                />
                <Text style={styles.actionBtnText}>{copied ? 'Copied!' : 'Copy Link'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => shareContest(contest)}
                activeOpacity={0.7}
              >
                <Feather name="share-2" size={16} color={COLORS.textPrimary} />
                <Text style={styles.actionBtnText}>Share</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  dismissOverlay: {
    flex: 1
  },
  sheetContainer: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    maxHeight: '85%',
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  platformName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700'
  },
  contestId: {
    color: COLORS.textMuted,
    fontSize: 10
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
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
  upcomingBadge: {
    backgroundColor: COLORS.badgeUpcomingBg,
    borderColor: COLORS.badgeUpcomingBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  upcomingBadgeText: {
    color: COLORS.accentBlue,
    fontSize: 10,
    fontWeight: '700'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    padding: 16
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 14
  },
  timerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  timerBannerLive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  timerContent: {
    flex: 1
  },
  timerLabel: {
    color: COLORS.accentBlue,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1
  },
  timerLabelLive: {
    color: COLORS.accentRed
  },
  timerValue: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2
  },
  timerValueLive: {
    color: COLORS.accentRed
  },
  progressWrap: {
    marginBottom: 14
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  progressSubText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600'
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accentRed,
    borderRadius: 3
  },
  metaSection: {
    marginBottom: 14
  },
  sectionHeader: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6
  },
  divisionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  divisionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  divisionPillText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '600'
  },
  typePill: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)'
  },
  typePillText: {
    color: '#a5b4fc'
  },
  infoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: 12
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600'
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
    marginVertical: 8
  },
  descriptionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accentBlue,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 10
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    paddingVertical: 10
  },
  actionBtnText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700'
  }
});

