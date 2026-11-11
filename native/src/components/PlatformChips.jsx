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
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, isAllSelected && styles.chipTextAllActive]}>
            All
          </Text>
        </TouchableOpacity>

        {/* Individual platform chips */}
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const count = contestCountsByPlatform[platform.id] || 0;
          const brandColor = platform.color || COLORS.appleBlue;

          return (
            <TouchableOpacity
              key={platform.id}
              style={[
                styles.chip,
                isSelected && {
                  borderColor: brandColor,
                  backgroundColor: platform.badgeBg || 'rgba(10, 132, 255, 0.15)'
                }
              ]}
              onPress={() => onTogglePlatform(platform.id)}
              activeOpacity={0.7}
            >
              <PlatformIcon platform={platform.id} size={13} />
              <Text
                style={[
                  styles.chipText,
                  isSelected && { color: brandColor, fontWeight: '700' }
                ]}
              >
                {platform.name}
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{count}</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16
  },
  chipAllActive: {
    borderColor: COLORS.appleBlue,
    backgroundColor: 'rgba(10, 132, 255, 0.18)'
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600'
  },
  chipTextAllActive: {
    color: '#fff',
    fontWeight: '700'
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1
  },
  countText: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700'
  }
});
