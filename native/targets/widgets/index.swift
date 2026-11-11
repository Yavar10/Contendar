import WidgetKit
import SwiftUI

// MARK: - Root Entry View Dispatcher
struct ContendarWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    let entry: ContestEntry

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        case .accessoryRectangular:
            LockScreenRectangularView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

// MARK: - Main Calendar & Radar Widget
struct ContendarCalendarWidget: Widget {
    let kind: String = "ContendarCalendarWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: ContestTimelineProvider()) { entry in
            ContendarWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Contendar Radar")
        .description("Track competitive programming rounds and view your contest calendar.")
        .supportedFamilies({
            if #available(iOS 16.0, *) {
                return [.systemSmall, .systemMedium, .systemLarge, .accessoryRectangular]
            } else {
                return [.systemSmall, .systemMedium, .systemLarge]
            }
        }())
    }
}

// MARK: - Main Widget Bundle
@main
struct ContendarWidgetBundle: WidgetBundle {
    var body: some Widget {
        ContendarCalendarWidget()
    }
}

