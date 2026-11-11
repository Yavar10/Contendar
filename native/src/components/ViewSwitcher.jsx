import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export function ViewSwitcher({ viewMode, onViewModeChange }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, viewMode === 'calendar' && styles.tabActive]}
        onPress={() => onViewModeChange('calendar')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="calendar"
          size={13}
          color={viewMode === 'calendar' ? COLORS.appleBlue : COLORS.textMuted}
        />
        <Text style={[styles.tabText, viewMode === 'calendar' && styles.tabTextActive]}>
          Calendar View
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, viewMode === 'list' && styles.tabActive]}
        onPress={() => onViewModeChange('list')}
        activeOpacity={0.7}
      >
        <Feather
          name="list"
          size={13}
          color={viewMode === 'list' ? COLORS.appleBlue : COLORS.textMuted}
        />
        <Text style={[styles.tabText, viewMode === 'list' && styles.tabTextActive]}>
          Timeline
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 3
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 11
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(10, 132, 255, 0.4)'
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600'
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700'
  }
});
