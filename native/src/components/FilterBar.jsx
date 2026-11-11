import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { PlatformIcon } from './PlatformIcons';

const COMMON_DIVISIONS = [
  'All',
  'Div. 1',
  'Div. 2',
  'Div. 3',
  'Div. 4',
  'Educational',
  'Global',
  'Weekly',
  'Biweekly',
  'Starters'
];

export function FilterBar({
  platforms,
  selectedPlatforms,
  onTogglePlatform,
  onSelectAllPlatforms,
  selectedDivisions,
  onToggleDivision,
  onSelectAllDivisions,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
  contestCountsByPlatform
}) {
  const isAllPlatformsSelected = selectedPlatforms.length === platforms.length;
  const isAllDivisionsSelected = selectedDivisions.includes('All') || selectedDivisions.length === 0;

  return (
    <View style={styles.container}>
      {/* Search & View Mode Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rounds, platforms, div..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={onSearchChange}
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* View Switcher: List vs Calendar */}
        <View style={styles.viewSwitcher}>
          <TouchableOpacity
            style={[styles.viewTab, viewMode === 'list' && styles.viewTabActive]}
            onPress={() => onViewModeChange('list')}
            activeOpacity={0.7}
          >
            <Feather
              name="list"
              size={15}
              color={viewMode === 'list' ? COLORS.accentBlue : COLORS.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewTab, viewMode === 'calendar' && styles.viewTabActive]}
            onPress={() => onViewModeChange('calendar')}
            activeOpacity={0.7}
          >
            <Feather
              name="calendar"
              size={15}
              color={viewMode === 'calendar' ? COLORS.accentBlue : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Segmented Buttons */}
      <View style={styles.statusRow}>
        {[
          { id: 'all', label: 'All Contests' },
          { id: 'live', label: '🔴 Live Now' },
          { id: 'upcoming', label: 'Upcoming' }
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.statusBtn, isActive && styles.statusBtnActive]}
              onPress={() => onStatusFilterChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusBtnText, isActive && styles.statusBtnTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Platform Filter Pills */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {/* All Platforms chip */}
          <TouchableOpacity
            style={[
              styles.platformChip,
              isAllPlatformsSelected && styles.platformChipAllActive
            ]}
            onPress={onSelectAllPlatforms}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.platformChipText,
                isAllPlatformsSelected && styles.chipTextActive
              ]}
            >
              All Platforms
            </Text>
          </TouchableOpacity>

          {/* Individual platform chips */}
          {platforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.id);
            const count = contestCountsByPlatform[platform.id] || 0;
            const brandColor = platform.color || COLORS.accentBlue;

            return (
              <TouchableOpacity
                key={platform.id}
                style={[
                  styles.platformChip,
                  isSelected && {
                    borderColor: brandColor,
                    backgroundColor: platform.badgeBg || 'rgba(59, 130, 246, 0.15)'
                  }
                ]}
                onPress={() => onTogglePlatform(platform.id)}
                activeOpacity={0.7}
              >
                <PlatformIcon platform={platform.id} size={14} />
                <Text
                  style={[
                    styles.platformChipText,
                    isSelected && { color: brandColor, fontWeight: '700' }
                  ]}
                >
                  {platform.name}
                </Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Division / Tag Filter Chips */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          <TouchableOpacity
            style={[
              styles.divisionChip,
              isAllDivisionsSelected && styles.divisionChipActive
            ]}
            onPress={onSelectAllDivisions}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.divisionChipText,
                isAllDivisionsSelected && styles.divisionChipTextActive
              ]}
            >
              All Divisions
            </Text>
          </TouchableOpacity>

          {COMMON_DIVISIONS.filter((d) => d !== 'All').map((div) => {
            const isSelected = selectedDivisions.includes(div);
            return (
              <TouchableOpacity
                key={div}
                style={[styles.divisionChip, isSelected && styles.divisionChipActive]}
                onPress={() => onToggleDivision(div)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.divisionChipText,
                    isSelected && styles.divisionChipTextActive
                  ]}
                >
                  {div}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 10
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  searchBox: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: COLORS.textPrimary,
    fontSize: 13
  },
  clearBtn: {
    padding: 2
  },
  viewSwitcher: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    height: 40,
    padding: 3
  },
  viewTab: {
    width: 38,
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewTabActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)'
  },
  statusRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    padding: 3,
    gap: 4
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusBtnActive: {
    backgroundColor: COLORS.bgCardHover,
    borderWidth: 1,
    borderColor: COLORS.borderActive
  },
  statusBtnText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600'
  },
  statusBtnTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '700'
  },
  filterSection: {
    marginVertical: 1
  },
  chipsScroll: {
    gap: 8
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16
  },
  platformChipAllActive: {
    borderColor: COLORS.accentBlue,
    backgroundColor: 'rgba(59, 130, 246, 0.15)'
  },
  platformChipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600'
  },
  chipTextActive: {
    color: COLORS.accentBlue,
    fontWeight: '700'
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1
  },
  countBadgeText: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700'
  },
  divisionChip: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  divisionChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: COLORS.accentIndigo
  },
  divisionChipText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600'
  },
  divisionChipTextActive: {
    color: '#a5b4fc',
    fontWeight: '700'
  }
});

