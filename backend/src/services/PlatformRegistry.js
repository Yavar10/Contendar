import { globalCache } from './CacheService.js';
import { CodeforcesPlatform } from './platforms/CodeforcesPlatform.js';
import { LeetCodePlatform } from './platforms/LeetCodePlatform.js';
import { CodeChefPlatform } from './platforms/CodeChefPlatform.js';
import { AtCoderPlatform } from './platforms/AtCoderPlatform.js';

export class PlatformRegistry {
  constructor() {
    this.platforms = new Map();
  }

  /**
   * Register a new platform provider.
   * @param {BasePlatform} platformInstance
   */
  register(platformInstance) {
    if (!platformInstance.id) {
      throw new Error('Platform instance missing id property');
    }
    this.platforms.set(platformInstance.id, platformInstance);
    console.log(`[PlatformRegistry] Registered platform: ${platformInstance.name} (${platformInstance.id})`);
  }

  /**
   * Get metadata of all registered platforms.
   */
  getPlatformsMetadata() {
    return Array.from(this.platforms.values()).map((p) => p.getMetadata());
  }

  /**
   * Get platform by ID.
   */
  getPlatform(id) {
    return this.platforms.get(id);
  }

  /**
   * Fetch contests for a specific platform with caching.
   */
  async fetchPlatformContests(platformId) {
    const platform = this.platforms.get(platformId);
    if (!platform) return [];

    const cacheKey = `contests_${platformId}`;
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const contests = await platform.fetchContests();
      if (contests && contests.length > 0) {
        globalCache.set(cacheKey, contests, 300); // 5 min TTL
        return contests;
      }
    } catch (err) {
      console.error(`[PlatformRegistry] Failed to fetch contests for ${platformId}:`, err);
    }

    // Attempt stale fallback if live fetch failed or returned empty
    const stale = globalCache.getStaleFallback(cacheKey);
    return stale || [];
  }

  /**
   * Fetch all contests from specified or all platforms, with filters.
   */
  async getContests({
    platforms = [],
    divisions = [],
    status = 'all',
    search = '',
    from = null,
    to = null
  } = {}) {
    // If no platform specified, default to all registered platforms
    const targetPlatformIds = platforms.length > 0
      ? platforms.filter((id) => this.platforms.has(id))
      : Array.from(this.platforms.keys());

    // Fetch from all target platforms concurrently
    const promises = targetPlatformIds.map((id) => this.fetchPlatformContests(id));
    const settled = await Promise.allSettled(promises);

    let allContests = [];
    settled.forEach((result, idx) => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        allContests.push(...result.value);
      } else {
        const platformId = targetPlatformIds[idx];
        console.warn(`[PlatformRegistry] Platform ${platformId} failed:`, result.reason);
      }
    });

    // Re-evaluate live vs upcoming status right now in case of cached data
    const now = Date.now();
    allContests = allContests.map((c) => {
      const isLive = now >= c.startTimeMs && now <= c.endTimeMs;
      const isUpcoming = now < c.startTimeMs;
      const currentStatus = isLive ? 'LIVE' : isUpcoming ? 'UPCOMING' : 'PAST';
      return {
        ...c,
        status: currentStatus
      };
    });

    // Status filter
    if (status && status.toLowerCase() !== 'all') {
      const targetStatus = status.toUpperCase();
      allContests = allContests.filter((c) => c.status === targetStatus);
    }

    // Division filter
    if (divisions && divisions.length > 0) {
      const targetDivs = divisions.map((d) => d.toLowerCase().trim());
      // If user selected 'all', no filtering needed
      if (!targetDivs.includes('all')) {
        allContests = allContests.filter((c) => {
          return c.divisions.some((d) => {
            const dLower = d.toLowerCase();
            return targetDivs.some((td) => {
              // Exact or substring match (e.g. "div. 2" matches "Div. 2", "div 2")
              const tdClean = td.replace(/[^a-z0-9]/g, '');
              const dClean = dLower.replace(/[^a-z0-9]/g, '');
              return dClean.includes(tdClean) || tdClean.includes(dClean);
            });
          });
        });
      }
    }

    // Search filter
    if (search && search.trim() !== '') {
      const s = search.toLowerCase().trim();
      allContests = allContests.filter((c) =>
        c.title.toLowerCase().includes(s) ||
        c.platformName.toLowerCase().includes(s) ||
        c.divisions.some((d) => d.toLowerCase().includes(s))
      );
    }

    // Date range filter
    if (from) {
      const fromMs = new Date(from).getTime();
      if (!isNaN(fromMs)) {
        allContests = allContests.filter((c) => c.endTimeMs >= fromMs);
      }
    }
    if (to) {
      const toMs = new Date(to).getTime();
      if (!isNaN(toMs)) {
        allContests = allContests.filter((c) => c.startTimeMs <= toMs);
      }
    }

    // Sort chronologically by startTimeMs
    allContests.sort((a, b) => a.startTimeMs - b.startTimeMs);

    return allContests;
  }
}

// Create singleton and register default platforms
export const platformRegistry = new PlatformRegistry();

// Register LeetCode, Codeforces, CodeChef, and AtCoder
platformRegistry.register(new CodeforcesPlatform());
platformRegistry.register(new LeetCodePlatform());
platformRegistry.register(new CodeChefPlatform());
platformRegistry.register(new AtCoderPlatform());
