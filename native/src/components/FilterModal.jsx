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
          <View style={styles.grabHandle} />

          {/* Navigation Bar */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onResetAllFilters} style={styles.headerBtn} activeOpacity={0.6}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Filters</Text>

            <TouchableOpacity onPress={onClose} style={styles.headerBtn} activeOpacity={0.6}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Status Section: iOS Segmented Control */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>STATUS</Text>
              <View style={styles.segmentedControl}>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'live', label: 'Live' },
                  { id: 'upcoming', label: 'Upcoming' }
                ].map((s) => {
                  const isActive = statusFilter === s.id;
                  return (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.segment, isActive && styles.segmentActive]}
                      onPress={() => onStatusFilterChange(s.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Platforms Section: Inset Grouped Checklist */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PLATFORMS</Text>
              <View style={styles.groupedTable}>
                {/* All platforms row */}
                <TouchableOpacity
                  style={styles.tableRow}
                  onPress={onSelectAllPlatforms}
                  activeOpacity={0.6}
                >
                  <Text style={styles.tableRowLabel}>All Platforms</Text>
                  {isAllPlatformsSelected && (
                    <Ionicons name="checkmark" size={18} color={COLORS.systemBlue} />
                  )}
                </TouchableOpacity>

                {platforms.map((p, idx) => {
                  const isSelected = selectedPlatforms.includes(p.id);
                  const isLast = idx === platforms.length - 1;

                  return (
                    <React.Fragment key={p.id}>
                      <View style={styles.separator} />
                      <TouchableOpacity
                        style={styles.tableRow}
                        onPress={() => onTogglePlatform(p.id)}
                        activeOpacity={0.6}
                      >
                        <View style={styles.platformRowLeft}>
                          <PlatformIcon platform={p.id} size={16} />
                          <Text style={styles.tableRowLabel}>{p.name}</Text>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark" size={18} color={COLORS.systemBlue} />
                        )}
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>

            {/* Divisions & Formats Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DIVISIONS & ROUND TYPES</Text>
              <View style={styles.chipsWrap}>
                <TouchableOpacity
                  style={[
                    styles.chip,
                    isAllDivisionsSelected && styles.chipActive
                  ]}
                  onPress={onSelectAllDivisions}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isAllDivisionsSelected && styles.chipTextActive
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
                        styles.chip,
                        isSelected && styles.chipActive
                      ]}
                      onPress={() => onToggleDivision(div)}
                      activeOpacity={0.6}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive
                        ]}
                      >
                        {div}
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end'
  },
  dismissOverlay: {
    flex: 1
  },
  sheetContainer: {
    backgroundColor: COLORS.secondarySystemBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '82%',
    paddingBottom: 24
  },
  grabHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  headerBtn: {
    paddingVertical: 4,
    minWidth: 50
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.label
  },
  resetBtnText: {
    fontSize: 17,
    color: COLORS.secondaryLabel
  },
  doneBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.systemBlue,
    textAlign: 'right'
  },
  body: {
    paddingHorizontal: 20
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: COLORS.secondaryLabel,
    marginBottom: 8,
    paddingLeft: 2
  },
  segmentedControl: {
    flexDirection: 'row',
    height: 36,
    backgroundColor: 'rgba(118, 118, 128, 0.24)',
    borderRadius: 9,
    padding: 2
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7
  },
  segmentActive: {
    backgroundColor: '#3A3A3C'
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.secondaryLabel
  },
  segmentTextActive: {
    color: COLORS.label,
    fontWeight: '600'
  },
  groupedTable: {
    backgroundColor: COLORS.tertiarySystemBackground,
    borderRadius: 12,
    overflow: 'hidden'
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  platformRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  tableRowLabel: {
    fontSize: 16,
    color: COLORS.label
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(84, 84, 88, 0.36)'
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    backgroundColor: COLORS.tertiarySystemBackground,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16
  },
  chipActive: {
    backgroundColor: '#FFFFFF'
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.secondaryLabel
  },
  chipTextActive: {
    color: '#000000',
    fontWeight: '600'
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8
  },
  applyBtn: {
    backgroundColor: COLORS.systemBlue,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});
