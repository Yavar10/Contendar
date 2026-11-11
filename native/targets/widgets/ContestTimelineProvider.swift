import WidgetKit
import SwiftUI

public struct ContestEntry: TimelineEntry {
    public let date: Date
    public let payload: WidgetPayload?
}

public struct ContestTimelineProvider: TimelineProvider {
    public static let appGroupId = "group.com.contendar.app"
    public static let storageKey = "contendar_widget_data"

    public init() {}

    public func placeholder(in context: Context) -> ContestEntry {
        ContestEntry(
            date: Date(),
            payload: WidgetPayload(
                updatedAtMs: Date().timeIntervalSince1970 * 1000,
                timezone: "local",
                activeLiveRound: nil,
                nextUpcomingRound: WidgetContest(
                    id: "demo",
                    title: "Codeforces Round (Div. 2)",
                    platform: "codeforces",
                    platformName: "Codeforces",
                    platformColor: "#3B82F6",
                    startTimeMs: Date().addingTimeInterval(3600).timeIntervalSince1970 * 1000,
                    endTimeMs: nil,
                    durationSeconds: 7200,
                    url: nil,
                    status: "UPCOMING"
                ),
                todayContests: [],
                calendarDots: [:]
            )
        )
    }

    public func getSnapshot(in context: Context, completion: @escaping (ContestEntry) -> Void) {
        let entry = ContestEntry(date: Date(), payload: loadPayload())
        completion(entry)
    }

    public func getTimeline(in context: Context, completion: @escaping (Timeline<ContestEntry>) -> Void) {
        let data = loadPayload()
        let now = Date()

        // Calculate smart next refresh time
        var nextRefresh = Calendar.current.date(byAdding: .minute, value: 15, to: now) ?? now.addingTimeInterval(900)

        if let upcoming = data?.nextUpcomingRound {
            let start = upcoming.startDate
            if start > now && start < nextRefresh {
                nextRefresh = start
            }
        } else if let live = data?.activeLiveRound, let end = live.endDate {
            if end > now && end < nextRefresh {
                nextRefresh = end
            }
        }

        let entry = ContestEntry(date: now, payload: data)
        let timeline = Timeline(entries: [entry], policy: .after(nextRefresh))
        completion(timeline)
    }

    private func loadPayload() -> WidgetPayload? {
        guard let userDefaults = UserDefaults(suiteName: Self.appGroupId) else {
            return nil
        }

        // SharedGroupPreferences stores as string or raw dict
        if let jsonString = userDefaults.string(forKey: Self.storageKey),
           let jsonData = jsonString.data(using: .utf8) {
            return try? JSONDecoder().decode(WidgetPayload.self, from: jsonData)
        }

        if let dict = userDefaults.dictionary(forKey: Self.storageKey),
           let jsonData = try? JSONSerialization.data(withJSONObject: dict, options: []) {
            return try? JSONDecoder().decode(WidgetPayload.self, from: jsonData)
        }

        return nil
    }
}

