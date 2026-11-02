#if os(iOS)
import SwiftUI
import CarPlay

struct NavigationCue {
    enum Direction { case left, right, straight, unknown
        var symbol: String { switch self { case .left: return "arrow.turn.up.left"; case .right: return "arrow.turn.up.right"; case .straight: return "arrow.up"; case .unknown: return "location.slash" } }
    }
    var direction: Direction = .unknown
    var instruction = "No active guidance"
    var speedLimit: Int? = nil
    var unit = "km/h"
    // Use only structured maneuver data from a verified active navigation provider.
    func carPlayManeuver() -> CPManeuver? {
        guard direction != .unknown else { return nil }
        let maneuver = CPManeuver()
        maneuver.instructionVariants = [instruction]
        maneuver.dashboardInstructionVariants = [instruction]
        maneuver.symbolImage = UIImage(systemName: direction.symbol)
        maneuver.dashboardSymbolImage = maneuver.symbolImage
        switch direction {
        case .left: maneuver.maneuverType = .leftTurn
        case .right: maneuver.maneuverType = .rightTurn
        case .straight: maneuver.maneuverType = .straightAhead
        case .unknown: break
        }
        return maneuver
    }
}

struct GuidancePill: View {
    var cue: NavigationCue
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: cue.direction.symbol).font(.title2).accessibilityLabel(cue.instruction)
            Text(cue.speedLimit.map(String.init) ?? "—")
                .font(.title3.bold()).monospacedDigit()
                .frame(minWidth: 42, minHeight: 42).background(.background, in: Circle())
                .overlay(Circle().stroke(.red, lineWidth: 3))
                .accessibilityLabel(cue.speedLimit.map { "Speed limit \($0) \(cue.unit)" } ?? "Speed limit unavailable")
            Text(cue.unit).font(.caption2)
        }.padding(14).background(.ultraThinMaterial, in: Capsule())
            .overlay(Capsule().stroke(.white.opacity(0.25)))
    }
}
#endif
