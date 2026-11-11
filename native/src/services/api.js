import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * API service for fetching platforms and contests from the backend.
 * Auto-detects Expo packager host for mobile devices.
 */

function getAutoDetectedApiHost() {
  try {
    // 1. Expo development host (e.g. 192.168.1.x:8081)
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || '';
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return `http://${ip}:5000`;
      }
    }
  } catch (e) {
    console.warn('Could not auto-detect Expo host IP:', e);
  }

  // 2. Android emulator default
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }

  // 3. iOS simulator / web / localhost
  return 'http://localhost:5000';
}

let configuredApiBase = getAutoDetectedApiHost();

export function getApiBaseUrl() {
  return configuredApiBase;
}

export function setApiBaseUrl(url) {
  if (!url) return;
  configuredApiBase = url.replace(/\/+$/, '');
}

/**
 * Fetch helper with timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 3500) {
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
 */
export async function getPlatforms(baseUrl = configuredApiBase) {
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  try {
    const res = await fetchWithTimeout(`${cleanUrl}/api/platforms`, {}, 3500);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data: data.data || [], error: null, success: true };
  } catch (err) {
    console.warn('API platform load failed:', err.message);
    return { data: [], error: err.message || 'Network error', success: false };
  }
}

/**
 * Fetch contests from backend with optional filters.
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
    const res = await fetchWithTimeout(endpoint, {}, 4000);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data: data.data || [], error: null, success: true };
  } catch (err) {
    console.warn('API contest load failed:', err.message);
    return { data: [], error: err.message || 'Network error', success: false };
  }
}
