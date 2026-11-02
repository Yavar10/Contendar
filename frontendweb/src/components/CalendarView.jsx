import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import {
  generateMonthCalendar,
  isSameDay,
  formatTimeCompact,
  getSmartContestTitle,
  formatTimeOnly
} from '../utils/timeUtils';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView({
  contests,
  timezone,
  onSelectContest,
  onSelectDay
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const days = generateMonthCalendar(year, month);
  const today = new Date();

  return (
    <div className="glass-panel calendar-wrapper">
      {/* Month Navigation & Platform Legend Header */}
      <div className="calendar-header">
        <div className="month-nav">
          <div className="month-nav-title-group">
            <h2 className="month-title">
              {MONTH_NAMES[month]} <span className="month-year-badge">{year}</span>
            </h2>
          </div>

          <div className="month-nav-controls">
            <button
              className="btn-icon month-nav-btn"
              onClick={handlePrevMonth}
              title="Previous Month"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="btn-icon month-nav-btn"
              onClick={handleNextMonth}
              title="Next Month"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Right side controls: Today shortcut */}
        <div className="calendar-header-actions">
          <button className="btn btn-secondary today-btn" onClick={handleToday}>
            <CalendarIcon size={14} />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="calendar-grid weekdays-row">
        {WEEKDAYS.map((day) => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      {/* 35/42 Days Uniform Grid */}
      <div className="calendar-grid calendar-days-grid">
        {days.map((dayItem, index) => {
          const isToday = isSameDay(dayItem.date, today);

          // Contests starting on this day
          const dayContests = contests.filter((c) =>
            isSameDay(c.startTimeMs, dayItem.date)
          );

          const hasContests = dayContests.length > 0;
          const displayContests = dayContests.slice(0, 2);
          const remainingCount = dayContests.length - 2;

          return (
            <div
              key={index}
              className={`calendar-day-cell ${
                !dayItem.isCurrentMonth ? 'other-month' : ''
              } ${isToday ? 'is-today' : ''} ${hasContests ? 'has-contests' : ''}`}
              onClick={() => {
                if (hasContests) {
                  onSelectDay({ date: dayItem.date, contests: dayContests });
                }
              }}
              title={
                hasContests
                  ? `${dayContests.length} contest(s) on ${dayItem.date.toDateString()}`
                  : ''
              }
            >
              {/* Day Header */}
              <div className="day-header">
                <span className={`day-num ${isToday ? 'day-num-today' : ''}`}>
                  {dayItem.dayNumber}
                </span>

                {hasContests && (
                  <span className="day-contest-count-badge">
                    {dayContests.length}
                  </span>
                )}
              </div>

              {/* Contests List (Strictly Constrained, No Distortion) */}
              <div className="cell-contests-list">
                {displayContests.map((c) => {
                  const smartTitle = getSmartContestTitle(c.title, c.platform);
                  const timeStr = formatTimeCompact(c.startTimeMs, timezone);
                  const isLive = c.status === 'LIVE';

                  return (
                    <div
                      key={c.id}
                      className={`calendar-pill ${isLive ? 'calendar-pill-live' : ''}`}
                      style={{
                        '--pill-platform-color': c.platformColor || '#6366f1',
                        borderLeftColor: c.platformColor || '#6366f1'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectContest(c);
                      }}
                      title={`${c.platformName}: ${c.title}\nTime: ${formatTimeOnly(
                        c.startTimeMs,
                        timezone
                      )}\nDuration: ${Math.round(c.durationSeconds / 60)} mins\nStatus: ${c.status}`}
                    >
                      {/* Monospace time badge */}
                      <span className="pill-time mono">{timeStr}</span>

                      {/* Smart short title with strict overflow hidden */}
                      <span className="pill-title">{smartTitle}</span>

                      {/* Live pulse dot if ongoing */}
                      {isLive && <span className="pill-live-dot" />}
                    </div>
                  );
                })}

                {/* Overflow +X more pill */}
                {remainingCount > 0 && (
                  <button
                    className="more-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDay({ date: dayItem.date, contests: dayContests });
                    }}
                    title={`View all ${dayContests.length} contests on this date`}
                  >
                    <span>+{remainingCount} more</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
