/**
 * API service for fetching platforms and contests from the backend.
 */

export const API_BASE = import.meta.env.VITE_API_BASE || 'https://contendar.onrender.com/api';

/**
 * Check backend health and latency in milliseconds
 */
export async function checkServerHealth() {
  const start = performance.now();
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(8000) });
    const latencyMs = Math.round(performance.now() - start);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, latencyMs, message: data.message || 'Operational' };
  } catch (err) {
    const latencyMs = Math.round(performance.now() - start);
    return { ok: false, latencyMs, message: err.message || 'Offline' };
  }
}

/**
 * Fetch platform metadata from the backend.
 */
export async function getPlatforms() {
  try {
    const res = await fetch(`${API_BASE}/platforms`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data: data.data || [], error: null, success: true };
  } catch (err) {
    console.error('Failed to load platforms from API:', err);
    return { data: [], error: err.message || 'Network error', success: false };
  }
}

/**
 * Fetch contests from the backend with optional filters.
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
    return { data: data.data || [], error: null, success: true };
  } catch (err) {
    console.warn('Backend API unavailable:', err.message);
    return { data: [], error: err.message || 'Network error', success: false };
  }
}
