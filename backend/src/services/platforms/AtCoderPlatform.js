import { BasePlatform } from './BasePlatform.js';

export class AtCoderPlatform extends BasePlatform {
  constructor() {
    super({
      id: 'atcoder',
      name: 'AtCoder',
      color: '#06b6d4', // Cyan
      badgeBg: 'rgba(6, 182, 212, 0.15)',
      website: 'https://atcoder.jp/contests/',
      availableDivisions: ['All', 'ABC (Beginner)', 'ARC (Regular)', 'AGC (Grand)', 'AHC (Heuristic)']
    });
  }

  parseDivisions(title, id) {
    const divisions = [];
    const lower = `${title} ${id}`.toLowerCase();

    if (lower.includes('beginner') || /^abc\d+/i.test(id)) {
      divisions.push('ABC (Beginner)');
      divisions.push('Div. 3');
      divisions.push('Div. 4');
    } else if (lower.includes('regular') || /^arc\d+/i.test(id)) {
      divisions.push('ARC (Regular)');
      divisions.push('Div. 1');
      divisions.push('Div. 2');
    } else if (lower.includes('grand') || /^agc\d+/i.test(id)) {
      divisions.push('AGC (Grand)');
      divisions.push('Div. 1');
    } else if (lower.includes('heuristic') || /^ahc\d+/i.test(id)) {
      divisions.push('AHC (Heuristic)');
    } else {
      divisions.push('Open / Other');
    }

    return divisions;
  }

  async fetchContests() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('https://kenkoooo.com/atcoder/resources/contests.json', {
        signal: controller.signal,
        headers: { 'User-Agent': 'ContestCalendarBot/1.0' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`AtCoder API returned status ${response.status}`);
      }

      const list = await response.json();
      if (!Array.isArray(list)) return [];

      const now = Date.now();
      // Filter out permanent practice contests (start_epoch_second === 0 or duration > 30 days)
      const contests = list
        .filter((c) => {
          if (!c.start_epoch_second || c.start_epoch_second === 0) return false;
          if (c.duration_second > 30 * 86400) return false;
          const startTimeMs = c.start_epoch_second * 1000;
          const endTimeMs = startTimeMs + c.duration_second * 1000;
          return endTimeMs > now - 12 * 3600 * 1000;
        })
        .map((c) => {
          const startTimeMs = c.start_epoch_second * 1000;
          const divisions = this.parseDivisions(c.title, c.id);

          return this.createContest({
            id: c.id,
            title: c.title,
            url: `https://atcoder.jp/contests/${c.id}`,
            startTimeMs,
            durationSeconds: c.duration_second,
            divisions,
            type: c.rate_change ? `Rated (${c.rate_change})` : 'Contest',
            description: `AtCoder contest: ${c.title}`
          });
        });

      return contests;
    } catch (err) {
      console.error('[AtCoderPlatform] Error fetching contests:', err.message);
      return [];
    }
  }
}
