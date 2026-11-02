import express from 'express';
import { platformRegistry } from '../services/PlatformRegistry.js';
import { generateIcsCalendar } from '../utils/icsGenerator.js';

const router = express.Router();

/**
 * GET /api/platforms
 * Returns all registered platforms and their available divisions.
 */
router.get('/platforms', (req, res) => {
  try {
    const platforms = platformRegistry.getPlatformsMetadata();
    res.json({
      success: true,
      data: platforms
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/contests
 * Query params:
 *   - platforms: comma-separated list of platform IDs (e.g. "codeforces,leetcode,codechef")
 *   - divisions: comma-separated list of division filters (e.g. "Div. 2,Weekly")
 *   - status: "all" | "live" | "upcoming"
 *   - search: string keyword
 *   - from: ISO date string or timestamp
 *   - to: ISO date string or timestamp
 */
router.get('/contests', async (req, res) => {
  try {
    const platforms = req.query.platforms
      ? req.query.platforms.split(',').map((p) => p.trim()).filter(Boolean)
      : [];

    const divisions = req.query.divisions
      ? req.query.divisions.split(',').map((d) => d.trim()).filter(Boolean)
      : [];

    const status = req.query.status || 'all';
    const search = req.query.search || '';
    const from = req.query.from || null;
    const to = req.query.to || null;

    const contests = await platformRegistry.getContests({
      platforms,
      divisions,
      status,
      search,
      from,
      to
    });

    res.json({
      success: true,
      count: contests.length,
      data: contests,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error fetching contests:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/contests/calendar.ics
 * Export filtered contests to standard iCalendar (.ics) format
 */
router.get('/contests/calendar.ics', async (req, res) => {
  try {
    const platforms = req.query.platforms
      ? req.query.platforms.split(',').map((p) => p.trim()).filter(Boolean)
      : [];
    const divisions = req.query.divisions
      ? req.query.divisions.split(',').map((d) => d.trim()).filter(Boolean)
      : [];

    const contests = await platformRegistry.getContests({
      platforms,
      divisions,
      status: 'all'
    });

    const icsString = generateIcsCalendar(contests);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="contest-calendar.ics"');
    res.send(icsString);
  } catch (err) {
    res.status(500).send(`Error generating ICS calendar: ${err.message}`);
  }
});

export default router;
