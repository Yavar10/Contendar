import React from 'react';
import Svg, { Rect, Path, Circle, G } from 'react-native-svg';

/**
 * Authentic SVG icons for CP platforms in React Native
 */
export function PlatformIcon({ platform, size = 16 }) {
  const p = (platform || '').toLowerCase();

  if (p.includes('codeforces')) {
    // Codeforces iconic 3-bar logo
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect x="2" y="10" width="4.5" height="11" rx="1.5" fill="#eab308" />
        <Rect x="9.5" y="4" width="4.5" height="17" rx="1.5" fill="#3b82f6" />
        <Rect x="17" y="13" width="4.5" height="8" rx="1.5" fill="#ef4444" />
      </Svg>
    );
  }

  if (p.includes('leetcode')) {
    // LeetCode iconic logo
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.97 3.653c.302.016.606.012.91-.012a6.38 6.38 0 0 0 2.21-.63 6.643 6.643 0 0 0 1.956-1.503l3.854-4.126 1.838-1.966a1.374 1.374 0 0 0-.961-2.348h-7.61a1.374 1.374 0 0 0 0 2.748h5.368L12.42 14.59a3.896 3.896 0 0 1-1.148.882 3.636 3.636 0 0 1-1.26.36 3.2 3.2 0 0 1-2.73-2.008 3.16 3.16 0 0 1-.036-1.353 3.01 3.01 0 0 1 .69-1.204l4.58-4.903 2.93-3.136A1.374 1.374 0 0 0 13.483 0z"
          fill="#f59e0b"
        />
        <Path
          d="M17.065 17.065a1.374 1.374 0 0 1 1.943 0l3.05 3.05a1.374 1.374 0 0 1-1.943 1.943l-3.05-3.05a1.374 1.374 0 0 1 0-1.943z"
          fill="#94a3b8"
        />
      </Svg>
    );
  }

  if (p.includes('codechef')) {
    // CodeChef chef / bracket badge
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="2" />
        <Path
          d="M8 9C8 7.34315 9.34315 6 11 6H13C14.6569 6 16 7.34315 16 9C16 10.6569 14.6569 12 13 12H11C9.34315 12 8 10.6569 8 9Z"
          fill="#a855f7"
        />
        <Path d="M7 16L12 13L17 16" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }

  if (p.includes('atcoder')) {
    // AtCoder crystal hexagon
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
          fill="rgba(6, 182, 212, 0.2)"
          stroke="#06b6d4"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <Path d="M12 2L12 22" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.5" />
        <Path d="M3 7L21 17" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.5" />
      </Svg>
    );
  }

  // Fallback generic terminal icon
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="2" y="3" width="20" height="18" rx="3" stroke="#6366f1" strokeWidth="2" fill="none" />
      <Path d="M7 8L11 12L7 16" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13 16H17" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

