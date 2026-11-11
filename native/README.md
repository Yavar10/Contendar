# 📱 CONTENDAR Mobile — React Native (Expo)

A high-performance competitive programming radar mobile app built with **React Native + Expo SDK 58**, mirroring the **Swiss Typography Maximalist / Cyberpunk Obsidian** aesthetic of the CONTENDAR web interface.

Tracks contests across **Codeforces**, **LeetCode**, **CodeChef**, and **AtCoder**, with real-time countdowns, dual view modes, live telemetry, and calendar sync.

---

## ⚡ Features

- **Dual View Modes**:
  - **Timeline List View**: Organized chronologically into *Happening Right Now*, *Today*, *Tomorrow*, *This Week*, and *Later*.
  - **Monthly Calendar Grid**: Full month matrix with live day highlights, contest count pills, platform indicator dots, and interactive day inspection drawer.
- **Real-Time Telemetry & Timers**:
  - Live status indicator with active contest counters.
  - Sub-second countdown timers and animated progress bars for ongoing rounds.
- **Platform Selector**: Branded toggle pills with contest counters for Codeforces, LeetCode, CodeChef, and AtCoder.
- **Division & Tag Filters**: Quick filtering by `Div. 1`, `Div. 2`, `Div. 3`, `Div. 4`, `Educational`, `Global`, `Weekly`, `Biweekly`, and `Starters`.
- **Search & Quick Filters**: Instant multi-attribute search across round titles, platforms, and divisions.
- **Multi-Timezone Support**: Switch between Local Time, UTC, IST (+5:30), EST, PST, GMT, and JST on the fly.
- **Mobile Actions & Calendar Sync**:
  - 1-click **Add to Google Calendar**
  - Direct **Open Arena** in mobile browser
  - Native **Share** dialog (WhatsApp, Telegram, Slack, etc.)
  - Copy contest link to clipboard
- **Offline & Fallback Resilience**:
  - Built-in verified offline demo data if the backend is not running or unreachable.
  - Server URL configuration modal with quick presets (`10.0.2.2:5000` for Android emulator, `localhost:5000` for iOS simulator, or custom LAN IP) and connection testing.
- **Pull-to-Refresh**: Seamless pull-to-refresh to fetch verified rounds.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd native
npm install
```

### 2. Start Expo Development Server
```bash
npm start
```

### 3. Run on Target Platform
- **Android Emulator / Device**:
  ```bash
  npm run android
  ```
- **iOS Simulator / Device** (macOS required for simulator):
  ```bash
  npm run ios
  ```
- **Expo Go App**: Scan the QR code in the terminal using the Expo Go mobile app (iOS Camera or Android Expo Go).

---

## 🌐 Automatic Backend Detection in Expo

The mobile app automatically connects to the Express backend running on your development machine:

1. **Auto-Discovery via Expo**:
   - The app uses `expo-constants` to detect your computer's LAN IP address from the Expo packager host (e.g. `192.168.1.X:5000`).
   - When running on a physical phone via **Expo Go**, it connects automatically with **zero configuration**!
   - On Android emulator, it falls back to `10.0.2.2:5000`. On iOS simulator/web, it connects to `localhost:5000`.
2. **Offline Resilience**:
   - If the backend is unreachable or offline, the app seamlessly provides verified contest demo data without blocking the screen.
3. **Manual Overrides**:
   - Tap the **Settings icon** (top-right of header) to test connection, switch timezones, or manually configure server host URL.

---

## 📁 Project Structure

```
native/
├── src/
│   ├── components/
│   │   ├── ActiveFiltersRow.jsx     # Dismissible chips for active search/division filters
│   │   ├── CalendarView.jsx         # Interactive monthly calendar matrix & day cells
│   │   ├── ContestCard.jsx          # Streamlined contest card with live status & quick actions
│   │   ├── ContestModal.jsx         # Deep-dive contest details modal bottom sheet
│   │   ├── DayDetailModal.jsx       # Day inspector modal for scheduled rounds
│   │   ├── FilterModal.jsx          # Bottom sheet for status, divisions, and platforms
│   │   ├── Header.jsx               # Minimalist header with brand, live badge & action triggers
│   │   ├── ListView.jsx             # Categorized timeline (Live, Today, Tomorrow, etc.)
│   │   ├── PlatformChips.jsx        # Single-row horizontal swipeable platform chips
│   │   ├── PlatformIcons.jsx        # SVG logos for Codeforces, LeetCode, CodeChef, AtCoder
│   │   ├── SearchBar.jsx            # Expandable search bar
│   │   ├── SettingsModal.jsx        # Consolidated settings (Timezone, API URL, Sync)
│   │   ├── TelemetryTicker.jsx      # Micro-metrics telemetry row
│   │   └── ViewSwitcher.jsx         # Segmented switch (Timeline vs Calendar)
│   ├── constants/
│   │   └── theme.js                 # Obsidian dark theme colors, spacing, and shadows
│   ├── services/
│   │   └── api.js                   # Headless API client with auto-detection & offline fallback
│   └── utils/
│       ├── calendarSync.js          # Google Calendar, deep linking, sharing, and clipboard
│       └── timeUtils.js             # Countdowns, formatters, matrix generator & timezone math
├── App.js                           # Root component with central timer & filter coordinator
├── app.json                         # Expo configuration (name, orientation, theme)
└── package.json
```
│   └── utils/
│       ├── calendarSync.js          # Google Calendar, deep linking, sharing, and clipboard
│       └── timeUtils.js             # Countdowns, formatters, matrix generator & timezone math
├── App.js                           # Root component coordinating state, filters & refresh
├── app.json                         # Expo configuration (name, orientation, theme)
└── package.json
```

