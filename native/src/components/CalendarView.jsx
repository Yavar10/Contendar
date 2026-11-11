import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants/theme';
import {
  generateMonthCalendar,
  isSameDay,
  formatTimeOnly,
  formatDuration
} from '../utils/timeUtils';
import { openContestArena } from '../utils/calendarSync';
import { PlatformIcon } from './PlatformIcons';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarView({
  contests,
  timezone,
  onSelectContest,
  onSelectDay
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const days = generateMonthCalendar(year, month);
  const today = new Date();

  // Contests on the currently selected date
  const selectedDayContests = contests.filter((c) =>
    isSameDay(c.startTimeMs, selectedDate)
  );

  const formattedSelectedDate = selectedDate
    ? new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }).format(selectedDate).toUpperCase()
    : '';

  return (
    <View style={styles.container}>
      {/* Apple Calendar Month Navigation Bar */}
      <View style={styles.header}>
        <View style={styles.monthGroup}>
          <Text style={styles.monthText}>
            {MONTH_NAMES[month]} <Text style={styles.yearText}>{year}</Text>
          </Text>

          <View style={styles.navArrows}>
            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={handlePrevMonth}
              activeOpacity={0.6}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-back" size={18} color={COLORS.systemBlue} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={handleNextMonth}
              activeOpacity={0.6}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-forward" size={18} color={COLORS.systemBlue} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.todayBtn} onPress={handleToday} activeOpacity={0.6}>
          <Text style={styles.todayBtnText}>Today</Text>
        </TouchableOpacity>
      </View>

      {/* Weekday Row */}
      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((day, i) => (
          <View key={i} style={styles.weekdayCol}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Borderless Apple Calendar Matrix */}
      <View style={styles.matrix}>
        {days.map((dayItem, index) => {
          const isToday = isSameDay(dayItem.date, today);
          const isSelected = isSameDay(dayItem.date, selectedDate);
          const dayContests = contests.filter((c) =>
            isSameDay(c.startTimeMs, dayItem.date)
          );
          const hasContests = dayContests.length > 0;

          return (
            <TouchableOpacity
              key={index}
              style={styles.dayCell}
              onPress={() => {
                setSelectedDate(dayItem.date);
                if (hasContests && onSelectDay) {
                  onSelectDay({ date: dayItem.date, contests: dayContests });
                }
              }}
              activeOpacity={0.6}
            >
              {/* Day Number Circle */}
              <View
                style={[
                  styles.dayNumberCircle,
                  isToday && styles.todayCircle,
                  isSelected && !isToday && styles.selectedCircle
                ]}
              >
                <Text
                  style={[
                    styles.dayNumberText,
                    !dayItem.isCurrentMonth && styles.dayNumberMuted,
                    isToday && styles.todayNumberText,
                    isSelected && !isToday && styles.selectedNumberText
                  ]}
                >
                  {dayItem.dayNumber}
                </Text>
              </View>

              {/* Event Platform Dots */}
              <View style={styles.dotsRow}>
                {hasContests ? (
                  dayContests.slice(0, 3).map((c, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.eventDot,
                        {
                          backgroundColor:
                            c.status === 'LIVE'
                              ? COLORS.systemRed
                              : c.platformColor || COLORS.systemBlue
                        }
                      ]}
                    />
                  ))
                ) : (
                  <View style={styles.emptyDotPlaceholder} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Apple Inset Grouped Day Inspector */}
      <View style={styles.dayInspector}>
        <View style={styles.dayInspectorHeader}>
          <Text style={styles.inspectorDateText}>{formattedSelectedDate}</Text>
          <Text style={styles.inspectorCountText}>
            {selectedDayContests.length} {selectedDayContests.length === 1 ? 'Round' : 'Rounds'}
          </Text>
        </View>

        {selectedDayContests.length > 0 ? (
          <View style={styles.dayContestsGroup}>
            {selectedDayContests.map((c, i) => {
              const isLive = c.status === 'LIVE';
              const isLast = i === selectedDayContests.length - 1;
              const brandColor = c.platformColor || COLORS.systemBlue;

              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.dayContestRow, !isLast && styles.rowSeparator]}
                  onPress={() => onSelectContest(c)}
                  activeOpacity={0.6}
                >
                  <View style={styles.platformIconTile}>
                    <PlatformIcon platform={c.platform} size={16} />
                  </View>

                  <View style={styles.contestMain}>
                    <View style={styles.contestMetaTop}>
                      <Text style={[styles.platformNameText, { color: brandColor }]}>
                        {c.platformName}
                      </Text>
                      {Boolean(c.divisions?.[0]) && (
                        <View style={styles.divPill}>
                          <Text style={styles.divPillText}>{c.divisions[0]}</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.contestTitleText} numberOfLines={1}>
                      {c.title}
                    </Text>

                    <Text style={styles.contestScheduleText}>
                      {formatTimeOnly(c.startTimeMs, timezone)} · {formatDuration(c.durationSeconds)}
                    </Text>
                  </View>

                  <View style={styles.rightAction}>
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
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyDayBox}>
            <Text style={styles.emptyDayText}>No rounds scheduled for this day</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  monthGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.35,
    color: COLORS.label
  },
  yearText: {
    color: COLORS.secondaryLabel,
    fontWeight: '400'
  },
  navArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(118, 118, 128, 0.18)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  todayBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  todayBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.systemBlue
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 6
  },
  weekdayCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.tertiaryLabel
  },
  matrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  todayCircle: {
    backgroundColor: COLORS.systemBlue
  },
  selectedCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)'
  },
  dayNumberText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.label
  },
  dayNumberMuted: {
    color: COLORS.tertiaryLabel
  },
  todayNumberText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  selectedNumberText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 6,
    marginTop: 2,
    gap: 3
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2
  },
  emptyDotPlaceholder: {
    height: 4
  },
  dayInspector: {
    marginTop: 6
  },
  dayInspectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 8
  },
  inspectorDateText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: COLORS.secondaryLabel
  },
  inspectorCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.tertiaryLabel
  },
  dayContestsGroup: {
    backgroundColor: COLORS.secondarySystemBackground,
    borderRadius: 14,
    overflow: 'hidden'
  },
  dayContestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  rowSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(84, 84, 88, 0.36)'
  },
  platformIconTile: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  contestMain: {
    flex: 1,
    marginRight: 8
  },
  contestMetaTop: {
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
  contestTitleText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.24,
    color: COLORS.label,
    marginBottom: 2
  },
  contestScheduleText: {
    fontSize: 13,
    color: COLORS.secondaryLabel
  },
  rightAction: {
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
  },
  emptyDayBox: {
    backgroundColor: COLORS.secondarySystemBackground,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyDayText: {
    fontSize: 14,
    color: COLORS.secondaryLabel
  }
});
