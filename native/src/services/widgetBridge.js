import { Platform } from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import { reloadAllTimelines } from '../../modules/widget-bridge';
import { isSameDay } from '../utils/timeUtils';

export const APP_GROUP_ID = 'group.com.contendar.app';
export const WIDGET_DATA_KEY = 'contendar_widget_data';

/**
 * Serializes contest feeds and updates the shared App Group storage,
 * then triggers a native timeline reload on iOS and Android widgets.
 */
export async function syncContestsToWidget(contests = [], timezone = 'local') {
  if (!Array.isArray(contests) || contests.length === 0) {
    return;
  }

  try {
    const now = Date.now();
    const liveRound = contests.find((c) => c.status === 'LIVE') || null;
    const upcomingList = contests
      .filter((c) => c.status === 'UPCOMING')
      .sort((a, b) => a.startTimeMs - b.startTimeMs);
    const nextUpcoming = upcomingList[0] || null;

    // Filter today's contests
    const today = new Date();
    const todayContests = contests
      .filter((c) => isSameDay(c.startTimeMs, today))
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        title: c.title,
        platform: c.platform,
        platformName: c.platformName,
        platformColor: c.platformColor || '#0A84FF',
        startTimeMs: c.startTimeMs,
        durationSeconds: c.durationSeconds,
        status: c.status
      }));

    // Build calendar dots map: "YYYY-MM-DD" -> ["#3B82F6", "#F59E0B"]
    const calendarDots = {};
    contests.forEach((c) => {
      const d = new Date(c.startTimeMs);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      if (!calendarDots[dateKey]) {
        calendarDots[dateKey] = [];
      }

      const color = c.status === 'LIVE' ? '#FF453A' : (c.platformColor || '#0A84FF');
      if (!calendarDots[dateKey].includes(color) && calendarDots[dateKey].length < 3) {
        calendarDots[dateKey].push(color);
      }
    });

    const payload = {
      updatedAtMs: now,
      timezone: timezone || 'local',
      activeLiveRound: liveRound
        ? {
            id: liveRound.id,
            title: liveRound.title,
            platform: liveRound.platform,
            platformName: liveRound.platformName,
            platformColor: liveRound.platformColor || '#3B82F6',
            startTimeMs: liveRound.startTimeMs,
            endTimeMs: liveRound.endTimeMs,
            durationSeconds: liveRound.durationSeconds,
            url: liveRound.url
          }
        : null,
      nextUpcomingRound: nextUpcoming
        ? {
            id: nextUpcoming.id,
            title: nextUpcoming.title,
            platform: nextUpcoming.platform,
            platformName: nextUpcoming.platformName,
            platformColor: nextUpcoming.platformColor || '#0A84FF',
            startTimeMs: nextUpcoming.startTimeMs,
            endTimeMs: nextUpcoming.endTimeMs,
            durationSeconds: nextUpcoming.durationSeconds,
            url: nextUpcoming.url
          }
        : null,
      todayContests,
      calendarDots
    };

    // 1. Write payload to native shared storage
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        await SharedGroupPreferences.setItem(WIDGET_DATA_KEY, payload, APP_GROUP_ID);
      } catch (storageErr) {
        // SharedGroupPreferences throws in Expo Go if App Group is not provisioned yet
        console.log('SharedGroupPreferences note (expected in dev/simulator before prebuild):', storageErr.message || storageErr);
      }
    }

    // 2. Notify native widget timelines to reload
    reloadAllTimelines();
  } catch (err) {
    console.warn('Could not sync contests to widget:', err);
  }
}

