import React from 'react';

export function MarqueeTicker({ liveCount = 0, totalCount = 0 }) {
  const tickerItems = [
    '⚡ CONTENDAR // MISSION CONTROL',
    'RADAR STATUS: ACTIVE',
    `LIVE SESSIONS: [${liveCount} ONGOING]`,
    `SCHEDULED EVENTS: [${totalCount} DETECTED]`,
    'CF / LC / CC / AC FEEDS LINKED',
    'TIMEZONE SYNC: LOCAL + UTC',
    'ICALENDAR (.ICS) COMPATIBLE',
    'STAY RATED // NEVER MISS A CONTEST',
    'DIV.1 • DIV.2 • DIV.3 • WEEKLY • STARTERS • ABC',
  ];

  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
          <span key={index} className="marquee-item mono">
            {item}
            <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
