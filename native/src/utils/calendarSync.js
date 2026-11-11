import { Linking, Share, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';

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
    `Contest: ${contest.title}\nPlatform: ${contest.platformName}\nDivisions: ${contest.divisions?.join(', ') || 'All'}\nLink: ${contest.url}`
  );
  const location = encodeURIComponent(contest.url);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

/**
 * Opens Google Calendar directly on device
 */
export async function openGoogleCalendar(contest) {
  try {
    const url = createGoogleCalendarUrl(contest);
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Unable to open calendar', 'Cannot open Google Calendar URL on this device.');
    }
  } catch (err) {
    console.error('Error opening calendar:', err);
    Alert.alert('Error', 'Failed to open calendar link.');
  }
}

/**
 * Opens Contest Arena / Website in external browser
 */
export async function openContestArena(url) {
  try {
    if (!url) return;
    await Linking.openURL(url);
  } catch (err) {
    console.error('Error opening arena URL:', err);
    Alert.alert('Error', 'Could not open contest link.');
  }
}

/**
 * Native mobile sharing dialog
 */
export async function shareContest(contest) {
  try {
    const message = `Check out this upcoming contest: ${contest.title} on ${contest.platformName}!\n${contest.url}`;
    await Share.share({
      title: `[${contest.platformName}] ${contest.title}`,
      message,
      url: Platform.OS === 'ios' ? contest.url : undefined
    });
  } catch (err) {
    console.error('Error sharing contest:', err);
  }
}

/**
 * Copy contest URL to clipboard
 */
export async function copyContestLink(contest) {
  try {
    await Clipboard.setStringAsync(contest.url);
    return true;
  } catch (err) {
    console.error('Error copying to clipboard:', err);
    return false;
  }
}

