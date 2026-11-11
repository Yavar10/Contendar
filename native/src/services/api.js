import { Platform } from 'react-native';

/**
 * API service for fetching platforms and contests with robust fallback for mobile.
 */

const DEFAULT_ANDROID_URL = 'http://10.0.2.2:5000';
const DEFAULT_IOS_URL = 'http://localhost:5000';

let configuredApiBase = Platform.OS === 'android' ? DEFAULT_ANDROID_URL : DEFAULT_IOS_URL;

export function getApiBaseUrl() {
  return configuredApiBase;
}

export function setApiBaseUrl(url) {
  if (!url) return;
  // Ensure no trailing slash
  configuredApiBase = url.replace(/\/+$/, '');
}

/**
 * Fetch helper with timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Test connectivity to a specific server URL
 */
export async function testServerConnection(baseUrl = configuredApiBase) {
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  try {
    const res = await fetchWithTimeout(`${cleanUrl}/api/health`, {}, 3000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, message: data.message || 'Connected successfully' };
  } catch (err) {
    return { success: false, message: err.name === 'AbortError' ? 'Connection timed out' : err.message };
  }
}

/**
 * Fetch platform metadata from the backend.
 * Falls back to hardcoded list when the server is down or unreachable.
 */
export async function getPlatforms(baseUrl = configuredApiBase) {
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  try {
    const res = await fetchWithTimeout(`${cleanUrl}/api/platforms`, {}, 4000);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data: data.data || [], isFallback: false };
  } catch (err) {
    console.warn('API platform load failed, using fallback:', err.message);
    return { data: FALLBACK_PLATFORMS, isFallback: true };
  }
}

/**
 * Fetch contests from backend with optional filters.
 * Falls back to dynamic fallback data when server is down or unreachable.
 */
export async function getContests({
  platforms = [],
  divisions = [],
  status = 'all',
  search = '',
  baseUrl = configuredApiBase
} = {}) {
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  try {
    const params = new URLSearchParams();
    if (platforms.length > 0) {
      params.set('platforms', platforms.join(','));
    }
    if (divisions.length > 0 && !divisions.includes('All')) {
      params.set('divisions', divisions.join(','));
    }
    if (status && status !== 'all') {
      params.set('status', status);
    }
    if (search) {
      params.set('search', search);
    }

    const queryStr = params.toString();
    const endpoint = `${cleanUrl}/api/contests${queryStr ? `?${queryStr}` : ''}`;
    const res = await fetchWithTimeout(endpoint, {}, 5000);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data: data.data || [], isFallback: false };
  } catch (err) {
    console.warn('API contest load failed, using fallback demo data:', err.message);
    return { data: generateFallbackContests(), isFallback: true };
  }
}

// ─── Verified Mobile Demo Fallback Data ──────────────────────────────────────────

export const FALLBACK_PLATFORMS = [
  {
    id: 'codeforces',
    name: 'Codeforces',
    color: '#3b82f6',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    website: 'https://codeforces.com/contests',
    availableDivisions: ['All', 'Div. 1', 'Div. 2', 'Div. 3', 'Div. 4', 'Educational', 'Global']
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    website: 'https://leetcode.com/contest/',
    availableDivisions: ['All', 'Weekly', 'Biweekly']
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    color: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    website: 'https://www.codechef.com/contests',
    availableDivisions: ['All', 'Div. 1', 'Div. 2', 'Div. 3', 'Div. 4', 'Starters']
  },
  {
    id: 'atcoder',
    name: 'AtCoder',
    color: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    website: 'https://atcoder.jp/contests/',
    availableDivisions: ['All', 'ABC (Beginner)', 'ARC (Regular)', 'AGC (Grand)', 'AHC (Heuristic)']
  }
];

export function generateFallbackContests() {
  const now = Date.now();
  const ONE_HOUR = 3600 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;

  return [
    {
      id: 'cf-live-1003',
      platform: 'codeforces',
      platformName: 'Codeforces',
      platformColor: '#3b82f6',
      platformBadgeBg: 'rgba(59, 130, 246, 0.15)',
      title: 'Codeforces Round 1003 (Div. 1 + Div. 2)',
      url: 'https://codeforces.com/contests',
      startTimeMs: now - 45 * 60 * 1000,
      endTimeMs: now + 75 * 60 * 1000,
      durationSeconds: 7200,
      status: 'LIVE',
      divisions: ['Div. 1', 'Div. 2'],
      type: 'ICPC / CF Rules',
      description: 'Official rated round for Division 1 and Division 2. 6-7 algorithmic problems.'
    },
    {
      id: 'lc-live-bw150',
      platform: 'leetcode',
      platformName: 'LeetCode',
      platformColor: '#f59e0b',
      platformBadgeBg: 'rgba(245, 158, 11, 0.15)',
      title: 'Biweekly Contest 150',
      url: 'https://leetcode.com/contest/',
      startTimeMs: now - 30 * 60 * 1000,
      endTimeMs: now + 60 * 60 * 1000,
      durationSeconds: 5400,
      status: 'LIVE',
      divisions: ['Biweekly'],
      type: 'Standard LeetCode',
      description: 'Biweekly algorithmic sprint. 4 algorithmic challenges of escalating difficulty.'
    },
    {
      id: 'cf-upcoming-1004',
      platform: 'codeforces',
      platformName: 'Codeforces',
      platformColor: '#3b82f6',
      platformBadgeBg: 'rgba(59, 130, 246, 0.15)',
      title: 'Codeforces Round 1004 (Div. 3)',
      url: 'https://codeforces.com/contests',
      startTimeMs: now + 3 * ONE_HOUR,
      endTimeMs: now + 5.25 * ONE_HOUR,
      durationSeconds: 8100,
      status: 'UPCOMING',
      divisions: ['Div. 3'],
      type: 'Rated for Div 3',
      description: '7 algorithmic challenges geared towards rating under 1600.'
    },
    {
      id: 'ac-upcoming-abc392',
      platform: 'atcoder',
      platformName: 'AtCoder',
      platformColor: '#06b6d4',
      platformBadgeBg: 'rgba(6, 182, 212, 0.15)',
      title: 'AtCoder Beginner Contest 392 (ABC 392)',
      url: 'https://atcoder.jp/contests/',
      startTimeMs: now + 7 * ONE_HOUR,
      endTimeMs: now + 8.67 * ONE_HOUR,
      durationSeconds: 6000,
      status: 'UPCOMING',
      divisions: ['ABC (Beginner)'],
      type: 'AtCoder Rules',
      description: 'Beginner-friendly round rated up to 1999 rating. 8 problems A through H.'
    },
    {
      id: 'cc-upcoming-starters174',
      platform: 'codechef',
      platformName: 'CodeChef',
      platformColor: '#a855f7',
      platformBadgeBg: 'rgba(168, 85, 247, 0.15)',
      title: 'Starters 174 (Div 1, 2, 3, 4)',
      url: 'https://www.codechef.com/contests',
      startTimeMs: now + ONE_DAY + 2 * ONE_HOUR,
      endTimeMs: now + ONE_DAY + 4 * ONE_HOUR,
      durationSeconds: 7200,
      status: 'UPCOMING',
      divisions: ['Div. 1', 'Div. 2', 'Div. 3', 'Div. 4', 'Starters'],
      type: 'Rated for All',
      description: 'Weekly Wednesday challenge rated for all divisions on CodeChef.'
    },
    {
      id: 'lc-upcoming-wc438',
      platform: 'leetcode',
      platformName: 'LeetCode',
      platformColor: '#f59e0b',
      platformBadgeBg: 'rgba(245, 158, 11, 0.15)',
      title: 'Weekly Contest 438',
      url: 'https://leetcode.com/contest/',
      startTimeMs: now + ONE_DAY + 8 * ONE_HOUR,
      endTimeMs: now + ONE_DAY + 9.5 * ONE_HOUR,
      durationSeconds: 5400,
      status: 'UPCOMING',
      divisions: ['Weekly'],
      type: 'Standard Weekly',
      description: 'Premier Sunday algorithmic contest. 4 problems.'
    },
    {
      id: 'cf-upcoming-edu175',
      platform: 'codeforces',
      platformName: 'Codeforces',
      platformColor: '#3b82f6',
      platformBadgeBg: 'rgba(59, 130, 246, 0.15)',
      title: 'Educational Codeforces Round 175 (Rated for Div. 2)',
      url: 'https://codeforces.com/contests',
      startTimeMs: now + 3 * ONE_DAY,
      endTimeMs: now + 3 * ONE_DAY + 2 * ONE_HOUR,
      durationSeconds: 7200,
      status: 'UPCOMING',
      divisions: ['Div. 2', 'Educational'],
      type: 'Educational Round',
      description: 'Focus on classical data structures and dynamic programming. 6 problems.'
    },
    {
      id: 'ac-upcoming-arc193',
      platform: 'atcoder',
      platformName: 'AtCoder',
      platformColor: '#06b6d4',
      platformBadgeBg: 'rgba(6, 182, 212, 0.15)',
      title: 'AtCoder Regular Contest 193 (ARC 193)',
      url: 'https://atcoder.jp/contests/',
      startTimeMs: now + 4 * ONE_DAY + 4 * ONE_HOUR,
      endTimeMs: now + 4 * ONE_DAY + 6 * ONE_HOUR,
      durationSeconds: 7200,
      status: 'UPCOMING',
      divisions: ['ARC (Regular)'],
      type: 'AtCoder Grand Rules',
      description: 'Regular competitive round rated for competitors 1200 - 2799.'
    },
    {
      id: 'cf-upcoming-global29',
      platform: 'codeforces',
      platformName: 'Codeforces',
      platformColor: '#3b82f6',
      platformBadgeBg: 'rgba(59, 130, 246, 0.15)',
      title: 'Codeforces Global Round 29',
      url: 'https://codeforces.com/contests',
      startTimeMs: now + 8 * ONE_DAY,
      endTimeMs: now + 8 * ONE_DAY + 2.5 * ONE_HOUR,
      durationSeconds: 9000,
      status: 'UPCOMING',
      divisions: ['Global', 'Div. 1', 'Div. 2'],
      type: 'Global Round',
      description: 'Rated for everyone. Special prizes for top 30 global finishers.'
    },
    {
      id: 'lc-upcoming-wc439',
      platform: 'leetcode',
      platformName: 'LeetCode',
      platformColor: '#f59e0b',
      platformBadgeBg: 'rgba(245, 158, 11, 0.15)',
      title: 'Weekly Contest 439',
      url: 'https://leetcode.com/contest/',
      startTimeMs: now + 12 * ONE_DAY,
      endTimeMs: now + 12 * ONE_DAY + 1.5 * ONE_HOUR,
      durationSeconds: 5400,
      status: 'UPCOMING',
      divisions: ['Weekly'],
      type: 'Standard Weekly',
      description: 'Sunday morning algorithmic sprint.'
    }
  ];
}

