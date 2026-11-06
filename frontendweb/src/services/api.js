/**
 * API service for fetching platforms and contests.
 *
 * Every fetch function returns { data, isFallback }.
 *   data       – the array of results
 *   isFallback – true when the backend was unreachable and hardcoded demo data is served
 */

const API_BASE = '/api';

/**
 * Fetch platform metadata from the backend.
 * Falls back to hardcoded list when the server is down.
 */
export async function getPlatforms() {
  try {
    const res = await fetch(`${API_BASE}/platforms`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data: data.data || [], isFallback: false };
  } catch (err) {
    console.error('Failed to load platforms from API, using fallback:', err);
    return { data: FALLBACK_PLATFORMS, isFallback: true };
  }
}

/**
 * Fetch contests from the backend with optional filters.
 * Falls back to hardcoded demo contests when the server is down.
 */
export async function getContests({ platforms = [], divisions = [], status = 'all', search = '' } = {}) {
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

    const res = await fetch(`${API_BASE}/contests?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data: data.data || [], isFallback: false };
  } catch (err) {
    console.warn('Backend API unavailable, serving hardcoded demo data:', err.message);
    return { data: generateFallbackContests(), isFallback: true };
  }
}

// ─── Hardcoded Fallback Data ─────────────────────────────────────────────────

const FALLBACK_PLATFORMS = [
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

function generateFallbackContests() {
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
