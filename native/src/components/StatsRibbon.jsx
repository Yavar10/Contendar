import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export function StatsRibbon({ contests, platforms }) {
  const liveCount = contests.filter((c) => c.status === 'LIVE').length;
  const upcomingCount = contests.filter((c) => c.status === 'UPCOMING').length;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Live Card */}
        <View style={[styles.card, liveCount > 0 && styles.cardLive]}>
          <View style={styles.iconWrap}>
            <View style={[styles.dot, liveCount > 0 && styles.dotLive]} />
            <Text style={styles.cardLabel}>LIVE NOW</Text>
          </View>
          <Text style={[styles.cardValue, liveCount > 0 && styles.cardValueLive]}>
            {liveCount}
          </Text>
        </View>

        {/* Upcoming Card */}
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Feather name="clock" size={12} color={COLORS.accentBlue} />
            <Text style={styles.cardLabel}>UPCOMING</Text>
          </View>
          <Text style={styles.cardValue}>{upcomingCount}</Text>
        </View>

        {/* Platforms Card */}
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="grid-outline" size={12} color={COLORS.accentPurple} />
            <Text style={styles.cardLabel}>PLATFORMS</Text>
          </View>
          <Text style={styles.cardValue}>{platforms.length}</Text>
        </View>

        {/* Total Contests Card */}
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="layers-outline" size={12} color={COLORS.accentGreen} />
            <Text style={styles.cardLabel}>TOTAL TRACKED</Text>
          </View>
          <Text style={styles.cardValue}>{contests.length}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 105,
    justifyContent: 'space-between'
  },
  cardLive: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)'
  },
  iconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted
  },
  dotLive: {
    backgroundColor: COLORS.accentRed
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.8
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  cardValueLive: {
    color: COLORS.accentRed
  }
});

