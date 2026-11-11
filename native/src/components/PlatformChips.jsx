import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';
import { PlatformIcon } from './PlatformIcons';

export function PlatformChips({
  platforms,
  selectedPlatforms,
  onTogglePlatform,
  onSelectAllPlatforms,
  contestCountsByPlatform
}) {
  const isAllSelected = selectedPlatforms.length === platforms.length;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All Platforms pill */}
        <TouchableOpacity
          style={[styles.chip, isAllSelected && styles.chipAllActive]}
          onPress={onSelectAllPlatforms}
          activeOpacity={0.6}
        >
          <Text style={[styles.chipText, isAllSelected && styles.chipTextAllActive]}>
            All
          </Text>
        </TouchableOpacity>

        {/* Individual platform chips */}
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const count = contestCountsByPlatform[platform.id] || 0;
          const brandColor = platform.color || COLORS.systemBlue;

          return (
            <TouchableOpacity
              key={platform.id}
              style={[
                styles.chip,
                isSelected && styles.chipSelected
              ]}
              onPress={() => onTogglePlatform(platform.id)}
              activeOpacity={0.6}
            >
              <PlatformIcon platform={platform.id} size={14} />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {platform.name}
              </Text>
              <View style={[styles.countBadge, isSelected && styles.countBadgeSelected]}>
                <Text style={[styles.countText, isSelected && styles.countTextSelected]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
    gap: 8,
    alignItems: 'center'
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(118, 118, 128, 0.18)',
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17
  },
  chipAllActive: {
    backgroundColor: '#FFFFFF'
  },
  chipSelected: {
    backgroundColor: '#FFFFFF'
  },
  chipText: {
    color: COLORS.secondaryLabel,
    fontSize: 13,
    fontWeight: '500'
  },
  chipTextAllActive: {
    color: '#000000',
    fontWeight: '600'
  },
  chipTextSelected: {
    color: '#000000',
    fontWeight: '600'
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 9
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)'
  },
  countText: {
    color: COLORS.secondaryLabel,
    fontSize: 11,
    fontWeight: '600'
  },
  countTextSelected: {
    color: '#000000'
  }
});
