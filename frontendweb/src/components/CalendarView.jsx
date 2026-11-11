import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import {
  generateMonthCalendar,
  isSameDay,
  formatTimeCompact,
  getSmartContestTitle
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
              className={`calendar-day-cell ${
                !dayItem.isCurrentMonth ? 'is-outside-month' : ''
              } ${isToday ? 'is-today-cell' : ''} ${
                hasContests ? 'has-contests' : ''
              }`}
              onClick={() => {
                if (hasContests) {
                  onSelectDay({ date: dayItem.date, contests: dayContests });
                }
              }}
            >
              {/* Day Number Header */}
              <div className="day-header-row">
                <span className={`day-number ${isToday ? 'today-pill' : ''}`}>
                  {dayItem.dayNumber ?? dayItem.day ?? dayItem.date.getDate()}
                </span>

                {hasContests && (
                  <div className="day-platform-dots">
                    {Array.from(new Set(dayContests.map((c) => c.platform)))
                      .slice(0, 4)
                      .map((p) => (
                        <span key={p} className={`platform-dot platform-dot-${p}`} title={p} />
                      ))}
                  </div>
                )}
              </div>

              {/* Event Pills */}
              <div className="day-events-stack">
                {displayContests.map((c) => {
                  const isLive = c.status === 'LIVE';
                  const shortTitle = getSmartContestTitle(c.title, c.platform);

                  return (
                    <div
                      key={c.id}
                      className={`calendar-contest-pill platform-${c.platform} ${
                        isLive ? 'is-live-pill' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectContest(c);
                      }}
                      title={`${c.platformName}: ${c.title}`}
                    >
                      <PlatformIcon platform={c.platform} size={11} />
                      <span className="pill-time mono">
                        {formatTimeCompact(c.startTimeMs, timezone)}
                      </span>
                      <span className="pill-title">{shortTitle}</span>
                    </div>
                  );
                })}

                {remainingCount > 0 && (
                  <div className="more-contests-pill">
                    +{remainingCount} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
