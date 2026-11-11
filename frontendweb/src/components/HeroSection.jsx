import React, { useState, useEffect, useMemo } from 'react';
import {
  Timer,
  ExternalLink,
  Calendar,
  Sparkles,
  Zap,
  Radio,
  ChevronRight,
  Clock
} from 'lucide-react';
import { PlatformIcon } from './PlatformIcons';
import { formatDateTime, formatDuration, getCountdown } from '../utils/timeUtils';
import { createGoogleCalendarUrl } from '../utils/calendarSync';

export function HeroSection({
  contests,
  platforms,
  timezone,
  onSelectContest,
  onOpenSettings
}) {
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Find live and upcoming
  const liveContests = useMemo(() => {
    return contests.filter((c) => c.status === 'LIVE');
  }, [contests]);

  const upcomingContests = useMemo(() => {
    return contests
      .filter((c) => c.status === 'UPCOMING')
      .sort((a, b) => a.startTimeMs - b.startTimeMs);
  }, [contests]);

  // Featured contest: active live contest or immediate next upcoming contest
  const featuredContest = liveContests[0] || upcomingContests[0];
  const isLive = featuredContest?.status === 'LIVE';

  const countdown = featuredContest
    ? getCountdown(
        featuredContest.startTimeMs,
        featuredContest.status,
        nowMs,
        featuredContest.startTimeMs,
        featuredContest.endTimeMs
      )
    : null;

  // Formatted date kicker (e.g., WEDNESDAY, NOVEMBER 11)
  const todayKicker = useMemo(() => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    if (timezone !== 'local') options.timeZone = timezone;
    return new Intl.DateTimeFormat(undefined, options).format(new Date(nowMs)).toUpperCase();
  }, [nowMs, timezone]);

  return (
    <div className="slight-hero-container">
      {/* Ambient Apple Glow */}
      <div className="hero-ambient-glow" />

      <div className="slight-hero-content">
        {/* Left Column: Editorial Headline & Live Context */}
        <div className="slight-hero-left">
          <div className="hero-badge-pill">
            <span className="live-pulse-dot-sm" />
            <span className="hero-badge-text">PRECISION CHRONO RADAR</span>
            <span className="hero-badge-kicker">{todayKicker}</span>
          </div>

          <h1 className="slight-hero-title">
            Never miss a <span className="title-gradient">contest</span>.
          </h1>

          <p className="slight-hero-sub">
            Real-time radar tracking verified rounds across{' '}
            <strong style={{ color: 'var(--text-primary)' }}>Codeforces</strong>,{' '}
            <strong style={{ color: 'var(--text-primary)' }}>LeetCode</strong>,{' '}
            <strong style={{ color: 'var(--text-primary)' }}>CodeChef</strong>, and{' '}
            <strong style={{ color: 'var(--text-primary)' }}>AtCoder</strong> with division filters &amp; one-click calendar sync.
          </p>

          {/* Quick Metrics Glance */}
          <div className="slight-hero-metrics">
            <div className="metric-pill">
              <span className="metric-num">{liveContests.length}</span>
              <span className="metric-label">Live Now</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-pill">
              <span className="metric-num">{contests.length}</span>
              <span className="metric-label">Scheduled</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-pill">
              <span className="metric-num">{platforms.length || 4}</span>
              <span className="metric-label">Platforms</span>
            </div>
          </div>
        </div>

        {/* Right Column: Apple Chrono Radar Graphic & Spotlight Capsule */}
        <div className="slight-hero-right">
          {/* Animated Chrono Radar Graphic */}
          <div className="chrono-radar-visual" title="Live Contendar Chrono Radar">
            <svg viewBox="0 0 200 200" className="radar-svg">
              {/* Outer Sonar Ring */}
              <circle cx="100" cy="100" r="92" className="radar-ring ring-outer" />
              {/* Mid Sonar Ring */}
              <circle cx="100" cy="100" r="66" className="radar-ring ring-mid" />
              {/* Inner Sonar Ring */}
              <circle cx="100" cy="100" r="40" className="radar-ring ring-inner" />

              {/* Crosshair Axes */}
              <line x1="100" y1="8" x2="100" y2="192" className="radar-axis" />
              <line x1="8" y1="100" x2="192" y2="100" className="radar-axis" />

              {/* Sweeping Radar Beam */}
              <g className="radar-sweeper-group">
                <path
                  d="M100,100 L100,8 A92,92 0 0,1 185,145 Z"
                  className="radar-sweep-cone"
                />
                <line x1="100" y1="100" x2="100" y2="8" className="radar-sweep-needle" />
              </g>

              {/* Glowing Center Core */}
              <circle cx="100" cy="100" r="7" className="radar-core-glow" />
              <circle cx="100" cy="100" r="4" className="radar-core-center" />

              {/* Orbiting Platform Blips */}
              {/* Codeforces */}
              <g transform="translate(142, 54)" className="platform-blip blip-cf">
                <circle cx="0" cy="0" r="7" fill="rgba(59, 130, 246, 0.25)" />
                <circle cx="0" cy="0" r="4" fill="#3b82f6" />
              </g>
              {/* LeetCode */}
              <g transform="translate(56, 142)" className="platform-blip blip-lc">
                <circle cx="0" cy="0" r="7" fill="rgba(245, 158, 11, 0.25)" />
                <circle cx="0" cy="0" r="4" fill="#f59e0b" />
              </g>
              {/* CodeChef */}
              <g transform="translate(150, 138)" className="platform-blip blip-cc">
                <circle cx="0" cy="0" r="7" fill="rgba(168, 85, 247, 0.25)" />
                <circle cx="0" cy="0" r="4" fill="#a855f7" />
              </g>
              {/* AtCoder */}
              <g transform="translate(48, 62)" className="platform-blip blip-ac">
                <circle cx="0" cy="0" r="7" fill="rgba(6, 182, 212, 0.25)" />
                <circle cx="0" cy="0" r="4" fill="#06b6d4" />
              </g>
            </svg>
          </div>

          {/* Featured Contest Live Activity Capsule */}
          {featuredContest && (
            <div
              className={`hero-spotlight-capsule ${isLive ? 'is-live-capsule' : ''}`}
              onClick={() => onSelectContest(featuredContest)}
            >
              <div className="capsule-header">
                <div className="capsule-platform">
                  <PlatformIcon platform={featuredContest.platform} size={15} />
                  <span className="capsule-platform-name">{featuredContest.platformName}</span>
                </div>

                {isLive ? (
                  <span className="capsule-live-tag">
                    <span className="live-pulse-dot-sm" />
                    Live Battle
                  </span>
                ) : (
                  <span className="capsule-timer mono">
                    <Timer size={12} />
                    {countdown?.label || 'Upcoming'}
                  </span>
                )}
              </div>

              <div className="capsule-title" title={featuredContest.title}>
                {featuredContest.title}
              </div>

              <div className="capsule-footer">
                <span className="capsule-time mono">
                  {formatDateTime(featuredContest.startTimeMs, timezone)}
                </span>
                <span className="capsule-enter-btn">
                  <span>{isLive ? 'Enter' : 'View'}</span>
                  <ChevronRight size={13} />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
