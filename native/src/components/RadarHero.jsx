import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants/theme';
import { getCountdown } from '../utils/timeUtils';
import { openContestArena } from '../utils/calendarSync';
import { PlatformIcon } from './PlatformIcons';

export function RadarHero({ contests, onSelectContest, nowMs }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    );

    pulseLoop.start();
    rotateLoop.start();

    return () => {
      pulseLoop.stop();
      rotateLoop.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const liveContest = contests.find((c) => c.status === 'LIVE');
  const upcomingContests = contests
    .filter((c) => c.status === 'UPCOMING')
    .sort((a, b) => a.startTimeMs - b.startTimeMs);
  const nextContest = liveContest || upcomingContests[0] || null;

  const isLive = nextContest?.status === 'LIVE';

  const countdown = nextContest
    ? getCountdown(
        nextContest.startTimeMs,
        nextContest.status,
        nowMs || Date.now(),
        nextContest.startTimeMs,
        nextContest.endTimeMs
      )
    : null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Left Column: Context, Title, Timers, Action */}
        <View style={styles.leftCol}>
          <View style={styles.statusPill}>
            <View style={[styles.statusDot, isLive ? styles.dotLive : styles.dotRadar]} />
            <Text style={[styles.statusPillText, isLive ? styles.textLive : styles.textRadar]}>
              {isLive ? 'LIVE NOW' : 'NEXT ON RADAR'}
            </Text>
          </View>

          {nextContest ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSelectContest(nextContest)}
              style={styles.touchArea}
            >
              <Text style={styles.title} numberOfLines={2}>
                {nextContest.title}
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.platformBadge}>
                  <PlatformIcon platform={nextContest.platform} size={13} />
                  <Text style={styles.platformName}>{nextContest.platformName}</Text>
                </View>

                {Boolean(countdown) && (
                  <View style={[styles.timerBadge, isLive && styles.timerBadgeLive]}>
                    <Text style={[styles.timerText, isLive && styles.timerTextLive]}>
                      {countdown.label.replace(/^Starts in /i, 'in ')}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[styles.actionBtn, isLive && styles.actionBtnLive]}
                onPress={() => openContestArena(nextContest.url)}
                activeOpacity={0.7}
              >
                <Text style={styles.actionBtnText}>Open Arena</Text>
                <Feather name="arrow-up-right" size={13} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <View style={styles.idleWrap}>
              <Text style={styles.idleTitle}>Radar Scanning</Text>
              <Text style={styles.idleSubtitle}>
                Monitoring Codeforces, LeetCode, CodeChef, and AtCoder.
              </Text>
            </View>
          )}
        </View>

        {/* Right Column: Precision Chrono Radar Graphic */}
        <View style={styles.radarGraphicBox}>
          <Svg width={96} height={96} viewBox="0 0 96 96">
            <Defs>
              <SvgLinearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={isLive ? COLORS.systemRed : COLORS.systemTeal} stopOpacity="0.7" />
                <Stop offset="100%" stopColor={isLive ? COLORS.systemOrange : COLORS.systemBlue} stopOpacity="0.05" />
              </SvgLinearGradient>
            </Defs>

            {/* Hairline concentric range rings */}
            <Circle cx="48" cy="48" r="44" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.75" fill="none" />
            <Circle cx="48" cy="48" r="32" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.75" strokeDasharray="3 3" fill="none" />
            <Circle cx="48" cy="48" r="20" stroke={isLive ? 'rgba(255, 69, 58, 0.25)' : 'rgba(10, 132, 255, 0.25)'} strokeWidth="1" fill="none" />

            {/* Precision crosshairs */}
            <Path d="M48 4 L48 92" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.75" />
            <Path d="M4 48 L92 48" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.75" />

            {/* Platform orbital nodes */}
            <Circle cx="48" cy="16" r="3" fill="#3B82F6" />
            <Circle cx="80" cy="48" r="3" fill="#F59E0B" />
            <Circle cx="48" cy="80" r="3" fill="#A855F7" />
            <Circle cx="16" cy="48" r="3" fill="#06B6D4" />
          </Svg>

          {/* Animated Center Target Blip */}
          <Animated.View
            style={[
              styles.radarCenterBlip,
              {
                backgroundColor: isLive ? COLORS.systemRed : COLORS.systemBlue,
                transform: [{ scale: pulseAnim }]
              }
            ]}
          />

          {/* Precision Sweeping Radar Beam */}
          <Animated.View
            style={[
              styles.radarSweepLine,
              {
                borderLeftColor: isLive ? COLORS.systemRed : COLORS.systemTeal,
                transform: [{ rotate: spin }]
              }
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8
  },
  card: {
    backgroundColor: COLORS.secondarySystemBackground,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative'
  },
  leftCol: {
    flex: 1,
    paddingRight: 12
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  dotLive: {
    backgroundColor: COLORS.systemRed
  },
  dotRadar: {
    backgroundColor: COLORS.systemBlue
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4
  },
  textLive: {
    color: COLORS.systemRed
  },
  textRadar: {
    color: COLORS.systemBlue
  },
  touchArea: {
    flex: 1
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 22,
    color: COLORS.label,
    marginBottom: 8
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8
  },
  platformName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.label
  },
  timerBadge: {
    backgroundColor: 'rgba(10, 132, 255, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8
  },
  timerBadgeLive: {
    backgroundColor: 'rgba(255, 69, 58, 0.16)'
  },
  timerText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.systemBlue
  },
  timerTextLive: {
    color: COLORS.systemRed
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: COLORS.systemBlue,
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 14
  },
  actionBtnLive: {
    backgroundColor: COLORS.systemRed
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  idleWrap: {
    paddingVertical: 8
  },
  idleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.label,
    marginBottom: 2
  },
  idleSubtitle: {
    fontSize: 13,
    color: COLORS.secondaryLabel
  },
  radarGraphicBox: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  radarCenterBlip: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4
  },
  radarSweepLine: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderLeftWidth: 1.5
  }
});
