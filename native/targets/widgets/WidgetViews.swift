import SwiftUI
import WidgetKit

// MARK: - 1. Small Widget View (2x2)
public struct SmallWidgetView: View {
    public let entry: ContestEntry

    public var body: some View {
        ZStack {
            Color.black

            let targetContest = entry.payload?.activeLiveRound ?? entry.payload?.nextUpcomingRound
            let isLive = entry.payload?.activeLiveRound != nil

            if let contest = targetContest {
                VStack(alignment: .leading, spacing: 5) {
                    // Top Status Bar
                    HStack {
                        Circle()
                            .fill(isLive ? Color.red : Color.blue)
                            .frame(width: 6, height: 6)

                        Text(isLive ? "LIVE NOW" : "UP NEXT")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(isLive ? .red : .blue)

                        Spacer()

                        Text(Date(), format: .dateTime.day())
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(white: 0.5))
                    }

                    // Contest Title
                    Text(contest.title)
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(2)
                        .padding(.top, 2)

                    Spacer()

                    // Countdown & Platform
                    VStack(alignment: .leading, spacing: 2) {
                        if isLive {
                            Text("In Progress")
                                .font(.system(size: 11, weight: .semibold, design: .monospaced))
                                .foregroundColor(.red)
                        } else {
                            Text(contest.startDate, style: .relative)
                                .font(.system(size: 13, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                        }

                        Text(contest.platformName)
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(Color(hex: contest.platformColor))
                    }
                }
                .padding(14)
            } else {
                VStack(spacing: 8) {
                    Image(systemName: "calendar.badge.clock")
                        .font(.system(size: 24))
                        .foregroundColor(Color(white: 0.4))

                    Text("No Rounds")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(white: 0.7))

                    Text("Radar Scanning")
                        .font(.system(size: 10))
                        .foregroundColor(Color(white: 0.4))
                }
                .padding(14)
            }
        }
        .widgetURL(URL(string: targetContest != nil ? "contendar://contest/\(targetContest!.id)" : "contendar://"))
    }

    private var targetContest: WidgetContest? {
        entry.payload?.activeLiveRound ?? entry.payload?.nextUpcomingRound
    }
}

// MARK: - 2. Medium Widget View (4x2)
public struct MediumWidgetView: View {
    public let entry: ContestEntry

    private let calendar = Calendar.current
    private let weekdays = ["S", "M", "T", "W", "T", "F", "S"]

    public var body: some View {
        ZStack {
            Color.black

            HStack(spacing: 12) {
                // Left Column: 7-Day Mini Calendar Strip
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(Date(), format: .dateTime.month(.wide))
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                        Spacer()
                    }

                    // 7-day row
                    HStack(spacing: 5) {
                        ForEach(currentWeekDates, id: \.self) { date in
                            let isToday = calendar.isDateInToday(date)
                            let dateKey = formatDateKey(date)
                            let dots = entry.payload?.calendarDots[dateKey] ?? []

                            VStack(spacing: 3) {
                                Text(weekdays[calendar.component(.weekday, from: date) - 1])
                                    .font(.system(size: 9, weight: .semibold))
                                    .foregroundColor(Color(white: 0.4))

                                ZStack {
                                    if isToday {
                                        Circle()
                                            .fill(Color.blue)
                                            .frame(width: 22, height: 22)
                                    }

                                    Text("\(calendar.component(.day, from: date))")
                                        .font(.system(size: 11, weight: isToday ? .bold : .medium))
                                        .foregroundColor(isToday ? .white : Color(white: 0.8))
                                }

                                // Micro dots
                                HStack(spacing: 2) {
                                    if !dots.isEmpty {
                                        ForEach(dots.prefix(3), id: \.self) { dotColor in
                                            Circle()
                                                .fill(Color(hex: dotColor))
                                                .frame(width: 3, height: 3)
                                        }
                                    } else {
                                        Spacer().frame(height: 3)
                                    }
                                }
                                .frame(height: 4)
                            }
                        }
                    }
                }
                .frame(maxWidth: .infinity)

                // Divider
                Rectangle()
                    .fill(Color(white: 0.15))
                    .frame(width: 1)
                    .padding(.vertical, 4)

                // Right Column: Next / Live Round Card
                let target = entry.payload?.activeLiveRound ?? entry.payload?.nextUpcomingRound
                let isLive = entry.payload?.activeLiveRound != nil

                VStack(alignment: .leading, spacing: 4) {
                    if let contest = target {
                        HStack {
                            Circle()
                                .fill(isLive ? Color.red : Color.blue)
                                .frame(width: 6, height: 6)

                            Text(isLive ? "LIVE NOW" : "UP NEXT")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(isLive ? .red : .blue)
                            Spacer()
                        }

                        Text(contest.title)
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                            .lineLimit(2)

                        Spacer()

                        if isLive {
                            Text("Active Round")
                                .font(.system(size: 10, weight: .semibold))
                                .foregroundColor(.red)
                        } else {
                            Text(contest.startDate, style: .relative)
                                .font(.system(size: 12, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                        }

                        Text(contest.platformName)
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundColor(Color(hex: contest.platformColor))
                    } else {
                        Spacer()
                        Text("No Upcoming Rounds")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(Color(white: 0.5))
                        Spacer()
                    }
                }
                .frame(width: 124)
            }
            .padding(14)
        }
        .widgetURL(URL(string: targetContest != nil ? "contendar://contest/\(targetContest!.id)" : "contendar://"))
    }

    private var targetContest: WidgetContest? {
        entry.payload?.activeLiveRound ?? entry.payload?.nextUpcomingRound
    }

    private var currentWeekDates: [Date] {
        let today = Date()
        let weekday = calendar.component(.weekday, from: today)
        let sunday = calendar.date(byAdding: .day, value: -(weekday - 1), to: today) ?? today

        return (0..<7).compactMap { calendar.date(byAdding: .day, value: $0, to: sunday) }
    }

    private func formatDateKey(_ date: Date) -> String {
        let y = calendar.component(.year, from: date)
        let m = String(format: "%02d", calendar.component(.month, from: date))
        let d = String(format: "%02d", calendar.component(.day, from: date))
        return "\(y)-\(m)-\(d)"
    }
}

// MARK: - 3. Large Widget View (4x4)
public struct LargeWidgetView: View {
    public let entry: ContestEntry
    private let calendar = Calendar.current
    private let weekdays = ["S", "M", "T", "W", "T", "F", "S"]

    public var body: some View {
        ZStack {
            Color.black

            VStack(alignment: .leading, spacing: 10) {
                // Top Header: Month & Year
                HStack {
                    Text(Date(), format: .dateTime.month(.wide).year())
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.white)
                    Spacer()
                }

                // Weekday Row
                HStack(spacing: 0) {
                    ForEach(weekdays, id: \.self) { w in
                        Text(w)
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundColor(Color(white: 0.4))
                            .frame(maxWidth: .infinity)
                    }
                }

                // Month Calendar Grid (Compact 5-row view)
                let days = monthDays()
                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 2), count: 7), spacing: 4) {
                    ForEach(days, id: \.self) { dayDate in
                        let isToday = calendar.isDateInToday(dayDate)
                        let dateKey = formatDateKey(dayDate)
                        let dots = entry.payload?.calendarDots[dateKey] ?? []

                        VStack(spacing: 2) {
                            ZStack {
                                if isToday {
                                    Circle()
                                        .fill(Color.blue)
                                        .frame(width: 18, height: 18)
                                }

                                Text("\(calendar.component(.day, from: dayDate))")
                                    .font(.system(size: 10, weight: isToday ? .bold : .regular))
                                    .foregroundColor(isToday ? .white : (calendar.isDate(dayDate, equalTo: Date(), toGranularity: .month) ? .white : Color(white: 0.25)))
                            }

                            HStack(spacing: 1.5) {
                                if !dots.isEmpty {
                                    ForEach(dots.prefix(3), id: \.self) { color in
                                        Circle()
                                            .fill(Color(hex: color))
                                            .frame(width: 2.5, height: 2.5)
                                    }
                                } else {
                                    Spacer().frame(height: 2.5)
                                }
                            }
                            .frame(height: 3)
                        }
                    }
                }

                Divider().background(Color(white: 0.2))

                // Bottom Section: Scheduled Rounds for Today
                Text("TODAY'S AGENDA")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(white: 0.5))

                let todayList = entry.payload?.todayContests ?? []
                if !todayList.isEmpty {
                    VStack(spacing: 6) {
                        ForEach(todayList.prefix(2)) { c in
                            HStack(spacing: 8) {
                                Circle()
                                    .fill(Color(hex: c.platformColor))
                                    .frame(width: 8, height: 8)

                                VStack(alignment: .leading, spacing: 1) {
                                    Text(c.title)
                                        .font(.system(size: 12, weight: .semibold))
                                        .foregroundColor(.white)
                                        .lineLimit(1)

                                    Text(c.platformName)
                                        .font(.system(size: 10))
                                        .foregroundColor(Color(hex: c.platformColor))
                                }

                                Spacer()

                                if c.isLive {
                                    Text("LIVE")
                                        .font(.system(size: 9, weight: .bold))
                                        .foregroundColor(.red)
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(Color.red.opacity(0.18))
                                        .cornerRadius(4)
                                }
                            }
                        }
                    }
                } else {
                    Text("No rounds scheduled today")
                        .font(.system(size: 11))
                        .foregroundColor(Color(white: 0.4))
                }

                Spacer(minLength: 0)
            }
            .padding(14)
        }
        .widgetURL(URL(string: "contendar://"))
    }

    private func monthDays() -> [Date] {
        let today = Date()
        guard let monthInterval = calendar.dateInterval(of: .month, for: today) else { return [] }
        let firstDay = monthInterval.start
        let weekdayOfFirst = calendar.component(.weekday, from: firstDay)

        var days: [Date] = []
        // Fill padding days
        for offset in (1..<weekdayOfFirst).reversed() {
            if let d = calendar.date(byAdding: .day, value: -offset, to: firstDay) {
                days.append(d)
            }
        }

        // Fill month days
        var current = firstDay
        while current < monthInterval.end {
            days.append(current)
            guard let next = calendar.date(byAdding: .day, value: 1, to: current) else { break }
            current = next
        }

        // Limit to 35 cells (5 weeks)
        return Array(days.prefix(35))
    }

    private func formatDateKey(_ date: Date) -> String {
        let y = calendar.component(.year, from: date)
        let m = String(format: "%02d", calendar.component(.month, from: date))
        let d = String(format: "%02d", calendar.component(.day, from: date))
        return "\(y)-\(m)-\(d)"
    }
}

// MARK: - 4. Lock Screen Views (iOS 16+)
public struct LockScreenRectangularView: View {
    public let entry: ContestEntry

    public var body: some View {
        let contest = entry.payload?.activeLiveRound ?? entry.payload?.nextUpcomingRound

        if let c = contest {
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 4) {
                    Image(systemName: "timer")
                    Text(c.isLive ? "LIVE NOW" : c.platformName)
                        .font(.system(size: 11, weight: .bold))
                }

                Text(c.title)
                    .font(.system(size: 12, weight: .semibold))
                    .lineLimit(1)

                if c.isLive {
                    Text("In Progress")
                        .font(.system(size: 10))
                } else {
                    Text(c.startDate, style: .relative)
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                }
            }
        } else {
            Text("No Contests on Radar")
                .font(.system(size: 12))
        }
    }
}

