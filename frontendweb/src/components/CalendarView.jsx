import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import {
  generateMonthCalendar,
  isSameDay,
  formatTimeCompact,
  getSmartContestTitle,
  formatTimeOnly
} from '../utils/timeUtils';
import { PlatformIcon } from './PlatformIcons';

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
    <div className="calendar-panel">
      {/* Month Navigation Header */}
      <div className="calendar-top-bar">
        <div className="calendar-month-group">
          <h2 className="calendar-title">
            {MONTH_NAMES[month]} <span className="calendar-year">{year}</span>
          </h2>

          <div className="calendar-nav-btns">
            <button
              className="calendar-nav-btn"
              onClick={handlePrevMonth}
              title="Previous Month"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="calendar-nav-btn"
              onClick={handleNextMonth}
              title="Next Month"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <button className="today-jump-btn" onClick={handleToday}>
          <CalendarIcon size={13} />
          <span>Today</span>
        </button>
      </div>

      {/* Weekday Row */}
      <div className="calendar-weekdays-row">
        {WEEKDAYS.map((day) => (
          <div key={day} className="weekday-cell">
            {day}
          </div>
        ))}
      </div>

      {/* Uniform Days Grid */}
      <div className="calendar-matrix">
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
              className={`calendar-day-tile ${
                !dayItem.isCurrentMonth ? 'is-muted-day' : ''
              } ${isToday ? 'is-today-tile' : ''} ${hasContests ? 'has-events' : ''}`}
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
              <div className="day-tile-header">
                <span className={`day-number ${isToday ? 'today-circle' : ''}`}>
                  {dayItem.dayNumber}
                </span>

                {hasContests && (
                  <span className="day-events-pill">
                    {dayContests.length}
                  </span>
                )}
              </div>

              {/* Day Events Stack */}
              <div className="day-events-stack">
                {displayContests.map((c) => {
                  const smartTitle = getSmartContestTitle(c.title, c.platform);
                  const timeStr = formatTimeCompact(c.startTimeMs, timezone);
                  const isLive = c.status === 'LIVE';

                  return (
                    <div
                      key={c.id}
                      className={`calendar-event-item ${isLive ? 'is-live-event' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectContest(c);
                      }}
                      title={`${c.platformName}: ${c.title}\nStarts: ${formatTimeOnly(
                        c.startTimeMs,
                        timezone
                      )}\nDuration: ${Math.round(c.durationSeconds / 60)}m`}
                    >
                      <PlatformIcon platform={c.platform} size={11} className="event-icon" />
                      <span className="event-time mono">{timeStr}</span>
                      <span className="event-title">{smartTitle}</span>
                      {isLive && <span className="event-live-indicator" />}
                    </div>
                  );
                })}

                {/* More events link */}
                {remainingCount > 0 && (
                  <button
                    className="more-events-tag"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDay({ date: dayItem.date, contests: dayContests });
                    }}
                    title={`View all ${dayContests.length} contests on this date`}
                  >
                    +{remainingCount} more
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
