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

      const response = await fetch('https://atcoder.jp/contests/', {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`AtCoder returned status ${response.status}`);
      }

      const html = await response.text();
      const contests = [];
      const now = Date.now();

      // Parse both upcoming and active contest sections
      const sections = [
        { type: 'upcoming', match: html.match(/id=["']contest-table-upcoming["'][\s\S]*?<tbody>([\s\S]*?)<\/tbody>/i) },
        { type: 'action', match: html.match(/id=["']contest-table-action["'][\s\S]*?<tbody>([\s\S]*?)<\/tbody>/i) }
      ];

      for (const sec of sections) {
        if (!sec.match) continue;
        const tbody = sec.match[1];
        const rowRegex = /<tr>([\s\S]*?)<\/tr>/gi;
        let rowMatch;

        while ((rowMatch = rowRegex.exec(tbody)) !== null) {
          const row = rowMatch[1];
          const timeMatch = row.match(/<time[^>]*class=['"]fixtime[^'"]*['"][^>]*>([^<]+)<\/time>/i);
          const linkMatch = row.match(/<a href=["']\/contests\/([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
          const durationMatch = row.match(/<td class=["']text-center["']>(\d{1,3}):(\d{2})<\/td>/i);

          const tds = Array.from(row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map((m) => m[1].trim());
          const ratedText = tds.length >= 4 ? tds[3].replace(/<[^>]+>/g, '').trim() : '';

          if (timeMatch && linkMatch) {
            const timeStr = timeMatch[1].trim();
            const contestId = linkMatch[1].trim();
            const title = linkMatch[2].replace(/<[^>]+>/g, '').trim();

            let durationSeconds = 7200;
            if (durationMatch) {
              const hours = parseInt(durationMatch[1], 10);
              const mins = parseInt(durationMatch[2], 10);
              durationSeconds = hours * 3600 + mins * 60;
            }

            const isoTimeStr = timeStr.replace(' ', 'T').replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
            const startTimeMs = new Date(isoTimeStr).getTime();
            const endTimeMs = startTimeMs + durationSeconds * 1000;

            if (isNaN(startTimeMs)) continue;
            if (endTimeMs < now - 12 * 3600 * 1000) continue; // Skip stale contests

            const divisions = this.parseDivisions(title, contestId);
            const contestType = ratedText ? `Rated (${ratedText})` : 'AtCoder Contest';

            contests.push(
              this.createContest({
                id: contestId,
                title,
                url: `https://atcoder.jp/contests/${contestId}`,
                startTimeMs,
                durationSeconds,
                divisions,
                type: contestType,
                description: `Official AtCoder round: ${title}${ratedText ? ` (Rated: ${ratedText})` : ''}`
              })
            );
          }
        }
      }

      contests.sort((a, b) => a.startTimeMs - b.startTimeMs);
      return contests;
    } catch (err) {
      console.error('[AtCoderPlatform] Error fetching contests:', err.message);
      return [];
    }
  }
}
