import SwiftUI
import WidgetKit
import ActivityKit

@main struct BetterBotLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: FocusAttributes.self) { context in
            FocusActivityCard(state: context.state)
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
        }.supplementalActivityFamilies([.small, .medium])
    }
}

private struct FocusActivityCard: View {
    let state: FocusAttributes.ContentState
    @Environment(\.activityFamily) private var family
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("BetterBot Focus", systemImage: "sparkles").font(family == .small ? .caption : .headline).foregroundStyle(.cyan)
            Text(timerInterval: state.start...state.end, countsDown: true)
                .font(family == .small ? .title2 : .title).monospacedDigit()
                .minimumScaleFactor(0.7).lineLimit(1)
        }.padding(family == .small ? 10 : 16)
            .activityBackgroundTint(.black.opacity(0.85)).activitySystemActionForegroundColor(.white)
    }
}
