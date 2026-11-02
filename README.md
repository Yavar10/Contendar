# ContestPulse — Competitive Programming Calendar & Live Tracker

A modern competitive programming calendar and tracker for **LeetCode**, **Codeforces**, **CodeChef**, and expandable platform providers (e.g. **AtCoder**).

Built using **JavaScript**, featuring an **Express.js** backend with an extensible adapter architecture and a **React 19 + Vite** web frontend.

---

## ⚡ Key Features

- **Live & Upcoming Contests**: Real-time aggregation of active and upcoming contests with live countdowns.
- **Dual View Modes**:
  - **Calendar View**: Interactive month grid with color-coded contest badges, navigation, and day inspection drawers.
  - **List View**: Grouped timeline (`Happening Right Now`, `Today`, `Tomorrow`, `This Week`, `Later`).
- **Platform Selector**: Toggle between LeetCode, Codeforces, CodeChef, and AtCoder with platform-specific branding and contest counters.
- **Division & Round Filtering**: Filter specifically for `Div. 1`, `Div. 2`, `Div. 3`, `Div. 4`, `Educational`, `Global`, `Weekly`, `Biweekly`, `Starters`, or `All`.
- **Search & Quick Filters**: Instant search across titles, platforms, and division tags.
- **Timezone Support**: Switch between Local Time, UTC, IST (+5:30), EST, PST, GMT, and JST.
- **Calendar Integrations**:
  - 1-click **Add to Google Calendar**
  - Download standard **.ics** files for Apple Calendar & Outlook
  - Export filtered calendar feed via `/api/contests/calendar.ics`
- **Expandable Platform Architecture**: Add any new platform (e.g., HackerRank, GeeksforGeeks, Kaggle) in just one class file.

---

## 🏗️ Architecture

```
ContestCalender/
├── backend/
│   ├── src/
│   │   ├── server.js                  # Express server entry point (port 5000)
│   │   ├── routes/
│   │   │   └── contests.js            # /api/contests, /api/platforms, /api/contests/calendar.ics
│   │   ├── services/
│   │   │   ├── CacheService.js        # In-memory TTL cache with fallback resilience
│   │   │   ├── PlatformRegistry.js    # Dynamic platform registry
│   │   │   └── platforms/
│   │   │       ├── BasePlatform.js    # Standard platform adapter blueprint
│   │   │       ├── CodeforcesPlatform.js
│   │   │       ├── LeetCodePlatform.js
│   │   │       ├── CodeChefPlatform.js
│   │   │       └── AtCoderPlatform.js
│   │   └── utils/
│   │       └── icsGenerator.js        # iCalendar (.ics) RFC 5545 generator
│   └── package.json
│
├── frontendweb/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Top bar, timezone, live pulse, .ics sync
│   │   │   ├── StatsRibbon.jsx        # Real-time metrics ribbon
│   │   │   ├── FilterBar.jsx          # Platform selector, division chips, search, view switcher
│   │   │   ├── ListView.jsx           # Timeline-based contest list
│   │   │   ├── ContestCard.jsx        # Individual card with live timer and actions
│   │   │   ├── CalendarView.jsx       # Interactive monthly calendar grid
│   │   │   ├── ContestModal.jsx       # Full contest details modal
│   │   │   └── DayDetailModal.jsx     # Day inspection drawer for calendar view
│   │   ├── services/
│   │   │   └── api.js                 # API client with fallback support
│   │   ├── utils/
│   │   │   ├── timeUtils.js           # Countdowns, date formatting, calendar matrix
│   │   │   └── calendarSync.js        # Google Calendar & ICS export helpers
│   │   ├── styles/
│   │   │   └── components.css         # Cyberpunk/obsidian glassmorphic styling
│   │   ├── App.jsx                    # Root state & filter coordinator
│   │   ├── index.css                  # Global tokens & theme variables
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js                 # Configured with proxy to backend port 5000
│
└── native/                            # Reserved for React Native conversion
```

---

## 🚀 How to Run

### 1. Start the Backend (Express.js)
```bash
cd backend
npm install
npm run dev
# Server runs at http://localhost:5000
```

### 2. Start the Frontend (React + Vite)
```bash
cd frontendweb
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🔌 How to Add a New Platform (Expandability)

To add any new platform (for example, HackerRank or TopCoder):

1. Create `backend/src/services/platforms/YourPlatform.js`:
```javascript
import { BasePlatform } from './BasePlatform.js';

export class YourPlatform extends BasePlatform {
  constructor() {
    super({
      id: 'yourplatform',
      name: 'YourPlatform',
      color: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      website: 'https://example.com/contests',
      availableDivisions: ['All', 'Div. 1', 'Div. 2']
    });
  }

  async fetchContests() {
    // 1. Fetch raw contests from API
    // 2. Return this.createContest({ id, title, url, startTimeMs, durationSeconds, divisions })
  }
}
```

2. Register it in `backend/src/services/PlatformRegistry.js`:
```javascript
import { YourPlatform } from './platforms/YourPlatform.js';
platformRegistry.register(new YourPlatform());
```

The frontend will automatically discover it via `/api/platforms`, display its branded toggle chip, and filter its contests!

---

## 📱 Preparing for React Native Conversion

When you are ready to convert to React Native:
- `backend/` remains completely unchanged as the headless contest API.
- All core logic in `frontendweb/src/utils/timeUtils.js` (countdowns, formatting, grouping) and `frontendweb/src/services/api.js` can be reused directly in React Native without modification.
- UI elements can easily map to React Native components (`View`, `Text`, `TouchableOpacity`, `FlatList` / `ScrollView`, `Modal`).
