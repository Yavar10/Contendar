import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export function ViewSwitcher({ viewMode, onViewModeChange }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, viewMode === 'list' && styles.tabActive]}
        onPress={() => onViewModeChange('list')}
        activeOpacity={0.7}
      >
        <Feather
          name="list"
          size={14}
          color={viewMode === 'list' ? COLORS.accentBlue : COLORS.textMuted}
        />
        <Text style={[styles.tabText, viewMode === 'list' && styles.tabTextActive]}>
          Timeline
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, viewMode === 'calendar' && styles.tabActive]}
        onPress={() => onViewModeChange('calendar')}
        activeOpacity={0.7}
      >
        <Feather
          name="calendar"
          size={14}
          color={viewMode === 'calendar' ? COLORS.accentBlue : COLORS.textMuted}
        />
        <Text style={[styles.tabText, viewMode === 'calendar' && styles.tabTextActive]}>
          Calendar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    padding: 3
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 9
  },
  tabActive: {
    backgroundColor: COLORS.bgCardHover,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)'
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600'
  },
  tabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '700'
  }
});

