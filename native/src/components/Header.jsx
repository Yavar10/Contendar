import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export function Header({
  liveCount,
  isSearchVisible,
  onToggleSearch,
  onOpenFilterModal,
  activeFilterCount,
  onOpenSettingsModal,
  hasApiError
}) {
  return (
    <View style={styles.header}>
      {/* Brand & Live Indicator */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="radar" size={18} color={COLORS.accentBlue} />
        </View>
        <Text style={styles.brandTitle}>CONTENDAR</Text>

        {liveCount > 0 && (
          <View style={styles.liveBadge}>
            <View style={styles.livePulseDot} />
            <Text style={styles.liveText}>{liveCount} LIVE</Text>
          </View>
        )}
      </View>

      {/* Right Actions */}
      <View style={styles.actionsRow}>
        {/* Search Toggle */}
        <TouchableOpacity
          style={[styles.iconBtn, isSearchVisible && styles.iconBtnActive]}
          onPress={onToggleSearch}
          activeOpacity={0.7}
        >
          <Feather
            name={isSearchVisible ? 'x' : 'search'}
            size={17}
            color={isSearchVisible ? COLORS.accentBlue : COLORS.textSecondary}
          />
        </TouchableOpacity>

        {/* Filter Modal Trigger */}
        <TouchableOpacity
          style={[styles.iconBtn, activeFilterCount > 0 && styles.iconBtnFilterActive]}
          onPress={onOpenFilterModal}
          activeOpacity={0.7}
        >
          <Feather
            name="sliders"
            size={16}
            color={activeFilterCount > 0 ? COLORS.accentBlue : COLORS.textSecondary}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Settings & Timezone Trigger */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onOpenSettingsModal}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-sharp" size={16} color={COLORS.textSecondary} />
          {hasApiError && <View style={styles.errorDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 1.1
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
    borderRadius: 10,
    marginLeft: 4
  },
  livePulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.accentRed
  },
  liveText: {
    color: COLORS.accentRed,
    fontSize: 10,
    fontWeight: '800'
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  iconBtnActive: {
    borderColor: COLORS.accentBlue,
    backgroundColor: 'rgba(59, 130, 246, 0.15)'
  },
  iconBtnFilterActive: {
    borderColor: COLORS.accentBlue,
    backgroundColor: 'rgba(59, 130, 246, 0.1)'
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.accentBlue,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800'
  },
  errorDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.accentRed
  }
});
