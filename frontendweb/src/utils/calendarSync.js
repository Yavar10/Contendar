/**
 * Calendar sync and export utilities
 */

function formatGCalDate(timestampMs) {
  return new Date(timestampMs).toISOString().replace(/-|:|\.\d\d\d/g, '');
}

/**
 * Generates direct Google Calendar URL with title, dates, details, and contest link.
 */
export function createGoogleCalendarUrl(contest) {
  const start = formatGCalDate(contest.startTimeMs);
  const end = formatGCalDate(contest.endTimeMs);

  const title = encodeURIComponent(`[${contest.platformName}] ${contest.title}`);
  const details = encodeURIComponent(
    `Contest: ${contest.title}\nPlatform: ${contest.platformName}\nDivisions: ${contest.divisions.join(', ')}\nLink: ${contest.url}`
  );
  const location = encodeURIComponent(contest.url);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

/**
 * Downloads a single contest as an .ics file directly in the browser
 */
export function downloadSingleContestIcs(contest) {
  const dtStamp = formatGCalDate(Date.now());
  const dtStart = formatGCalDate(contest.startTimeMs);
  const dtEnd = formatGCalDate(contest.endTimeMs);

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ContestPulse//SingleContest//EN',
    'BEGIN:VEVENT',
    `UID:${contest.id}@contestpulse.app`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:[${contest.platformName}] ${contest.title}`,
    `DESCRIPTION:${contest.title} - ${contest.url}`,
    `URL:${contest.url}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${contest.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers backend ICS export with filters applied
 */
export function downloadFilteredCalendar(selectedPlatforms = [], selectedDivisions = []) {
  const params = new URLSearchParams();
  if (selectedPlatforms.length > 0) {
    params.set('platforms', selectedPlatforms.join(','));
  }
  if (selectedDivisions.length > 0 && !selectedDivisions.includes('All')) {
    params.set('divisions', selectedDivisions.join(','));
  }

  const downloadUrl = `/api/contests/calendar.ics?${params.toString()}`;
  window.open(downloadUrl, '_blank');
}
