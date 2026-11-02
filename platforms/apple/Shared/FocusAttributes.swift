#if os(iOS)
import ActivityKit
import Foundation

struct FocusAttributes: ActivityAttributes {
    struct ContentState: Codable, Hashable {
        var start: Date
        var end: Date
    }
}
#endif
