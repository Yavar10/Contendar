/**
 * Time utility functions for formatting, countdowns, and calendar math.
 */

export const TIMEZONES = [
  { id: 'local', label: 'Local Time' },
  { id: 'UTC', label: 'UTC' },
  { id: 'Asia/Kolkata', label: 'IST (+5:30)' },
  { id: 'America/New_York', label: 'EST / EDT' },
  { id: 'America/Los_Angeles', label: 'PST / PDT' },
  { id: 'Europe/London', label: 'GMT / BST' },
  { id: 'Asia/Tokyo', label: 'JST (+9:00)' }
];

/**
 * Format duration in seconds to human readable (e.g., "2 hrs", "1 hr 30 mins")
 */
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0 mins';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}d ${remHours > 0 ? `${remHours}h` : ''}`.trim();
  }

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Format timestamp into date & time string based on timezone
 */
export function formatDateTime(timestampMs, timezone = 'local') {
  const date = new Date(timestampMs);
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  if (timezone !== 'local') {
    options.timeZone = timezone;
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
}

/**
 * Format just the time (e.g., "08:30 PM")
 */
export function formatTimeOnly(timestampMs, timezone = 'local') {
  const date = new Date(timestampMs);
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  if (timezone !== 'local') {
    options.timeZone = timezone;
  }
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

/**
 * Format time in concise 24h format for calendar pills (e.g. "19:30" or "08:00")
 */
export function formatTimeCompact(timestampMs, timezone = 'local') {
  const date = new Date(timestampMs);
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  if (timezone !== 'local') {
    options.timeZone = timezone;
  }
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

/**
 * Extract clean, high-priority short title for calendar pill display
 * Prevents awkward multi-line wrapping and oversized title distortion.
 */
export function getSmartContestTitle(title, platform) {
  if (!title) return '';
  const clean = title.trim();

  // LeetCode: Weekly Contest 527 -> Weekly 527
  const lcWeekly = clean.match(/weekly\s+contest\s*(\d+)/i);
  if (lcWeekly) return `Weekly ${lcWeekly[1]}`;

  const lcBiweekly = clean.match(/biweekly\s+contest\s*(\d+)/i);
  if (lcBiweekly) return `Biweekly ${lcBiweekly[1]}`;

  // Codeforces Educational: Educational Codeforces Round 196 -> Edu #196
  const cfEdu = clean.match(/educational.*round\s*(\d+)/i);
  if (cfEdu) return `Edu #${cfEdu[1]}`;

  // Codeforces Div Round: Codeforces Round 1000 (Div. 2) -> Div.2 #1000
  const cfRound = clean.match(/round\s*(\d+).*div\.?\s*([1-4])/i) || clean.match(/div\.?\s*([1-4]).*round\s*(\d+)/i);
  if (cfRound) {
    const isFirstFormat = Boolean(clean.match(/round\s*(\d+).*div/i));
    const roundNum = isFirstFormat ? cfRound[1] : cfRound[2];
    const divNum = isFirstFormat ? cfRound[2] : cfRound[1];
    return `Div.${divNum} #${roundNum}`;
  }

  const cfDivOnly = clean.match(/div\.?\s*([1-4])/i);
  if (cfDivOnly && /codeforces/i.test(clean)) {
    const num = clean.match(/#?(\d+)/)?.[1];
    return `Div.${cfDivOnly[1]} ${num ? `#${num}` : ''}`.trim();
  }

  // Codeforces Kotlin Heroes
  if (/kotlin\s*heroes/i.test(clean)) {
    const num = clean.match(/\d+/)?.[0] || '';
    return `Kotlin ${num}`.trim();
  }

  // Codeforces Global
  if (/global\s*round\s*(\d+)/i.test(clean)) {
    const num = clean.match(/\d+/)?.[0] || '';
    return `Global #${num}`.trim();
  }

  // CodeChef Starters: Starters 263 -> Starters 263
  const ccStarters = clean.match(/starters\s*(\d+)/i);
  if (ccStarters) return `Starters ${ccStarters[1]}`;

  // CodeChef DSA Challenge: Monday Munch - DSA Challenge 027 -> DSA #027
  const ccDsa = clean.match(/dsa\s*challenge\s*(\d+)/i);
  if (ccDsa) return `DSA #${ccDsa[1]}`;

  // AtCoder: AtCoder Beginner Contest 380 -> ABC 380
  const acAbc = clean.match(/beginner\s*contest\s*(\d+)/i) || clean.match(/^abc\s*(\d+)/i);
  if (acAbc) return `ABC ${acAbc[1]}`;

  const acArc = clean.match(/regular\s*contest\s*(\d+)/i) || clean.match(/^arc\s*(\d+)/i);
  if (acArc) return `ARC ${acArc[1]}`;

  // Fallback: strip noise like "(Rated for Div. 2)" and truncate cleanly
  let simplified = clean
    .replace(/\s*\([^)]*rated[^)]*\)/gi, '')
    .replace(/^codeforces\s+/gi, 'CF ')
    .replace(/^codechef\s+/gi, 'CC ')
    .replace(/^atcoder\s+/gi, 'AC ')
    .trim();

  if (simplified.length > 20) {
    return simplified.substring(0, 18) + '…';
  }
  return simplified;
}

/**
 * Calculate dynamic countdown text and percentage progress
 */
export function getCountdown(targetMs, status, nowMs = Date.now(), startTimeMs = 0, endTimeMs = 0) {
  if (status === 'LIVE') {
    const diff = endTimeMs - nowMs;
    if (diff <= 0) return { label: 'Ending soon', isLive: true, progress: 100 };

    const totalDuration = endTimeMs - startTimeMs;
    const elapsed = nowMs - startTimeMs;
    const progress = totalDuration > 0 ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)) : 50;

    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    return {
      label: `Ends in ${hours > 0 ? `${hours}h ` : ''}${mins}m ${secs}s`,
      isLive: true,
      progress
    };
  }

  // Upcoming
  const diff = targetMs - nowMs;
  if (diff <= 0) {
    return { label: 'Starting now...', isLive: true, progress: 0 };
  }

  const days = Math.floor(diff / (24 * 3600000));
  const hours = Math.floor((diff % (24 * 3600000)) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  let label = '';
  if (days > 0) {
    label = `${days}d ${hours}h ${mins}m`;
  } else if (hours > 0) {
    label = `${hours}h ${mins}m ${secs}s`;
  } else {
    label = `${mins}m ${secs}s`;
  }

  return {
    label: `Starts in ${label}`,
    isLive: false,
    progress: 0
  };
}

/**
 * Check if two dates are on the same calendar day
 */
export function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Group contests for list view: Live, Today, Tomorrow, This Week, Later
 */
export function groupContestsByTimeline(contests) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const groups = {
    live: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: []
  };

  contests.forEach((c) => {
    if (c.status === 'LIVE') {
      groups.live.push(c);
      return;
    }

    const start = new Date(c.startTimeMs);
    if (isSameDay(start, today)) {
      groups.today.push(c);
    } else if (isSameDay(start, tomorrow)) {
      groups.tomorrow.push(c);
    } else if (start > tomorrow && start <= endOfWeek) {
      groups.thisWeek.push(c);
    } else if (start > endOfWeek) {
      groups.later.push(c);
    }
  });

  return groups;
}

/**
 * Generate 6-week matrix (42 cells) for calendar grid
 */
export function generateMonthCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = lastDay.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days = [];

  // Previous month trailing days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const date = new Date(year, month - 1, dayNum);
    days.push({
      date,
      dayNumber: dayNum,
      isCurrentMonth: false,
      dateString: date.toISOString().split('T')[0]
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      dayNumber: i,
      isCurrentMonth: true,
      dateString: date.toISOString().split('T')[0]
    });
  }

  // Next month leading days to complete full grid (up to 35 or 42)
  const remaining = (days.length > 35 ? 42 : 35) - days.length;
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      dayNumber: i,
      isCurrentMonth: false,
      dateString: date.toISOString().split('T')[0]
    });
  }

  return days;
}
