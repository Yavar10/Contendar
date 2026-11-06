import { BasePlatform } from './BasePlatform.js';

export class CodeforcesPlatform extends BasePlatform {
  constructor() {
    super({
      id: 'codeforces',
      name: 'Codeforces',
      color: '#3b82f6', // Electric Blue
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      website: 'https://codeforces.com/contests',
      availableDivisions: ['All', 'Div. 1', 'Div. 2', 'Div. 3', 'Div. 4', 'Educational', 'Global']
    });
  }

  parseDivisions(name) {
    const divisions = [];
    const lower = name.toLowerCase();

    const hasDiv1 = /div\.?\s*1\b/i.test(name);
    const hasDiv2 = /div\.?\s*2\b/i.test(name);
    const hasDiv3 = /div\.?\s*3\b/i.test(name);
    const hasDiv4 = /div\.?\s*4\b/i.test(name);
    const isEdu = lower.includes('educational');
    const isGlobal = lower.includes('global');

    if (hasDiv1) divisions.push('Div. 1');
    if (hasDiv2) divisions.push('Div. 2');
    if (hasDiv3) divisions.push('Div. 3');
    if (hasDiv4) divisions.push('Div. 4');
    if (isEdu) {
      divisions.push('Educational');
      if (!divisions.includes('Div. 2')) divisions.push('Div. 2');
    }
    if (isGlobal) {
      divisions.push('Global');
      if (!divisions.includes('Div. 1')) divisions.push('Div. 1');
      if (!divisions.includes('Div. 2')) divisions.push('Div. 2');
    }

    if (divisions.length === 0) {
      divisions.push('Open / Other');
    }

    return divisions;
  }

  async fetchContests() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('https://codeforces.com/api/contest.list?gym=false', {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Codeforces API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.status !== 'OK' || !Array.isArray(data.result)) {
        throw new Error('Codeforces API invalid result payload');
      }

      const now = Date.now();
      // Keep contests that are upcoming (phase === 'BEFORE'), live (CODING), or recently active
      const contests = data.result
        .filter((c) => {
          if (!c.startTimeSeconds || isNaN(c.startTimeSeconds)) return false;
          const startTimeMs = c.startTimeSeconds * 1000;
          const durationSeconds = c.durationSeconds || 7200;
          const endTimeMs = startTimeMs + durationSeconds * 1000;
          return endTimeMs > now - 12 * 3600 * 1000;
        })
        .map((c) => {
          const startTimeMs = c.startTimeSeconds * 1000;
          const durationSeconds = c.durationSeconds || 7200;
          const divisions = this.parseDivisions(c.name);

          return this.createContest({
            id: c.id,
            title: c.name,
            url: `https://codeforces.com/contest/${c.id}`,
            startTimeMs,
            durationSeconds,
            divisions,
            type: c.type || 'Standard',
            description: `Codeforces Round. Phase: ${c.phase}`
          });
        });

      contests.sort((a, b) => a.startTimeMs - b.startTimeMs);
      return contests;
    } catch (err) {
      console.error('[CodeforcesPlatform] Error fetching contests:', err.message);
      return [];
    }
  }
}
