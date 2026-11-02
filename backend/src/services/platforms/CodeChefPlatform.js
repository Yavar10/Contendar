import { BasePlatform } from './BasePlatform.js';

export class CodeChefPlatform extends BasePlatform {
  constructor() {
    super({
      id: 'codechef',
      name: 'CodeChef',
      color: '#a855f7', // Vivid Purple
      badgeBg: 'rgba(168, 85, 247, 0.15)',
      website: 'https://www.codechef.com/contests',
      availableDivisions: ['All', 'Div. 1', 'Div. 2', 'Div. 3', 'Div. 4', 'Starters']
    });
  }

  parseDivisions(name) {
    const divisions = [];
    const lower = name.toLowerCase();

    const hasDiv1 = /div\.?\s*1\b/i.test(name) || /division\s*1\b/i.test(name);
    const hasDiv2 = /div\.?\s*2\b/i.test(name) || /division\s*2\b/i.test(name);
    const hasDiv3 = /div\.?\s*3\b/i.test(name) || /division\s*3\b/i.test(name);
    const hasDiv4 = /div\.?\s*4\b/i.test(name) || /division\s*4\b/i.test(name);
    const isStarters = lower.includes('starters');

    if (hasDiv1) divisions.push('Div. 1');
    if (hasDiv2) divisions.push('Div. 2');
    if (hasDiv3) divisions.push('Div. 3');
    if (hasDiv4) divisions.push('Div. 4');

    if (isStarters) {
      divisions.push('Starters');
      // Starters contests feature rated problems across Div 1, 2, 3, 4
      if (!divisions.includes('Div. 1')) divisions.push('Div. 1');
      if (!divisions.includes('Div. 2')) divisions.push('Div. 2');
      if (!divisions.includes('Div. 3')) divisions.push('Div. 3');
      if (!divisions.includes('Div. 4')) divisions.push('Div. 4');
    }

    if (divisions.length === 0) {
      divisions.push('All Divisions');
    }

    return divisions;
  }

  async fetchContests() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all',
        {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`CodeChef API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error('CodeChef API returned non-success status');
      }

      const rawContests = [
        ...(Array.isArray(data.present_contests) ? data.present_contests : []),
        ...(Array.isArray(data.future_contests) ? data.future_contests : [])
      ];

      const contests = rawContests.map((c) => {
        const startTimeMs = new Date(c.contest_start_date_iso).getTime();
        const endTimeMs = new Date(c.contest_end_date_iso).getTime();
        const durationSeconds = Math.max(
          0,
          Math.floor((endTimeMs - startTimeMs) / 1000) || parseInt(c.contest_duration, 10) * 60 || 7200
        );

        const divisions = this.parseDivisions(c.contest_name);

        return this.createContest({
          id: c.contest_code || c.contest_id,
          title: c.contest_name,
          url: `https://www.codechef.com/${c.contest_code}`,
          startTimeMs,
          durationSeconds,
          divisions,
          type: 'CodeChef Contest',
          description: `CodeChef rated event. Code: ${c.contest_code}`
        });
      });

      return contests;
    } catch (err) {
      console.error('[CodeChefPlatform] Error fetching contests:', err.message);
      return [];
    }
  }
}
