import express from 'express';
import cors from 'cors';
import contestsRouter from './routes/contests.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// API Routes
app.use('/api', contestsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    name: 'ContestPulse API',
    description: 'Competitive programming contest calendar API supporting LeetCode, Codeforces, CodeChef, and expandable platforms.',
    endpoints: {
      platforms: '/api/platforms',
      contests: '/api/contests',
      calendarIcs: '/api/contests/calendar.ics',
      health: '/api/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ContestPulse Backend server is running at http://localhost:${PORT}`);
});
