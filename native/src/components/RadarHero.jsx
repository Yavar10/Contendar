import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { getCountdown, formatDuration } from '../utils/timeUtils';
import { openContestArena } from '../utils/calendarSync';
import { PlatformIcon } from './PlatformIcons';

export function RadarHero({ contests, onSelectContest, nowMs }) {
  // Breathing animation for the radar glow
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

    // Continuous slow radar sweep rotation
    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
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

  // Find priority contest: First LIVE contest, or the closest UPCOMING contest
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
      <LinearGradient
        colors={['rgba(24, 28, 48, 0.9)', 'rgba(12, 14, 26, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Ambient background glow */}
        <Animated.View
          style={[
            styles.ambientGlow,
            {
              backgroundColor: isLive
                ? 'rgba(255, 69, 58, 0.15)'
                : 'rgba(10, 132, 255, 0.14)',
              transform: [{ scale: pulseAnim }]
            }
          ]}
        />

        {/* Content Column */}
        <View style={styles.leftCol}>
          {/* Header pill */}
          <View style={styles.statusPill}>
            {isLive ? (
              <>
                <View style={styles.pulseDotRed} />
                <Text style={styles.statusPillLive}>LIVE TELEMETRY</Text>
              </>
            ) : (
              <>
                <View style={styles.pulseDotBlue} />
                <Text style={styles.statusPillText}>CHRONO RADAR</Text>
              </>
            )}
          </View>

          {nextContest ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onSelectContest(nextContest)}
              style={styles.contestTouch}
            >
              <Text style={styles.heroTitle} numberOfLines={2}>
                {nextContest.title}
              </Text>

              {/* Meta row */}
              <View style={styles.metaRow}>
                <View style={styles.platformBadge}>
                  <PlatformIcon platform={nextContest.platform} size={13} />
                  <Text style={styles.platformName}>{nextContest.platformName}</Text>
                </View>

                {countdown && (
                  <View style={[styles.timerBadge, isLive && styles.timerBadgeLive]}>
                    <Feather
                      name="clock"
                      size={11}
                      color={isLive ? COLORS.appleRed : COLORS.appleBlue}
                    />
                    <Text style={[styles.timerText, isLive && styles.timerTextLive]}>
                      {countdown.label.replace(/^Starts in /i, 'in ')}
                    </Text>
                  </View>
                )}
              </View>

              {/* Arena button */}
              <TouchableOpacity
                style={styles.arenaBtn}
                onPress={() => openContestArena(nextContest.url)}
                activeOpacity={0.7}
              >
                <Text style={styles.arenaBtnText}>Open Arena</Text>
                <Feather name="arrow-up-right" size={13} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <View style={styles.idleWrap}>
              <Text style={styles.idleTitle}>Radar Scanning...</Text>
              <Text style={styles.idleSubtitle}>
                Awaiting upcoming CP rounds from verified adapters.
              </Text>
            </View>
          )}
        </View>

        {/* Soulful Radar Visual Graphic (Concentric rings + radar sweep + orbiting platform dots) */}
        <View style={styles.graphicBox}>
          <Svg width={110} height={110} viewBox="0 0 110 110">
            <Defs>
              <SvgLinearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={isLive ? COLORS.appleRed : COLORS.appleCyan} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={isLive ? COLORS.appleOrange : COLORS.appleBlue} stopOpacity="0.1" />
              </SvgLinearGradient>
            </Defs>

            {/* Concentric rings */}
            <Circle cx="55" cy="55" r="50" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" fill="none" />
            <Circle cx="55" cy="55" r="36" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            <Circle cx="55" cy="55" r="22" stroke="rgba(10, 132, 255, 0.25)" strokeWidth="1.5" fill="none" />
            
            {/* Crosshair axes */}
            <Path d="M55 5 L55 105" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            <Path d="M5 55 L105 55" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />

            {/* Orbiting platform node dots */}
            <Circle cx="55" cy="19" r="3.5" fill="#3b82f6" /> {/* Codeforces Blue */}
            <Circle cx="91" cy="55" r="3.5" fill="#f59e0b" /> {/* LeetCode Orange */}
            <Circle cx="55" cy="91" r="3.5" fill="#a855f7" /> {/* CodeChef Purple */}
            <Circle cx="19" cy="55" r="3.5" fill="#06b6d4" /> {/* AtCoder Cyan */}
          </Svg>

          {/* Center glowing radar beacon */}
          <Animated.View
            style={[
              styles.radarCenterBlip,
              {
                backgroundColor: isLive ? COLORS.appleRed : COLORS.appleBlue,
                transform: [{ scale: pulseAnim }]
              }
            ]}
          />

          {/* Rotating radar sweep line */}
          <Animated.View
            style={[
              styles.radarSweepLine,
              {
                borderLeftColor: isLive ? COLORS.appleRed : COLORS.appleCyan,
                transform: [{ rotate: spin }]
              }
            ]}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4
  },
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative'
  },
  ambientGlow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70
  },
  leftCol: {
    flex: 1,
    paddingRight: 10
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6
  },
  pulseDotBlue: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.appleBlue
  },
  pulseDotRed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.appleRed
  },
  statusPillText: {
    color: COLORS.appleBlue,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  },
  statusPillLive: {
    color: COLORS.appleRed,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  },
  contestTouch: {
    gap: 6
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 2
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8
  },
  platformName: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700'
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.badgeUpcomingBg,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8
  },
  timerBadgeLive: {
    backgroundColor: COLORS.badgeLiveBg
  },
  timerText: {
    color: COLORS.appleBlue,
    fontSize: 10,
    fontWeight: '800'
  },
  timerTextLive: {
    color: COLORS.appleRed
  },
  arenaBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.appleBlue,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 2
  },
  arenaBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800'
  },
  idleWrap: {
    paddingVertical: 4
  },
  idleTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700'
  },
  idleSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2
  },
  graphicBox: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  radarCenterBlip: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5
  },
  radarSweepLine: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderLeftWidth: 1.5,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    opacity: 0.8
  }
});

