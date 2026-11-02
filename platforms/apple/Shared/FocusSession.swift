import SwiftUI
import Combine
#if os(iOS)
import ActivityKit
#endif

@MainActor final class FocusSession: ObservableObject {
    @Published private(set) var end: Date?
    @Published var message = ""
    private let key = "betterbot.focus.end"
    init() {
        let stored = UserDefaults.standard.double(forKey: key)
        if stored > Date().timeIntervalSince1970 { end = Date(timeIntervalSince1970: stored) }
    }
    func start(minutes: Int) {
        guard end == nil else { return }
        let finish = Date().addingTimeInterval(TimeInterval(minutes * 60))
        end = finish
        UserDefaults.standard.set(finish.timeIntervalSince1970, forKey: key)
        #if os(iOS)
        guard ActivityAuthorizationInfo().areActivitiesEnabled else {
            message = "Timer started. Live Activities are disabled in system settings."; return
        }
        Task {
            for activity in Activity<FocusAttributes>.activities {
                await activity.end(nil, dismissalPolicy: .immediate)
            }
            guard end == finish else { return }
            do {
                _ = try Activity.request(attributes: FocusAttributes(), content: ActivityContent(
                    state: FocusAttributes.ContentState(start: Date(), end: finish), staleDate: finish), pushType: nil)
                message = "Timer appears on the Lock Screen and supported Dynamic Island devices."
            } catch { message = "Timer started, but its Live Activity could not start: \(error.localizedDescription)" }
        }
        #else
        message = "Focus session saved on this device."
        #endif
    }
    func stop() {
        end = nil; UserDefaults.standard.removeObject(forKey: key); message = "Session ended."
        #if os(iOS)
        Task {
            for activity in Activity<FocusAttributes>.activities {
                await activity.end(nil, dismissalPolicy: .immediate)
            }
        }
        #endif
    }
}

struct FocusView: View {
    @StateObject private var session = FocusSession()
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Image(systemName: "sparkles").font(.largeTitle).foregroundStyle(.cyan)
                Text("Focus with BetterBot").font(.headline)
                Text("One task. A little space to think.").foregroundStyle(.secondary)
                if let end = session.end {
                    TimelineView(.periodic(from: .now, by: 1)) { context in
                        if end > context.date {
                            Text(timerInterval: context.date...end, countsDown: true)
                                .font(.system(size: 44, weight: .light, design: .rounded)).monospacedDigit()
                        } else { Text("Focus complete").font(.title2).accessibilityAddTraits(.updatesFrequently) }
                    }
                    Button("End session", role: .destructive) { session.stop() }.buttonStyle(.bordered)
                } else {
                    ForEach([5, 25, 50], id: \.self) { minutes in
                        Button("\(minutes) minutes") { session.start(minutes: minutes) }.buttonStyle(.bordered)
                    }
                }
                if !session.message.isEmpty { Text(session.message).font(.caption).foregroundStyle(.secondary) }
            }.padding()
        }.navigationTitle("Focus")
    }
}
