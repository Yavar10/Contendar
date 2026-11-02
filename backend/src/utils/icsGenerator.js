/**
 * Formats date to iCalendar UTC format: YYYYMMDDTHHMMSSZ
 */
function formatIcsDate(date) {
  const d = new Date(date);
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Escapes characters for iCalendar fields
 */
function escapeIcsText(text) {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generates an .ics file string from an array of contests
 */
export function generateIcsCalendar(contests, calendarTitle = 'Competitive Programming Contests') {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Contendar//ContestCalendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calendarTitle)}`,
    'X-WR-TIMEZONE:UTC'
  ];

  for (const contest of contests) {
    const uid = `${contest.id}@contendar.app`;
    const dtStamp = formatIcsDate(new Date());
    const dtStart = formatIcsDate(new Date(contest.startTimeMs));
    const dtEnd = formatIcsDate(new Date(contest.endTimeMs));
    const summary = `[${contest.platformName}] ${contest.title}`;
    const description = `${contest.title}\\nPlatform: ${contest.platformName}\\nDivisions: ${contest.divisions.join(', ')}\\nContest Link: ${contest.url}`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      `URL:${escapeIcsText(contest.url)}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
