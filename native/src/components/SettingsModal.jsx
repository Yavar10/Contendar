import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { TIMEZONES } from '../utils/timeUtils';
import { getApiBaseUrl, setApiBaseUrl, testServerConnection } from '../services/api';

export function SettingsModal({
  visible,
  onClose,
  currentTimezone,
  onSelectTimezone,
  onRefresh,
  isRefreshing,
  hasApiError
}) {
  const [urlInput, setUrlInput] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testServerConnection(urlInput);
    setTesting(false);
    setTestResult(res);
  };

  const handleSaveUrl = () => {
    setApiBaseUrl(urlInput);
    onRefresh();
  };

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
            <View style={styles.headerTitleRow}>
              <Ionicons name="settings-sharp" size={18} color={COLORS.accentBlue} />
              <Text style={styles.headerTitle}>Radar Settings</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Quick Refresh */}
            <View style={styles.refreshBar}>
              <View style={styles.refreshInfo}>
                <Text style={styles.refreshTitle}>Backend Telemetry Status</Text>
                <Text style={[styles.refreshSub, hasApiError && styles.refreshSubError]}>
                  {hasApiError
                    ? 'Backend unreachable. No live contests loaded.'
                    : 'Connected to live platform adapter feeds'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={onRefresh}
                disabled={isRefreshing}
                activeOpacity={0.7}
              >
                {isRefreshing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Feather name="refresh-cw" size={13} color="#fff" />
                    <Text style={styles.refreshBtnText}>Sync</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Timezone Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TIMEZONE PREFERENCE</Text>
              <View style={styles.timezoneList}>
                {TIMEZONES.map((tz) => {
                  const isSelected = currentTimezone === tz.id;
                  return (
                    <TouchableOpacity
                      key={tz.id}
                      style={[styles.tzItem, isSelected && styles.tzItemActive]}
                      onPress={() => onSelectTimezone(tz.id)}
                      activeOpacity={0.7}
                    >
                      <View>
                        <Text style={[styles.tzLabel, isSelected && styles.tzLabelActive]}>
                          {tz.label}
                        </Text>
                        <Text style={styles.tzOffset}>
                          {tz.offset ? `UTC ${tz.offset}` : 'System device time'}
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.accentBlue} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Backend Connection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>API SERVER CONFIGURATION</Text>
              <View style={styles.serverCard}>
                <View style={styles.serverStatusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: hasApiError ? COLORS.accentRed : COLORS.accentGreen }
                    ]}
                  />
                  <Text style={[styles.serverStatusText, hasApiError && styles.serverStatusTextError]}>
                    {hasApiError ? 'Backend Server Disconnected' : 'Live Backend Connected'}
                  </Text>
                </View>

                <View style={styles.urlInputRow}>
                  <TextInput
                    style={styles.urlInput}
                    value={urlInput}
                    onChangeText={(t) => {
                      setUrlInput(t);
                      setTestResult(null);
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="http://192.168.1.X:5000"
                    placeholderTextColor={COLORS.textMuted}
                  />
                  <TouchableOpacity style={styles.saveUrlBtn} onPress={handleSaveUrl}>
                    <Text style={styles.saveUrlBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>

                {/* Presets */}
                <View style={styles.presetRow}>
                  <TouchableOpacity
                    style={styles.presetChip}
                    onPress={() => {
                      setUrlInput('http://10.0.2.2:5000');
                      setTestResult(null);
                    }}
                  >
                    <Text style={styles.presetText}>10.0.2.2 (Android)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.presetChip}
                    onPress={() => {
                      setUrlInput('http://localhost:5000');
                      setTestResult(null);
                    }}
                  >
                    <Text style={styles.presetText}>localhost:5000</Text>
                  </TouchableOpacity>
                </View>

                {/* Test button & status */}
                <View style={styles.testRow}>
                  <TouchableOpacity
                    style={styles.testBtn}
                    onPress={handleTest}
                    disabled={testing}
                  >
                    {testing ? (
                      <ActivityIndicator size="small" color={COLORS.accentBlue} />
                    ) : (
                      <Text style={styles.testBtnText}>Test Server</Text>
                    )}
                  </TouchableOpacity>

                  {testResult && (
                    <Text
                      style={[
                        styles.testResultText,
                        testResult.success ? styles.testSuccess : styles.testError
                      ]}
                      numberOfLines={1}
                    >
                      {testResult.message}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
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
    maxHeight: '82%',
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: {
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
  body: {
    padding: 16
  },
  refreshBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  refreshInfo: {
    flex: 1,
    marginRight: 10
  },
  refreshTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700'
  },
  refreshSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2
  },
  refreshSubError: {
    color: COLORS.accentRed
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentBlue,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8
  },
  refreshBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800'
  },
  section: {
    marginBottom: 16
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8
  },
  timezoneList: {
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    overflow: 'hidden'
  },
  tzItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)'
  },
  tzItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)'
  },
  tzLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600'
  },
  tzLabelActive: {
    color: COLORS.accentBlue,
    fontWeight: '700'
  },
  tzOffset: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1
  },
  serverCard: {
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    padding: 12
  },
  serverStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  serverStatusText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600'
  },
  serverStatusTextError: {
    color: COLORS.accentRed
  },
  urlInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  urlInput: {
    flex: 1,
    height: 38,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: COLORS.textPrimary,
    fontSize: 12
  },
  saveUrlBtn: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveUrlBtnText: {
    color: COLORS.accentBlue,
    fontSize: 11,
    fontWeight: '700'
  },
  presetRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10
  },
  presetChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  presetText: {
    color: COLORS.accentBlue,
    fontSize: 10,
    fontWeight: '600'
  },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  testBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  testBtnText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600'
  },
  testResultText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1
  },
  testSuccess: {
    color: COLORS.accentGreen
  },
  testError: {
    color: COLORS.accentRed
  }
});
