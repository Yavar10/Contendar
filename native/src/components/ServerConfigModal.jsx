import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { getApiBaseUrl, setApiBaseUrl, testServerConnection } from '../services/api';

export function ServerConfigModal({
  visible,
  onClose,
  onServerSaved
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

  const handleSave = () => {
    setApiBaseUrl(urlInput);
    onServerSaved();
    onClose();
  };

  const setPreset = (presetUrl) => {
    setUrlInput(presetUrl);
    setTestResult(null);
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
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <MaterialCommunityIcons name="server-network" size={20} color={COLORS.accentBlue} />
              <Text style={styles.title}>Backend API Settings</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>Server Base URL</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={urlInput}
                onChangeText={(text) => {
                  setUrlInput(text);
                  setTestResult(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="http://192.168.1.X:5000"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            {/* Presets */}
            <Text style={styles.subLabel}>Quick Presets</Text>
            <View style={styles.presetRow}>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => setPreset('http://10.0.2.2:5000')}
                activeOpacity={0.7}
              >
                <Text style={styles.presetChipText}>Android (10.0.2.2)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => setPreset('http://localhost:5000')}
                activeOpacity={0.7}
              >
                <Text style={styles.presetChipText}>iOS (localhost)</Text>
              </TouchableOpacity>
            </View>

            {/* Test result status */}
            {testResult && (
              <View
                style={[
                  styles.statusBox,
                  testResult.success ? styles.statusBoxSuccess : styles.statusBoxError
                ]}
              >
                <Ionicons
                  name={testResult.success ? 'checkmark-circle' : 'alert-circle'}
                  size={16}
                  color={testResult.success ? COLORS.accentGreen : COLORS.accentRed}
                />
                <Text
                  style={[
                    styles.statusText,
                    testResult.success ? styles.statusTextSuccess : styles.statusTextError
                  ]}
                >
                  {testResult.message}
                </Text>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.testBtn}
                onPress={handleTest}
                disabled={testing}
                activeOpacity={0.7}
              >
                {testing ? (
                  <ActivityIndicator size="small" color={COLORS.accentBlue} />
                ) : (
                  <Text style={styles.testBtnText}>Test Connection</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Text style={styles.saveBtnText}>Save & Apply</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    padding: 20
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject
  },
  sheetContainer: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingBottom: 20,
    overflow: 'hidden'
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
  body: {
    padding: 16
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6
  },
  inputWrap: {
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center'
  },
  input: {
    color: COLORS.textPrimary,
    fontSize: 14
  },
  subLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8
  },
  presetChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  presetChipText: {
    color: COLORS.accentBlue,
    fontSize: 11,
    fontWeight: '600'
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    padding: 10,
    marginTop: 14
  },
  statusBoxSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  statusBoxError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  statusTextSuccess: {
    color: COLORS.accentGreen
  },
  statusTextError: {
    color: COLORS.accentRed
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18
  },
  testBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center'
  },
  testBtnText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700'
  },
  saveBtn: {
    flex: 1,
    backgroundColor: COLORS.accentBlue,
    borderRadius: 10,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800'
  }
});

