import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export function TelemetryTicker({ contests, platforms }) {
  const liveCount = contests.filter((c) => c.status === 'LIVE').length;
  const upcomingCount = contests.filter((c) => c.status === 'UPCOMING').length;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.item}>
          {liveCount > 0 ? (
            <View style={styles.liveDot} />
          ) : (
            <View style={styles.idleDot} />
          )}
          <Text style={[styles.text, liveCount > 0 && styles.textLive]}>
            {liveCount} Live
          </Text>
        </View>

        <Text style={styles.separator}>•</Text>

        <View style={styles.item}>
          <Text style={styles.text}>{upcomingCount} Upcoming</Text>
        </View>

        <Text style={styles.separator}>•</Text>

        <View style={styles.item}>
          <Text style={styles.text}>{platforms.length} Platforms</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.accentRed
  },
  idleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.textMuted
  },
  text: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600'
  },
  textLive: {
    color: COLORS.accentRed,
    fontWeight: '700'
  },
  separator: {
    color: COLORS.textDim,
    fontSize: 10
  }
});

