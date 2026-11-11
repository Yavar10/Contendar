import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    weekday: 'long',
    month: 'short',
    day: 'numeric'
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
          <View style={styles.grabHandle} />

          {/* Navigation Bar */}
          <View style={styles.header}>
            <View>
              <Text style={styles.dateTitle}>{formattedDate}</Text>
              <Text style={styles.subtitle}>
                {contests.length} {contests.length === 1 ? 'Round Scheduled' : 'Rounds Scheduled'}
              </Text>
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.6}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Inset Grouped List of contests */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.groupedTable}>
              {contests.map((c, idx) => {
                const isLive = c.status === 'LIVE';
                const isLast = idx === contests.length - 1;
                const brandColor = c.platformColor || COLORS.systemBlue;

                return (
                  <React.Fragment key={c.id}>
                    <TouchableOpacity
                      style={styles.itemRow}
                      onPress={() => onSelectContest(c)}
                      activeOpacity={0.6}
                    >
                      <View style={styles.itemIconTile}>
                        <PlatformIcon platform={c.platform} size={16} />
                      </View>

                      <View style={styles.itemMain}>
                        <View style={styles.itemMetaTop}>
                          <Text style={[styles.platformNameText, { color: brandColor }]}>
                            {c.platformName}
                          </Text>
                          {Boolean(c.divisions?.[0]) && (
                            <View style={styles.divPill}>
                              <Text style={styles.divPillText}>{c.divisions[0]}</Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.itemTitle} numberOfLines={2}>
                          {c.title}
                        </Text>

                        <Text style={styles.itemScheduleText}>
                          {formatTimeOnly(c.startTimeMs, timezone)} · {formatDuration(c.durationSeconds)}
                        </Text>
                      </View>

                      <View style={styles.itemAction}>
                        {isLive ? (
                          <View style={styles.liveChip}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveChipText}>LIVE</Text>
                          </View>
                        ) : (
                          <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryLabel} />
                        )}
                      </View>
                    </TouchableOpacity>
                    {!isLast && <View style={styles.separator} />}
                  </React.Fragment>
                );
              })}
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end'
  },
  dismissOverlay: {
    flex: 1
  },
  sheetContainer: {
    backgroundColor: COLORS.secondarySystemBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '78%',
    paddingBottom: 28
  },
  grabHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.label
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.secondaryLabel,
    marginTop: 2
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
    paddingHorizontal: 20,
    paddingTop: 8
  },
  groupedTable: {
    backgroundColor: COLORS.tertiarySystemBackground,
    borderRadius: 14,
    overflow: 'hidden'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(84, 84, 88, 0.36)'
  },
  itemIconTile: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  itemMain: {
    flex: 1,
    marginRight: 8
  },
  itemMetaTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2
  },
  platformNameText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  divPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  divPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.secondaryLabel
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.24,
    color: COLORS.label,
    marginBottom: 2
  },
  itemScheduleText: {
    fontSize: 13,
    color: COLORS.secondaryLabel
  },
  itemAction: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  liveChip: {
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
  liveChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.systemRed
  }
});
