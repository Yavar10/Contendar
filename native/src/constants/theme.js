import { StyleSheet, Platform } from 'react-native';

/**
 * Apple Human Interface Guidelines (HIG) Theme System
 * Precise tokens for dark appearance, system colors, materials, and typography.
 */

export const COLORS = {
  // Apple Dark Mode Backgrounds
  systemBackground: '#000000',
  secondarySystemBackground: '#1C1C1E',
  tertiarySystemBackground: '#2C2C2E',
  systemGroupedBackground: '#000000',
  secondarySystemGroupedBackground: '#1C1C1E',
  tertiarySystemGroupedBackground: '#2C2C2E',
  elevatedBackground: '#242426',

  // Backwards compatibility aliases
  bgPrimary: '#000000',
  bgSecondary: '#1C1C1E',
  bgCard: '#1C1C1E',
  bgCardSolid: '#1C1C1E',
  bgCardHover: '#2C2C2E',
  bgGlass: 'rgba(255, 255, 255, 0.06)',
  bgGlassActive: 'rgba(255, 255, 255, 0.12)',
  bgInput: 'rgba(118, 118, 128, 0.24)',

  // Apple System Fills & Materials
  systemFill: 'rgba(120, 120, 128, 0.36)',
  secondarySystemFill: 'rgba(120, 120, 128, 0.32)',
  tertiarySystemFill: 'rgba(118, 118, 128, 0.24)',
  quaternarySystemFill: 'rgba(118, 118, 128, 0.18)',

  // Apple Separators (Hairline dividers)
  separator: 'rgba(84, 84, 88, 0.65)',
  opaqueSeparator: '#38383A',
  hairline: 'rgba(255, 255, 255, 0.1)',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.14)',
  borderActive: 'rgba(10, 132, 255, 0.6)',

  // Apple SF Typography Labels
  label: '#FFFFFF',
  secondaryLabel: 'rgba(235, 235, 245, 0.60)',
  tertiaryLabel: 'rgba(235, 235, 245, 0.35)',
  quaternaryLabel: 'rgba(235, 235, 245, 0.18)',

  // Backwards compatibility text aliases
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(235, 235, 245, 0.60)',
  textMuted: 'rgba(235, 235, 245, 0.35)',
  textDim: 'rgba(235, 235, 245, 0.18)',

  // Apple iOS System Palette
  systemBlue: '#0A84FF',
  systemGreen: '#30D158',
  systemIndigo: '#5E5CE6',
  systemOrange: '#FF9F0A',
  systemPink: '#FF375F',
  systemPurple: '#BF5AF2',
  systemRed: '#FF453A',
  systemTeal: '#64D2FF',
  systemYellow: '#FFD60A',
  systemGray: '#8E8E93',
  systemGray2: '#636366',
  systemGray3: '#48484A',
  systemGray4: '#3A3A3C',
  systemGray5: '#2C2C2E',
  systemGray6: '#1C1C1E',

  // Alias tints
  appleBlue: '#0A84FF',
  appleGreen: '#30D158',
  appleOrange: '#FF9F0A',
  appleRed: '#FF453A',
  applePurple: '#BF5AF2',
  appleCyan: '#64D2FF',
  appleAmber: '#FFD60A',

  // Badges & States
  badgeLiveBg: 'rgba(255, 69, 58, 0.15)',
  badgeLiveBorder: 'rgba(255, 69, 58, 0.35)',
  badgeUpcomingBg: 'rgba(10, 132, 255, 0.12)',
  badgeUpcomingBorder: 'rgba(10, 132, 255, 0.25)',

  // Platform Accents
  platformColors: {
    codeforces: '#3B82F6',
    leetcode: '#F59E0B',
    codechef: '#A855F7',
    atcoder: '#06B6D4',
    hackerrank: '#30D158',
    default: '#0A84FF'
  }
};

export const TYPOGRAPHY = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
    color: COLORS.label
  },
  title1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.36,
    color: COLORS.label
  },
  title2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.35,
    color: COLORS.label
  },
  title3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
    color: COLORS.label
  },
  headline: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    color: COLORS.label
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.41,
    color: COLORS.label
  },
  callout: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.32,
    color: COLORS.label
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
    color: COLORS.secondaryLabel
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.08,
    color: COLORS.secondaryLabel
  },
  caption1: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    color: COLORS.secondaryLabel
  },
  caption2: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.07,
    color: COLORS.tertiaryLabel
  }
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4
  },
  popover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8
  }
};
