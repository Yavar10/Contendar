import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import {
  generateMonthCalendar,
  isSameDay,
  formatTimeCompact,
  getSmartContestTitle,
  formatTimeOnly
} from '../utils/timeUtils';

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

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
    <div className="swiss-panel calendar-poster-wrapper swiss-crosshair">
      {/* Month Navigation & Controls */}
      <div className="calendar-poster-header">
        <div className="month-nav-group">
          <div className="month-title-wrap">
            <span className="month-sub-index mono">
              <span className="bracket">[</span>MONTH // {month < 9 ? `0${month + 1}` : month + 1}<span className="bracket">]</span>
            </span>
            <h2 className="month-poster-title font-display">
              {MONTH_NAMES[month]} <span className="year-accent mono">//{year}</span>
            </h2>
          </div>

          <div className="month-controls-brutal">
            <button
              className="btn-brutal-nav mono"
              onClick={handlePrevMonth}
              title="Previous Month"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
              <span>PREV</span>
            </button>
            <button
              className="btn-brutal-nav mono"
              onClick={handleNextMonth}
              title="Next Month"
              aria-label="Next month"
            >
              <span>NEXT</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Today shortcut */}
        <div className="calendar-header-actions">
          <button className="btn btn-brutal-today mono" onClick={handleToday}>
            <CalendarIcon size={14} />
            <span>[ JUMP TO TODAY ]</span>
          </button>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="calendar-grid-uniform weekdays-row-brutal">
        {WEEKDAYS.map((day) => (
          <div key={day} className="weekday-col-header mono font-bold">
            [{day}]
          </div>
        ))}
      </div>

      {/* Uniform Days Grid (No Layout Distortion) */}
      <div className="calendar-grid-uniform calendar-cells-matrix">
        {days.map((dayItem, index) => {
          const isToday = isSameDay(dayItem.date, today);

          const dayContests = contests.filter((c) =>
            isSameDay(c.startTimeMs, dayItem.date)
          );

          const hasContests = dayContests.length > 0;
          const displayContests = dayContests.slice(0, 2);
          const remainingCount = dayContests.length - 2;

          return (
            <div
              key={index}
              className={`calendar-cell-swiss ${
                !dayItem.isCurrentMonth ? 'cell-other-month' : ''
              } ${isToday ? 'cell-is-today' : ''} ${hasContests ? 'cell-has-contests' : ''}`}
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
              {/* Day Cell Header */}
              <div className="cell-header-swiss">
                <span className={`cell-day-num mono font-display ${isToday ? 'cell-num-today' : ''}`}>
                  {dayItem.dayNumber < 10 ? `0${dayItem.dayNumber}` : dayItem.dayNumber}
                </span>

                {hasContests && (
                  <span className="cell-contest-count-badge mono">
                    {dayContests.length < 10 ? `0${dayContests.length}` : dayContests.length}
                  </span>
                )}
              </div>

              {/* Cell Contests Stack */}
              <div className="cell-contests-stack">
                {displayContests.map((c) => {
                  const smartTitle = getSmartContestTitle(c.title, c.platform);
                  const timeStr = formatTimeCompact(c.startTimeMs, timezone);
                  const isLive = c.status === 'LIVE';

                  const platformPrefix = {
                    codeforces: 'CF',
                    leetcode: 'LC',
                    codechef: 'CC',
                    atcoder: 'AC'
                  }[c.platform] || 'CP';

                  return (
                    <div
                      key={c.id}
                      className={`calendar-pill-swiss ${isLive ? 'pill-live-pulse' : ''}`}
                      style={{
                        '--pill-accent': c.platformColor || '#0055ff',
                        borderLeftColor: c.platformColor || '#0055ff'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectContest(c);
                      }}
                      title={`${c.platformName}: ${c.title}\nStarts: ${formatTimeOnly(
                        c.startTimeMs,
                        timezone
                      )}\nDuration: ${Math.round(c.durationSeconds / 60)} mins\nStatus: ${c.status}`}
                    >
                      <span className="pill-platform-tag mono">[{platformPrefix}]</span>
                      <span className="pill-chrono-time mono">{timeStr}</span>
                      <span className="pill-title-text font-display">{smartTitle}</span>
                      {isLive && <span className="pill-live-dot" />}
                    </div>
                  );
                })}

                {/* Overflow +X more pill */}
                {remainingCount > 0 && (
                  <button
                    className="more-pill-brutal mono"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDay({ date: dayItem.date, contests: dayContests });
                    }}
                    title={`View all ${dayContests.length} contests on this date`}
                  >
                    <span>+{remainingCount} MORE</span>
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
