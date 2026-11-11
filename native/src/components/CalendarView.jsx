import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
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
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(selectedDate)
    : '';

  return (
    <View style={styles.container}>
      {/* Apple-style Calendar Header */}
      <View style={styles.header}>
        <View style={styles.monthGroup}>
          <Text style={styles.monthText}>
            {MONTH_NAMES[month]} <Text style={styles.yearText}>{year}</Text>
          </Text>

          <View style={styles.navArrows}>
            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={handlePrevMonth}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={handleNextMonth}
              activeOpacity={0.7}
            >
              <Feather name="chevron-right" size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.todayBtn} onPress={handleToday} activeOpacity={0.7}>
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

      {/* Calendar Matrix Card */}
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
              style={[
                styles.dayCell,
                !dayItem.isCurrentMonth && styles.dayCellMuted,
                isSelected && styles.dayCellSelected
              ]}
              onPress={() => {
                setSelectedDate(dayItem.date);
                if (hasContests && onSelectDay) {
                  onSelectDay({ date: dayItem.date, contests: dayContests });
                }
              }}
              activeOpacity={0.7}
            >
              {/* Day Number Bubble */}
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
                              ? COLORS.appleRed
                              : c.platformColor || COLORS.appleBlue
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

      {/* Apple-style Inline Day Inspector Panel */}
      <View style={styles.dayInspector}>
        <View style={styles.dayInspectorHeader}>
          <View style={styles.inspectorTitleRow}>
            <Ionicons name="calendar-sharp" size={14} color={COLORS.appleBlue} />
            <Text style={styles.inspectorDateText}>{formattedSelectedDate}</Text>
          </View>
          <Text style={styles.inspectorCountText}>
            {selectedDayContests.length} {selectedDayContests.length === 1 ? 'Round' : 'Rounds'}
          </Text>
        </View>

        {selectedDayContests.length > 0 ? (
          <View style={styles.dayContestsList}>
            {selectedDayContests.map((c) => {
              const isLive = c.status === 'LIVE';
              const brandColor = c.platformColor || COLORS.appleBlue;

              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.dayContestCard, isLive && styles.dayContestLive]}
                  onPress={() => onSelectContest(c)}
                  activeOpacity={0.8}
                >
                  <View style={styles.dayContestTop}>
                    <View style={styles.dayContestPlatform}>
                      <PlatformIcon platform={c.platform} size={12} />
                      <Text style={[styles.dayContestPlatformName, { color: brandColor }]}>
                        {c.platformName}
                      </Text>
                      {c.divisions?.[0] && (
                        <View style={styles.divBadge}>
                          <Text style={styles.divBadgeText}>{c.divisions[0]}</Text>
                        </View>
                      )}
                    </View>

                    {isLive ? (
                      <View style={styles.liveChip}>
                        <View style={styles.liveDotSm} />
                        <Text style={styles.liveChipText}>LIVE</Text>
                      </View>
                    ) : (
                      <Text style={styles.dayContestTime}>
                        {formatTimeOnly(c.startTimeMs, timezone)}
                      </Text>
                    )}
                  </View>

                  <Text style={styles.dayContestTitle} numberOfLines={1}>
                    {c.title}
                  </Text>

                  <View style={styles.dayContestFooter}>
                    <Text style={styles.durationText}>
                      Duration: {formatDuration(c.durationSeconds)}
                    </Text>

                    <TouchableOpacity
                      style={[styles.arenaBtnSm, { backgroundColor: brandColor }]}
                      onPress={() => openContestArena(c.url)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.arenaBtnSmText}>Arena</Text>
                      <Feather name="arrow-up-right" size={11} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.noContestsBox}>
            <Text style={styles.noContestsText}>
              No competitive rounds scheduled for {formattedSelectedDate}.
            </Text>
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
    marginBottom: 8
  },
  monthGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  monthText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3
  },
  yearText: {
    color: COLORS.appleBlue
  },
  navArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  todayBtn: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(10, 132, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  todayBtnText: {
    color: COLORS.appleBlue,
    fontSize: 11,
    fontWeight: '700'
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  weekdayCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2
  },
  weekdayText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700'
  },
  matrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 16,
    backgroundColor: COLORS.bgCard,
    overflow: 'hidden',
    padding: 2
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 48,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  dayCellMuted: {
    opacity: 0.25
  },
  dayCellSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  dayNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  todayCircle: {
    backgroundColor: COLORS.appleBlue
  },
  selectedCircle: {
    borderWidth: 1.5,
    borderColor: COLORS.appleBlue
  },
  dayNumberText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700'
  },
  dayNumberMuted: {
    color: COLORS.textMuted
  },
  todayNumberText: {
    color: '#fff',
    fontWeight: '800'
  },
  selectedNumberText: {
    color: COLORS.appleBlue,
    fontWeight: '800'
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2.5,
    height: 5,
    alignItems: 'center',
    marginTop: 2
  },
  eventDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75
  },
  emptyDotPlaceholder: {
    width: 3.5,
    height: 3.5
  },
  dayInspector: {
    marginTop: 12,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 16,
    padding: 12
  },
  dayInspectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  inspectorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  inspectorDateText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700'
  },
  inspectorCountText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600'
  },
  dayContestsList: {
    gap: 8,
    marginTop: 8
  },
  dayContestCard: {
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    padding: 10
  },
  dayContestLive: {
    borderColor: 'rgba(255, 69, 58, 0.4)',
    backgroundColor: 'rgba(255, 69, 58, 0.05)'
  },
  dayContestTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  dayContestPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  dayContestPlatformName: {
    fontSize: 11,
    fontWeight: '700'
  },
  divBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  divBadgeText: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600'
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.badgeLiveBg,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6
  },
  liveDotSm: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.appleRed
  },
  liveChipText: {
    color: COLORS.appleRed,
    fontSize: 9,
    fontWeight: '800'
  },
  dayContestTime: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600'
  },
  dayContestTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6
  },
  dayContestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  durationText: {
    color: COLORS.textMuted,
    fontSize: 10
  },
  arenaBtnSm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6
  },
  arenaBtnSmText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800'
  },
  noContestsBox: {
    paddingVertical: 12,
    alignItems: 'center'
  },
  noContestsText: {
    color: COLORS.textMuted,
    fontSize: 12
  }
});
