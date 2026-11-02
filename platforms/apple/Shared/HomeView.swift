#if os(iOS)
import SwiftUI
import HomeKit
import Combine

@MainActor final class HomeStore: NSObject, ObservableObject, HMHomeManagerDelegate {
    @Published var homes: [HMHome] = []
    @Published var status = "Connect to view your Apple Home rooms and scenes. Home data stays on this device."
    @Published var busy = false
    private var manager: HMHomeManager?
    func connect() {
        guard manager == nil else { refresh(); return }
        status = "Waiting for Apple Home access…"
        manager = HMHomeManager(); manager?.delegate = self
    }
    func refresh() {
        guard let manager else { return }
        guard manager.authorizationStatus.contains(.authorized) else {
            homes = []; status = "Home access is unavailable or denied. You can change access in Settings → Privacy & Security → HomeKit."; return
        }
        homes = manager.homes
        status = homes.isEmpty ? "No homes found. Add a home in Apple’s Home app first." : "Choose a scene to review before running it."
    }
    nonisolated func homeManagerDidUpdateHomes(_ manager: HMHomeManager) {
        Task { @MainActor [weak self] in self?.refresh() }
    }
    nonisolated func homeManager(_ manager: HMHomeManager, didUpdate status: HMHomeManagerAuthorizationStatus) {
        Task { @MainActor [weak self] in self?.refresh() }
    }
    func run(_ scene: HMActionSet, in home: HMHome) {
        guard !busy else { return }; busy = true
        home.executeActionSet(scene) { [weak self] error in
            Task { @MainActor in
                self?.busy = false
                self?.status = error.map { "Scene failed: \($0.localizedDescription)" } ?? "Scene ‘\(scene.name)’ ran successfully."
            }
        }
    }
}

struct HomeView: View {
    @StateObject private var store = HomeStore()
    @State private var pending: HMActionSet?
    @State private var pendingHome: HMHome?
    @State private var confirming = false
    @Environment(\.scenePhase) private var phase
    var body: some View {
        List {
            Section {
                Text(store.status)
                Button("Connect Apple Home") { store.connect() }
                Text("Access is optional. Scene actions may affect lights, doors, and other accessories. BetterBot never runs a scene automatically.")
                    .font(.caption).foregroundStyle(.secondary)
            }
            ForEach(store.homes, id: \.uniqueIdentifier) { home in
                Section(home.name) {
                    ForEach(home.rooms, id: \.uniqueIdentifier) { room in
                        Label("\(room.name) · \(room.accessories.count) accessories", systemImage: "door.left.hand.open")
                    }
                    ForEach(home.actionSets, id: \.uniqueIdentifier) { scene in
                        Button(scene.name) { pending = scene; pendingHome = home; confirming = true }.disabled(store.busy)
                    }
                    if home.actionSets.isEmpty { Text("No scenes. Create scenes in Apple’s Home app.").foregroundStyle(.secondary) }
                }
            }
        }.navigationTitle("Apple Home")
        .confirmationDialog("Run ‘\(pending?.name ?? "scene")’ in \(pendingHome?.name ?? "your home")?", isPresented: $confirming, titleVisibility: .visible) {
            Button("Run scene", role: .destructive) {
                if let scene = pending, let home = pendingHome { store.run(scene, in: home) }
                pending = nil; pendingHome = nil
            }
            Button("Cancel", role: .cancel) { pending = nil; pendingHome = nil }
        } message: { Text("This activates the scene’s configured accessories. Check its actions in Apple Home before continuing.") }
        .onChange(of: phase) { _, value in if value == .active { store.refresh() } }
    }
}
#endif
