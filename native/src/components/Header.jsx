import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { TIMEZONES } from '../utils/timeUtils';

export function Header({
  liveCount,
  timezone,
  onOpenTimezoneModal,
  onRefresh,
  isRefreshing,
  onOpenServerModal,
  isUsingFallback
}) {
  const currentTzObj = TIMEZONES.find((t) => t.id === timezone) || { label: 'Local' };

  return (
    <View style={styles.container}>
      {/* Brand row */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="radar" size={20} color="#3b82f6" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>CONTENDAR</Text>
              <View style={styles.radarDot} />
            </View>
            <Text style={styles.brandSubtitle}>CP CHRONO RADAR</Text>
          </View>
        </View>

        {/* Right side actions */}
        <View style={styles.actionsRow}>
          {/* Live badge if any */}
          {liveCount > 0 && (
            <View style={styles.liveBadge}>
              <View style={styles.livePulseDot} />
              <Text style={styles.liveText}>{liveCount} LIVE</Text>
            </View>
          )}

          {/* Timezone picker button */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenTimezoneModal}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={15} color={COLORS.accentBlue} />
            <Text style={styles.actionBtnText}>
              {currentTzObj.offset ? currentTzObj.label.split(' ')[0] : 'LOCAL'}
            </Text>
          </TouchableOpacity>

          {/* Server Config / Status */}
          <TouchableOpacity
            style={[styles.iconBtn, isUsingFallback && styles.iconBtnWarning]}
            onPress={onOpenServerModal}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={isUsingFallback ? 'server-network-off' : 'server-network'}
              size={18}
              color={isUsingFallback ? COLORS.accentAmber : COLORS.accentGreen}
            />
          </TouchableOpacity>

          {/* Manual Refresh */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onRefresh}
            disabled={isRefreshing}
            activeOpacity={0.7}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color={COLORS.accentBlue} />
            ) : (
              <Ionicons name="refresh" size={18} color={COLORS.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    backgroundColor: COLORS.bgPrimary
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 1.2
  },
  radarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentBlue
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1
  },
  actionsRow: {
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
    paddingVertical: 4,
    borderRadius: 12
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentRed
  },
  liveText: {
    color: COLORS.accentRed,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8
  },
  actionBtnText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700'
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBtnWarning: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)'
  }
});

