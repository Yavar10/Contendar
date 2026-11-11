import { requireNativeModule, Platform } from 'expo-modules-core';

let WidgetBridge = null;
try {
  WidgetBridge = requireNativeModule('WidgetBridge');
} catch (e) {
  // Graceful fallback when running in Expo Go or web
  WidgetBridge = {
    reloadAllTimelines() {
      // no-op in unbuilt environment
    }
  };
}

export function reloadAllTimelines() {
  if (WidgetBridge && typeof WidgetBridge.reloadAllTimelines === 'function') {
    try {
      WidgetBridge.reloadAllTimelines();
    } catch (e) {
      console.warn('Could not reload widget timelines:', e);
    }
  }
}

export default {
  reloadAllTimelines
};

