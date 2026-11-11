import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { formatTimeOnly, formatDuration } from '../utils/timeUtils';
import { PlatformIcon } from './PlatformIcons';

export function DayDetailModal({
  dayData,
  timezone,
  onClose,
  onSelectContest
}) {
  if (!dayData) return null;

  const { date, contests } = dayData;
  const formattedDate = date ? new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date) : '';

  return (
    <Modal
      visible={Boolean(dayData)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.dismissOverlay} onPress={onClose} activeOpacity={1} />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="calendar" size={18} color={COLORS.accentBlue} />
              <View>
                <Text style={styles.dateTitle}>{formattedDate}</Text>
                <Text style={styles.subtitle}>
                  {contests.length} {contests.length === 1 ? 'round' : 'rounds'} scheduled
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* List of contests */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {contests.map((c) => {
              const isLive = c.status === 'LIVE';

              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.itemCard, isLive && styles.itemCardLive]}
                  onPress={() => onSelectContest(c)}
                  activeOpacity={0.75}
                >
                  <View style={styles.itemHeader}>
                    <View style={styles.itemPlatform}>
                      <PlatformIcon platform={c.platform} size={14} />
                      <Text style={styles.itemPlatformName}>{c.platformName}</Text>
                    </View>

                    {isLive ? (
                      <View style={styles.liveBadge}>
                        <View style={styles.livePulseDot} />
                        <Text style={styles.liveBadgeText}>LIVE</Text>
                      </View>
                    ) : (
                      <View style={styles.upcomingBadge}>
                        <Text style={styles.upcomingBadgeText}>UPCOMING</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.itemTitle}>{c.title}</Text>

                  <View style={styles.divisionsRow}>
                    {c.divisions?.map((div, i) => (
                      <View key={i} style={styles.divChip}>
                        <Text style={styles.divChipText}>{div}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.itemFooter}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
                      <Text style={styles.metaText}>{formatTimeOnly(c.startTimeMs, timezone)}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Feather name="clock" size={11} color={COLORS.textMuted} />
                      <Text style={styles.metaText}>{formatDuration(c.durationSeconds)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
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
    maxHeight: '75%',
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  dateTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800'
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2
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
  itemCard: {
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10
  },
  itemCardLive: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)'
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  itemPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  itemPlatformName: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700'
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.badgeLiveBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  livePulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.accentRed
  },
  liveBadgeText: {
    color: COLORS.accentRed,
    fontSize: 9,
    fontWeight: '800'
  },
  upcomingBadge: {
    backgroundColor: COLORS.badgeUpcomingBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  upcomingBadgeText: {
    color: COLORS.accentBlue,
    fontSize: 9,
    fontWeight: '700'
  },
  itemTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8
  },
  divisionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8
  },
  divChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  divChipText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600'
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 11
  }
});

