import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export function ApiBanner({ onRetry, onConfigure, onDismiss, isRefreshing }) {
  return (
    <View style={styles.banner}>
      <View style={styles.leftCol}>
        <Feather name="wifi-off" size={16} color={COLORS.accentAmber} />
        <View style={styles.textWrap}>
          <Text style={styles.title}>Offline / Backend Demo Mode</Text>
          <Text style={styles.desc}>
            Showing verified offline rounds. Configure backend IP to sync live contests.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={onRetry}
          disabled={isRefreshing}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={12} color="#000" />
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.configBtn}
          onPress={onConfigure}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={12} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={14} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  leftCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  textWrap: {
    flex: 1
  },
  title: {
    color: COLORS.accentAmber,
    fontSize: 11,
    fontWeight: '700'
  },
  desc: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 1
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  retryBtn: {
    backgroundColor: COLORS.accentAmber,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  retryBtnText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '800'
  },
  configBtn: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dismissBtn: {
    padding: 4
  }
});

