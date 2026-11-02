import SwiftUI
import WidgetKit
import ActivityKit

@main struct BetterBotLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: FocusAttributes.self) { context in
            HStack {
                Image(systemName: "sparkles").foregroundStyle(.cyan)
                VStack(alignment: .leading) {
                    Text("BetterBot · Focus").font(.headline)
                    Text(timerInterval: context.state.start...context.state.end, countsDown: true)
                        .monospacedDigit()
                }
                Spacer()
            }.padding().activityBackgroundTint(.black.opacity(0.85)).activitySystemActionForegroundColor(.white)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) { Label("Focus", systemImage: "sparkles").foregroundStyle(.cyan) }
                DynamicIslandExpandedRegion(.trailing) {
                    Text(timerInterval: context.state.start...context.state.end, countsDown: true).monospacedDigit()
                }
                DynamicIslandExpandedRegion(.bottom) { Text("BetterBot · Open the app to end your session.").font(.caption) }
            } compactLeading: { Image(systemName: "sparkles").foregroundStyle(.cyan) }
            compactTrailing: {
                Text(timerInterval: context.state.start...context.state.end, countsDown: true)
                    .monospacedDigit().frame(width: 46)
            } minimal: { Image(systemName: "sparkles").foregroundStyle(.cyan) }
            .keylineTint(.cyan)
        }
    }
}
