import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

export function ViewSwitcher({ viewMode, onViewModeChange }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.segment, viewMode === 'calendar' && styles.segmentActive]}
        onPress={() => onViewModeChange('calendar')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="calendar"
          size={14}
          color={viewMode === 'calendar' ? COLORS.label : COLORS.secondaryLabel}
        />
        <Text style={[styles.segmentText, viewMode === 'calendar' && styles.segmentTextActive]}>
          Calendar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.segment, viewMode === 'list' && styles.segmentActive]}
        onPress={() => onViewModeChange('list')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="list"
          size={14}
          color={viewMode === 'list' ? COLORS.label : COLORS.secondaryLabel}
        />
        <Text style={[styles.segmentText, viewMode === 'list' && styles.segmentTextActive]}>
          Timeline
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 34,
    backgroundColor: 'rgba(118, 118, 128, 0.24)',
    borderRadius: 9,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 2
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 7
  },
  segmentActive: {
    backgroundColor: '#3A3A3C',
    ...SHADOWS.subtle
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.secondaryLabel
  },
  segmentTextActive: {
    color: COLORS.label,
    fontWeight: '600'
  }
});
