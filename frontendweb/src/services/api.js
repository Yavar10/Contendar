/**
 * API service for fetching platforms and contests
 */

const API_BASE = '/api';

export async function getPlatforms() {
  try {
    const res = await fetch(`${API_BASE}/platforms`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Failed to load platforms from API, using fallback:', err);
    // Safe client-side fallback if backend connection drops
    return [
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
  }
}

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
    return data.data || [];
  } catch (err) {
    console.error('Failed to load contests from API:', err);
    return [];
  }
}
