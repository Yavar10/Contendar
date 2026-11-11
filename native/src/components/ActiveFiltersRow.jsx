import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export function ActiveFiltersRow({
  statusFilter,
  onResetStatus,
  selectedDivisions,
  onRemoveDivision,
  searchQuery,
  onClearSearch,
  onResetAll
}) {
  const hasStatusFilter = statusFilter !== 'all';
  const hasDivisionFilter =
    selectedDivisions.length > 0 && !selectedDivisions.includes('All');
  const hasSearch = searchQuery.trim().length > 0;

  if (!hasStatusFilter && !hasDivisionFilter && !hasSearch) {
    return null;
  }

  const getStatusLabel = (status) => {
    if (status === 'live') return '🔴 Live Only';
    if (status === 'upcoming') return '⏳ Upcoming Only';
    return status;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status chip */}
        {hasStatusFilter && (
          <TouchableOpacity
            style={styles.activeChip}
            onPress={onResetStatus}
            activeOpacity={0.7}
          >
            <Text style={styles.activeChipText}>{getStatusLabel(statusFilter)}</Text>
            <Ionicons name="close" size={12} color={COLORS.accentBlue} />
          </TouchableOpacity>
        )}

        {/* Division chips */}
        {hasDivisionFilter &&
          selectedDivisions.map((div) => (
            <TouchableOpacity
              key={div}
              style={styles.activeChip}
              onPress={() => onRemoveDivision(div)}
              activeOpacity={0.7}
            >
              <Text style={styles.activeChipText}>{div}</Text>
              <Ionicons name="close" size={12} color={COLORS.accentBlue} />
            </TouchableOpacity>
          ))}

        {/* Search chip */}
        {hasSearch && (
          <TouchableOpacity
            style={styles.activeChip}
            onPress={onClearSearch}
            activeOpacity={0.7}
          >
            <Text style={styles.activeChipText}>"{searchQuery}"</Text>
            <Ionicons name="close" size={12} color={COLORS.accentBlue} />
          </TouchableOpacity>
        )}

        {/* Reset All text button */}
        <TouchableOpacity style={styles.resetBtn} onPress={onResetAll} activeOpacity={0.7}>
          <Text style={styles.resetText}>Reset All</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 6,
    alignItems: 'center'
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12
  },
  activeChipText: {
    color: COLORS.accentBlue,
    fontSize: 11,
    fontWeight: '700'
  },
  resetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  resetText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline'
  }
});

