import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { TIMEZONES } from '../utils/timeUtils';

export function TimezoneModal({
  visible,
  currentTimezone,
  onSelectTimezone,
  onClose
}) {
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
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="globe-outline" size={18} color={COLORS.accentBlue} />
              <Text style={styles.title}>Select Timezone</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {TIMEZONES.map((tz) => {
              const isSelected = currentTimezone === tz.id;

              return (
                <TouchableOpacity
                  key={tz.id}
                  style={[styles.itemRow, isSelected && styles.itemRowSelected]}
                  onPress={() => {
                    onSelectTimezone(tz.id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text style={[styles.itemLabel, isSelected && styles.itemLabelSelected]}>
                      {tz.label}
                    </Text>
                    {tz.offset ? (
                      <Text style={styles.itemOffset}>UTC {tz.offset}</Text>
                    ) : (
                      <Text style={styles.itemOffset}>Device system time</Text>
                    )}
                  </View>

                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.accentBlue} />
                  )}
                </TouchableOpacity>
              );
            })}
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
    paddingBottom: 28
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  list: {
    padding: 16,
    gap: 8
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  itemRowSelected: {
    borderColor: COLORS.accentBlue,
    backgroundColor: 'rgba(59, 130, 246, 0.12)'
  },
  itemLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700'
  },
  itemLabelSelected: {
    color: COLORS.accentBlue
  },
  itemOffset: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2
  }
});

