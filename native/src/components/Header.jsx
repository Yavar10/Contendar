import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

export function Header({
  liveCount,
  isSearchVisible,
  onToggleSearch,
  onOpenFilterModal,
  activeFilterCount,
  onOpenSettingsModal,
  hasApiError
}) {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date()).toUpperCase();

  return (
    <View style={styles.header}>
      {/* Top date caption in Apple HIG style */}
      <View style={styles.topCaptionRow}>
        <Text style={styles.dateCaption}>{todayFormatted}</Text>
        {liveCount > 0 && (
          <View style={styles.liveIndicatorPill}>
            <View style={styles.livePulseDot} />
            <Text style={styles.liveIndicatorText}>{liveCount} LIVE NOW</Text>
          </View>
        )}
      </View>

      {/* Large Title Navigation Bar */}
      <View style={styles.mainRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.largeTitle}>Contests</Text>
        </View>

        {/* Right SF Action Buttons */}
        <View style={styles.actionsRow}>
          {/* Search Action */}
          <TouchableOpacity
            style={[styles.actionBtn, isSearchVisible && styles.actionBtnActive]}
            onPress={onToggleSearch}
            activeOpacity={0.6}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons
              name={isSearchVisible ? 'close' : 'search'}
              size={18}
              color={isSearchVisible ? COLORS.systemBlue : COLORS.label}
            />
          </TouchableOpacity>

          {/* Filter Action */}
          <TouchableOpacity
            style={[styles.actionBtn, activeFilterCount > 0 && styles.actionBtnFilterActive]}
            onPress={onOpenFilterModal}
            activeOpacity={0.6}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons
              name="slider-horizontal"
              size={18}
              color={activeFilterCount > 0 ? COLORS.systemBlue : COLORS.label}
            />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Settings Action */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenSettingsModal}
            activeOpacity={0.6}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="settings-outline" size={19} color={COLORS.label} />
            {hasApiError && <View style={styles.errorDot} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: COLORS.systemBackground
  },
  topCaptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  dateCaption: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: COLORS.secondaryLabel
  },
  liveIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 69, 58, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.systemRed
  },
  liveIndicatorText: {
    color: COLORS.systemRed,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8
  },
  largeTitle: {
    ...TYPOGRAPHY.largeTitle,
    color: COLORS.label
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(118, 118, 128, 0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  actionBtnActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)'
  },
  actionBtnFilterActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.18)'
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.systemBlue,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  errorDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.systemRed
  }
});
