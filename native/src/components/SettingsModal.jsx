import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { TIMEZONES } from '../utils/timeUtils';
import { getApiBaseUrl, setApiBaseUrl, testServerConnection } from '../services/api';
import { AppleBottomSheet } from './AppleBottomSheet';

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
    <AppleBottomSheet
      visible={visible}
      onClose={onClose}
      maxHeight="86%"
    >
      {/* Navigation Bar */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.6}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Group 1: Feed Connection Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA FEEDS</Text>
          <View style={styles.groupedTable}>
            <View style={styles.tableRow}>
              <View style={styles.statusRowLeft}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: hasApiError ? COLORS.systemRed : COLORS.systemGreen }
                  ]}
                />
                <View>
                  <Text style={styles.rowLabel}>
                    {hasApiError ? 'Backend Disconnected' : 'Live Feeds Active'}
                  </Text>
                  <Text style={styles.rowSubLabel}>
                    {hasApiError ? 'Server is unreachable' : 'Auto-refreshing every 3 min'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.syncBtn}
                onPress={onRefresh}
                disabled={isRefreshing}
                activeOpacity={0.6}
              >
                {isRefreshing ? (
                  <ActivityIndicator size="small" color={COLORS.systemBlue} />
                ) : (
                  <Text style={styles.syncBtnText}>Sync Now</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Group 2: Timezone Preference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TIMEZONE</Text>
          <View style={styles.groupedTable}>
            {TIMEZONES.map((tz, index) => {
              const isSelected = currentTimezone === tz.id;
              const isLast = index === TIMEZONES.length - 1;

              return (
                <React.Fragment key={tz.id}>
                  <TouchableOpacity
                    style={styles.tableRow}
                    onPress={() => onSelectTimezone(tz.id)}
                    activeOpacity={0.6}
                  >
                    <View>
                      <Text style={styles.rowLabel}>{tz.label}</Text>
                      <Text style={styles.rowSubLabel}>
                        {tz.offset ? `UTC ${tz.offset}` : 'System Device Time'}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={COLORS.systemBlue} />
                    )}
                  </TouchableOpacity>
                  {!isLast && <View style={styles.separator} />}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* Group 3: Server Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SERVER CONFIGURATION</Text>
          <View style={styles.groupedTable}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={urlInput}
                onChangeText={(t) => {
                  setUrlInput(t);
                  setTestResult(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="https://contendar.onrender.com"
                placeholderTextColor={COLORS.tertiaryLabel}
              />
              <TouchableOpacity style={styles.applyInputBtn} onPress={handleSaveUrl} activeOpacity={0.7}>
                <Text style={styles.applyInputBtnText}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            {/* Presets Row */}
            <View style={styles.presetsRow}>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => {
                  setUrlInput('https://contendar.onrender.com');
                  setTestResult(null);
                }}
                activeOpacity={0.6}
              >
                <Text style={styles.presetText}>Render Cloud</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => {
                  setUrlInput('http://localhost:5000');
                  setTestResult(null);
                }}
                activeOpacity={0.6}
              >
                <Text style={styles.presetText}>localhost</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => {
                  setUrlInput('http://10.0.2.2:5000');
                  setTestResult(null);
                }}
                activeOpacity={0.6}
              >
                <Text style={styles.presetText}>10.0.2.2</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            {/* Test Server Row */}
            <View style={styles.tableRow}>
              <TouchableOpacity
                style={styles.testBtn}
                onPress={handleTest}
                disabled={testing}
                activeOpacity={0.6}
              >
                {testing ? (
                  <ActivityIndicator size="small" color={COLORS.systemBlue} />
                ) : (
                  <Text style={styles.testBtnText}>Test Server Connection</Text>
                )}
              </TouchableOpacity>

              {Boolean(testResult) && (
                <Text
                  style={[
                    styles.testResultText,
                    testResult.success ? styles.testSuccess : styles.testError
                  ]}
                  numberOfLines={1}
                >
                  {testResult.success ? 'Online' : 'Failed'}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Group 4: About Footer */}
        <View style={styles.aboutFooter}>
          <Text style={styles.aboutTitle}>Contendar</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0 (Apple HIG Edition)</Text>
          <Text style={styles.aboutDesc}>
            Precision competitive programming radar tracking Codeforces, LeetCode, CodeChef, and AtCoder.
          </Text>
        </View>
      </ScrollView>
    </AppleBottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  headerSpacer: {
    width: 50
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.label
  },
  doneBtn: {
    paddingVertical: 4,
    minWidth: 50,
    alignItems: 'flex-end'
  },
  doneBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.systemBlue
  },
  body: {
    paddingHorizontal: 20
  },
  bodyContent: {
    paddingBottom: 28
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
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(84, 84, 88, 0.36)'
  },
  statusRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  rowLabel: {
    fontSize: 15,
    color: COLORS.label
  },
  rowSubLabel: {
    fontSize: 12,
    color: COLORS.secondaryLabel,
    marginTop: 1
  },
  syncBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  syncBtnText: {
    color: COLORS.systemBlue,
    fontSize: 15,
    fontWeight: '600'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6
  },
  textInput: {
    flex: 1,
    height: 38,
    color: COLORS.label,
    fontSize: 14
  },
  applyInputBtn: {
    backgroundColor: COLORS.systemBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  applyInputBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  presetChip: {
    backgroundColor: 'rgba(118, 118, 128, 0.24)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  presetText: {
    color: COLORS.systemBlue,
    fontSize: 12,
    fontWeight: '500'
  },
  testBtn: {
    paddingVertical: 2
  },
  testBtnText: {
    color: COLORS.systemBlue,
    fontSize: 15,
    fontWeight: '500'
  },
  testResultText: {
    fontSize: 13,
    fontWeight: '600'
  },
  testSuccess: {
    color: COLORS.systemGreen
  },
  testError: {
    color: COLORS.systemRed
  },
  aboutFooter: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.label,
    marginBottom: 2
  },
  aboutVersion: {
    fontSize: 12,
    color: COLORS.tertiaryLabel,
    marginBottom: 8
  },
  aboutDesc: {
    fontSize: 12,
    color: COLORS.secondaryLabel,
    textAlign: 'center',
    lineHeight: 18
  }
});
