# ⚡ ContestPulse — Setup & Installation Guide

This guide will walk you through setting up, running, configuring, and extending the **ContestPulse** Competitive Programming Contest Calendar application.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (Run Both Servers)](#quick-start-run-both-servers)
3. [Project Structure](#project-structure)
4. [Backend Setup (Express.js)](#backend-setup-expressjs)
5. [Frontend Setup (React + Vite + Tailwind CSS)](#frontend-setup-react--vite--tailwind-css)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [How to Add a New Platform (Expandability)](#how-to-add-a-new-platform-expandability)
8. [Division Filtering System](#division-filtering-system)
9. [Exporting to Google Calendar & Apple Calendar](#exporting-to-google-calendar--apple-calendar)
10. [Troubleshooting & FAQ](#troubleshooting--faq)
11. [Preparing for React Native](#preparing-for-react-native)

---

## 📌 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (Node 18+ includes native `fetch`)
- **npm**: `v9.0.0` or higher
- **Git** (optional, for version control)

To verify your installation:
```bash
node -v
npm -v
```

---

## 🚀 Quick Start (Run Both Servers)

The project consists of two separate sub-projects: `backend/` and `frontendweb/`.

### Terminal 1: Backend API (Express.js)
```bash
cd backend
npm install
npm run dev
```
> 🌐 Backend runs at: **`http://localhost:5000`**

### Terminal 2: Frontend Web App (React 19 + Vite)
```bash
cd frontendweb
npm install
npm run dev
```
> 🌐 Frontend runs at: **`http://localhost:5173`**

Open **[http://localhost:5173](http://localhost:5173)** in your browser to view the application!

---

## 🗂️ Project Structure

```
ContestCalender/
│
├── backend/                                   # Express.js API Server
│   ├── src/
│   │   ├── server.js                          # Server entry point & CORS configuration
│   │   ├── routes/
│   │   │   └── contests.js                    # API Route Handlers (/api/contests, /api/platforms, etc.)
│   │   ├── services/
│   │   │   ├── CacheService.js                # In-memory TTL cache with fallback resilience
│   │   │   ├── PlatformRegistry.js            # Extensible platform registry
│   │   │   └── platforms/                     # Platform Adapters
│   │   │       ├── BasePlatform.js            # Base class interface
│   │   │       ├── CodeforcesPlatform.js      # Codeforces API + Div 1-4 parser
│   │   │       ├── LeetCodePlatform.js        # LeetCode GraphQL + Weekly/Biweekly parser
│   │   │       ├── CodeChefPlatform.js        # CodeChef API + Div 1-4 / Starters parser
│   │   │       └── AtCoderPlatform.js         # AtCoder adapter
│   │   └── utils/
│   │       └── icsGenerator.js                # Standard iCalendar (.ics) RFC 5545 generator
│   └── package.json
│
├── frontendweb/                               # React 19 + Vite Web Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                     # Top navigation, Timezone picker, Live Pulse, .ics sync
│   │   │   ├── StatsRibbon.jsx                # Metrics (Live, Upcoming, Total, Platforms)
│   │   │   ├── FilterBar.jsx                  # Platform toggles, Division chips, Search, View Switcher
│   │   │   ├── ListView.jsx                   # Timeline grouping (Live, Today, Tomorrow, This Week, Later)
│   │   │   ├── ContestCard.jsx                # Card with live countdown timer and 1-click actions
│   │   │   ├── CalendarView.jsx               # Monthly calendar grid with color-coded pills
│   │   │   ├── ContestModal.jsx               # Deep-dive contest details modal
│   │   │   └── DayDetailModal.jsx             # Day inspector drawer for calendar view
│   │   ├── services/
│   │   │   └── api.js                         # API Client with network fallback
│   │   ├── utils/
│   │   │   ├── timeUtils.js                   # Date formatting, countdowns, timezone math
│   │   │   └── calendarSync.js                # Google Calendar link & .ics export helpers
│   │   ├── styles/
│   │   │   └── components.css                 # Cyberpunk & Obsidian glassmorphism styles
│   │   ├── App.jsx                            # Main App component & filter state
│   │   ├── index.css                          # Tailwind CSS v4 & custom design tokens
│   │   └── main.jsx
│   ├── index.html                             # SEO meta tags & Google fonts
│   ├── vite.config.js                         # Vite setup with Tailwind plugin & API proxy
│   └── package.json
│
├── native/                                    # Target directory for React Native conversion
├── README.md                                  # Repository overview
└── SETUP.md                                   # This setup guide
```

---

## ⚙️ Backend Setup (Express.js)

### Available Scripts
Inside the `backend/` directory:
- `npm run dev`: Runs server with `--watch` mode (automatically reloads on changes).
- `npm start`: Runs server in production mode (`node src/server.js`).

### Port Configuration
By default, the backend listens on port `5000`. You can override this using an environment variable:
```bash
# Windows PowerShell
$env:PORT=5001; npm run dev

# Linux / macOS
PORT=5001 npm run dev
```

---

## 💻 Frontend Setup (React + Vite + Tailwind CSS)

### Available Scripts
Inside the `frontendweb/` directory:
- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Generates an optimized production bundle in `frontendweb/dist/`.
- `npm run preview`: Previews the production build locally.

### Backend Proxy
The frontend's `vite.config.js` is preconfigured to proxy `/api` requests to `http://localhost:5000`. If you change the backend port, update `vite.config.js`:
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5000', // Update here if your backend port changes
      changeOrigin: true
    }
  }
}
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/platforms` | Returns metadata and division options for all active platforms | None |
| `GET` | `/api/contests` | Returns normalized contest listings | `platforms`, `divisions`, `status`, `search`, `from`, `to` |
| `GET` | `/api/contests/calendar.ics` | Exports contests in standard iCalendar (`.ics`) format | `platforms`, `divisions` |
| `GET` | `/api/health` | Health check endpoint returning uptime and status | None |

### Query Examples
- Fetch only Codeforces and LeetCode contests:
  ```
  GET /api/contests?platforms=codeforces,leetcode
  ```
- Fetch Div 2 contests:
  ```
  GET /api/contests?divisions=Div.%202
  ```
- Fetch ongoing (live) contests:
  ```
  GET /api/contests?status=live
  ```

---

## 🔌 How to Add a New Platform (Expandability)

The backend features an extensible **Adapter Architecture**. To add a new platform (e.g., HackerRank, GeeksforGeeks, or Kaggle):

### Step 1: Create the Platform Class
Create a new file in `backend/src/services/platforms/YourPlatform.js`:
```javascript
import { BasePlatform } from './BasePlatform.js';

export class YourPlatform extends BasePlatform {
  constructor() {
    super({
      id: 'yourplatform',                  // Unique slug
      name: 'YourPlatform',                // Display name
      color: '#10b981',                    // Platform brand accent color (hex)
      badgeBg: 'rgba(16, 185, 129, 0.15)',// Chip background color
      website: 'https://example.com/contests',
      availableDivisions: ['All', 'Div. 1', 'Div. 2']
    });
  }

  async fetchContests() {
    // 1. Fetch raw data from public API
    const res = await fetch('https://api.example.com/contests');
    const rawData = await res.json();

    // 2. Map into standardized format using this.createContest()
    return rawData.map(c => this.createContest({
      id: c.id,
      title: c.name,
      url: c.link,
      startTimeMs: new Date(c.startTime).getTime(),
      durationSeconds: c.durationSeconds,
      divisions: ['All'],
      type: 'Contest'
    }));
  }
}
```

### Step 2: Register in `PlatformRegistry.js`
In `backend/src/services/PlatformRegistry.js`:
```javascript
import { YourPlatform } from './platforms/YourPlatform.js';

// Register the new platform
platformRegistry.register(new YourPlatform());
```

**That's it!** The frontend will automatically detect the new platform, display its filter chip with custom brand colors, and include its contests in both Calendar and List views.

---

## 🎯 Division Filtering System

The system parses division tags automatically from platform contest metadata and names:
- **Codeforces**: Detects `Div. 1`, `Div. 2`, `Div. 3`, `Div. 4`, `Educational`, and `Global`.
  *(Contests titled "Div. 1 + Div. 2" are tagged with both, so searching for either division shows the contest!)*
- **CodeChef**: Detects `Starters`, `Div. 1`, `Div. 2`, `Div. 3`, and `Div. 4`.
  *(Starters contests are rated across all four divisions and are tagged accordingly).*
- **LeetCode**: Categorized into `Weekly` and `Biweekly`.

---

## 📅 Exporting to Google Calendar & Apple Calendar

1. **1-Click Google Calendar**: Each contest card and detail modal includes an **"Add to GCal"** button that automatically builds an event link with timings, contest title, and direct URL.
2. **Download .ics**: Click the **".ics"** button on any contest card or detail modal to download a calendar file for Apple Calendar or Microsoft Outlook.
3. **Full Calendar Subscription**: Click **"Sync .ics"** in the top navigation bar to download or subscribe to all filtered contests via `/api/contests/calendar.ics`.

---

## 🔧 Troubleshooting & FAQ

### 1. Port 5000 or 5173 is already in use
- **Backend**: Start with an alternate port:
  ```powershell
  $env:PORT=5005; npm run dev
  ```
  *(Remember to update `vite.config.js` proxy target to match the new port).*
- **Frontend**: Vite will automatically offer the next available port (e.g., `5174`).

### 2. Contests are not loading or showing empty
- Ensure the backend server is running in a terminal.
- Check backend logs: external platform APIs may occasionally experience downtime or rate limiting. The backend includes fallback caching to prevent crashes.

### 3. How do the frontend and native apps handle backend downtime?
- If the backend is unreachable or offline, both the web frontend and React Native apps will explicitly prompt you with a connection error card and banner with instructions to run `cd backend && npm run dev` and a 1-click **Retry Connection** button. No hardcoded or fake data is served.

---

## 📱 React Native Mobile App (Expo)

The mobile application is located in the [`native/`](file:///d:/Projects/ContestCalender/native) folder and built with Expo SDK 58:
1. **Headless Backend**: The Express.js backend serves as a headless API for both the Web and Mobile apps.
2. **Shared Business Logic**: The utilities in [`src/utils/timeUtils.js`](file:///d:/Projects/ContestCalender/native/src/utils/timeUtils.js) (countdowns, formatting, timezone math) and [`src/services/api.js`](file:///d:/Projects/ContestCalender/native/src/services/api.js) power real-time updates and fallback resilience.
3. **How to Run**:
   ```bash
   cd native
   npm install
   npm start
   ```
   - Press `a` to run on Android emulator or connected device.
   - Press `i` to run on iOS simulator (macOS required).
   - Scan the terminal QR code with the **Expo Go** app on your physical device.
