import { BasePlatform } from './BasePlatform.js';

export class LeetCodePlatform extends BasePlatform {
  constructor() {
    super({
      id: 'leetcode',
      name: 'LeetCode',
      color: '#f59e0b', // Amber / Gold
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      website: 'https://leetcode.com/contest/',
      availableDivisions: ['All', 'Weekly', 'Biweekly']
    });
  }

  parseDivisions(title) {
    const divisions = [];
    const lower = title.toLowerCase();

    if (lower.includes('biweekly')) {
      divisions.push('Biweekly');
    } else if (lower.includes('weekly')) {
      divisions.push('Weekly');
    } else {
      divisions.push('Special');
    }

    // LeetCode contests are also open to all skill levels
    divisions.push('All Levels');
    return divisions;
  }

  async fetchContests() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          query: `
            query {
              allContests {
                title
                titleSlug
                startTime
                duration
                originStartTime
                isVirtual
              }
            }
          `
        })
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`LeetCode API returned status ${response.status}`);
      }

      const json = await response.json();
      const contestList = json?.data?.allContests;

      if (!Array.isArray(contestList)) {
        throw new Error('Invalid LeetCode contests response');
      }

      const now = Date.now();
      // LeetCode returns historical + upcoming contests.
      // We want ongoing (LIVE) and upcoming (FUTURE), plus recent (last 12h)
      const contests = contestList
        .filter((c) => {
          if (c.isVirtual) return false;
          const startTimeMs = c.startTime * 1000;
          const endTimeMs = startTimeMs + c.duration * 1000;
          return endTimeMs > now - 12 * 3600 * 1000;
        })
        .map((c) => {
          const startTimeMs = c.startTime * 1000;
          const divisions = this.parseDivisions(c.title);

          return this.createContest({
            id: c.titleSlug,
            title: c.title,
            url: `https://leetcode.com/contest/${c.titleSlug}`,
            startTimeMs,
            durationSeconds: c.duration,
            divisions,
            type: 'LeetCode Contest',
            description: 'Weekly or Biweekly algorithmic contest with 4 problems.'
          });
        });

      return contests;
    } catch (err) {
      console.error('[LeetCodePlatform] Error fetching contests:', err.message);
      return [];
    }
  }
}
