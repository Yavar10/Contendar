import Foundation
import SwiftUI

// MARK: - Contest Model
public struct WidgetContest: Codable, Identifiable {
    public let id: String
    public let title: String
    public let platform: String
    public let platformName: String
    public let platformColor: String
    public let startTimeMs: Double
    public let endTimeMs: Double?
    public let durationSeconds: Int?
    public let url: String?
    public let status: String?

    public var startDate: Date {
        Date(timeIntervalSince1970: startTimeMs / 1000.0)
    }

    public var endDate: Date? {
        if let end = endTimeMs {
            return Date(timeIntervalSince1970: end / 1000.0)
        }
        if let dur = durationSeconds {
            return Date(timeIntervalSince1970: (startTimeMs / 1000.0) + Double(dur))
        }
        return nil
    }

    public var isLive: Bool {
        status?.uppercased() == "LIVE"
    }
}

// MARK: - Root Payload Model
public struct WidgetPayload: Codable {
    public let updatedAtMs: Double
    public let timezone: String
    public let activeLiveRound: WidgetContest?
    public let nextUpcomingRound: WidgetContest?
    public let todayContests: [WidgetContest]
    public let calendarDots: [String: [String]]
}

// MARK: - SwiftUI Color Hex Extension
extension Color {
    init(hex: String) {
        let hexClean = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hexClean).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hexClean.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 10, 132, 255) // Default Apple System Blue
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

