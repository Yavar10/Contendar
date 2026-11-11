import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export function FilterModal({
  visible,
  onClose,
  statusFilter,
  onStatusFilterChange,
  platforms,
  selectedPlatforms,
  onTogglePlatform,
  onSelectAllPlatforms,
  selectedDivisions,
  onToggleDivision,
  onSelectAllDivisions,
  onResetAllFilters,
  resultCount
}) {
  const isAllPlatformsSelected = selectedPlatforms.length === platforms.length;
  const isAllDivisionsSelected =
    selectedDivisions.includes('All') || selectedDivisions.length === 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.dismissOverlay} onPress={onClose} activeOpacity={1} />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Filter Contests</Text>
              <Text style={styles.headerSubtitle}>Refine timeline by status, round or platform</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity onPress={onResetAllFilters} style={styles.resetBtn}>
                <Text style={styles.resetText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Status section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CONTEST STATUS</Text>
              <View style={styles.statusRow}>
                {[
                  { id: 'all', label: 'All Contests' },
                  { id: 'live', label: '🔴 Live Now' },
                  { id: 'upcoming', label: '⏳ Upcoming' }
                ].map((s) => {
                  const isActive = statusFilter === s.id;
                  return (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.statusTab, isActive && styles.statusTabActive]}
                      onPress={() => onStatusFilterChange(s.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[styles.statusTabText, isActive && styles.statusTabTextActive]}
                      >
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Division Chips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DIVISIONS & ROUND TYPES</Text>
              <View style={styles.chipsWrap}>
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
                      style={[
                        styles.divisionChip,
                        isSelected && styles.divisionChipActive
                      ]}
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
              </View>
            </View>

            {/* Platforms Multi-select */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PLATFORMS</Text>
              <View style={styles.chipsWrap}>
                <TouchableOpacity
                  style={[
                    styles.platformChip,
                    isAllPlatformsSelected && styles.platformChipActive
                  ]}
                  onPress={onSelectAllPlatforms}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.platformChipText,
                      isAllPlatformsSelected && styles.platformChipTextActive
                    ]}
                  >
                    All Platforms
                  </Text>
                </TouchableOpacity>

                {platforms.map((p) => {
                  const isSelected = selectedPlatforms.includes(p.id);
                  const brandColor = p.color || COLORS.accentBlue;

                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.platformChip,
                        isSelected && {
                          borderColor: brandColor,
                          backgroundColor: p.badgeBg || 'rgba(59, 130, 246, 0.15)'
                        }
                      ]}
                      onPress={() => onTogglePlatform(p.id)}
                      activeOpacity={0.7}
                    >
                      <PlatformIcon platform={p.id} size={14} />
                      <Text
                        style={[
                          styles.platformChipText,
                          isSelected && { color: brandColor, fontWeight: '700' }
                        ]}
                      >
                        {p.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Action */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.applyBtnText}>
                Show {resultCount} {resultCount === 1 ? 'Contest' : 'Contests'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  dismissOverlay: {
    flex: 1
  },
  sheetContainer: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    maxHeight: '80%',
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800'
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  resetBtn: {
    padding: 4
  },
  resetText: {
    color: COLORS.accentBlue,
    fontSize: 12,
    fontWeight: '600'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    padding: 16
  },
  section: {
    marginBottom: 18
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8
  },
  statusRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    padding: 3,
    gap: 4
  },
  statusTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusTabActive: {
    backgroundColor: COLORS.bgCardHover,
    borderWidth: 1,
    borderColor: COLORS.borderActive
  },
  statusTabText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600'
  },
  statusTabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '700'
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  divisionChip: {
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12
  },
  divisionChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: COLORS.accentIndigo
  },
  divisionChipText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600'
  },
  divisionChipTextActive: {
    color: '#a5b4fc',
    fontWeight: '700'
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14
  },
  platformChipActive: {
    borderColor: COLORS.accentBlue,
    backgroundColor: 'rgba(59, 130, 246, 0.15)'
  },
  platformChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600'
  },
  platformChipTextActive: {
    color: COLORS.accentBlue,
    fontWeight: '700'
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8
  },
  applyBtn: {
    backgroundColor: COLORS.accentBlue,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800'
  }
});

