import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import {
  generateMonthCalendar,
  isSameDay,
  formatTimeCompact,
  getSmartContestTitle
} from '../utils/timeUtils';

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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const days = generateMonthCalendar(year, month);
  const today = new Date();

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
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
              <Feather name="chevron-left" size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={handleNextMonth}
              activeOpacity={0.7}
            >
              <Feather name="chevron-right" size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.todayBtn} onPress={handleToday} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={12} color={COLORS.accentBlue} />
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

      {/* Calendar Matrix */}
      <View style={styles.matrix}>
        {days.map((dayItem, index) => {
          const isToday = isSameDay(dayItem.date, today);
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
                isToday && styles.dayCellToday,
                hasContests && styles.dayCellHasContests
              ]}
              onPress={() => {
                if (hasContests) {
                  onSelectDay({ date: dayItem.date, contests: dayContests });
                }
              }}
              activeOpacity={hasContests ? 0.7 : 1}
            >
              {/* Day Number */}
              <View style={[styles.dayNumberCircle, isToday && styles.todayCircle]}>
                <Text
                  style={[
                    styles.dayNumberText,
                    !dayItem.isCurrentMonth && styles.dayNumberMuted,
                    isToday && styles.todayNumberText
                  ]}
                >
                  {dayItem.dayNumber}
                </Text>
              </View>

              {/* Event indicators */}
              {hasContests && (
                <View style={styles.indicatorContainer}>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{dayContests.length}</Text>
                  </View>
                  <View style={styles.dotsRow}>
                    {dayContests.slice(0, 3).map((c, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.eventDot,
                          {
                            backgroundColor:
                              c.status === 'LIVE'
                                ? COLORS.accentRed
                                : c.platformColor || COLORS.accentBlue
                          }
                        ]}
                      />
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom Hint */}
      <View style={styles.hintBox}>
        <Ionicons name="information-circle-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.hintText}>
          Tap any highlighted day to view scheduled rounds and timers.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  monthGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  monthText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800'
  },
  yearText: {
    color: COLORS.accentBlue
  },
  navArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  arrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  todayBtnText: {
    color: COLORS.accentBlue,
    fontSize: 11,
    fontWeight: '700'
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 6
  },
  weekdayCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4
  },
  weekdayText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700'
  },
  matrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    backgroundColor: COLORS.bgCard,
    overflow: 'hidden'
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 58,
    padding: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dayCellMuted: {
    opacity: 0.25
  },
  dayCellToday: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: COLORS.accentBlue
  },
  dayCellHasContests: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)'
  },
  dayNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center'
  },
  todayCircle: {
    backgroundColor: COLORS.accentBlue
  },
  dayNumberText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700'
  },
  dayNumberMuted: {
    color: COLORS.textMuted
  },
  todayNumberText: {
    color: '#fff',
    fontWeight: '800'
  },
  indicatorContainer: {
    alignItems: 'center',
    gap: 2
  },
  countBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 4,
    borderRadius: 4
  },
  countBadgeText: {
    color: COLORS.accentBlue,
    fontSize: 9,
    fontWeight: '800'
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12
  },
  hintText: {
    color: COLORS.textMuted,
    fontSize: 11
  }
});

