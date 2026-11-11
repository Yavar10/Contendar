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

## 🌐 Connecting to the Backend

The mobile app connects to the Express backend running in `../backend/`:

1. Start the backend:
   ```bash
   cd ../backend
   npm run dev
   ```
2. In the mobile app:
   - Tap the **server status icon** (top-right of the header) to open **Backend API Settings**.
   - Select a quick preset:
     - **Android Emulator**: `http://10.0.2.2:5000`
     - **iOS Simulator**: `http://localhost:5000`
     - **Physical Device**: Enter your machine's local network IP (e.g., `http://192.168.1.50:5000`)
   - Tap **Test Connection** to verify `/api/health`.
   - Tap **Save & Apply** to sync live contests!

---

## 📁 Project Structure

```
native/
├── src/
│   ├── components/
│   │   ├── ApiBanner.jsx            # Offline / demo mode notification banner
│   │   ├── CalendarView.jsx         # Interactive monthly calendar matrix & day cells
│   │   ├── ContestCard.jsx          # Contest card with live countdown & action buttons
│   │   ├── ContestModal.jsx         # Deep-dive contest details modal bottom sheet
│   │   ├── DayDetailModal.jsx       # Day inspector modal for scheduled rounds
│   │   ├── FilterBar.jsx            # Search, view switcher, platform & division chips
│   │   ├── Header.jsx               # Brand header, live pulse, timezone & server trigger
│   │   ├── ListView.jsx             # Categorized timeline (Live, Today, Tomorrow, etc.)
│   │   ├── PlatformIcons.jsx        # SVG logos for Codeforces, LeetCode, CodeChef, AtCoder
│   │   ├── ServerConfigModal.jsx    # Backend URL configuration & connectivity tester
│   │   ├── StatsRibbon.jsx          # Live metrics cards (Live, Upcoming, Platforms, Total)
│   │   └── TimezoneModal.jsx        # Modal to switch between global timezones
│   ├── constants/
│   │   └── theme.js                 # Obsidian dark theme colors, spacing, and shadows
│   ├── services/
│   │   └── api.js                   # Headless API client with timeout & offline fallback
│   └── utils/
│       ├── calendarSync.js          # Google Calendar, deep linking, sharing, and clipboard
│       └── timeUtils.js             # Countdowns, formatters, matrix generator & timezone math
├── App.js                           # Root component coordinating state, filters & refresh
├── app.json                         # Expo configuration (name, orientation, theme)
└── package.json
```

