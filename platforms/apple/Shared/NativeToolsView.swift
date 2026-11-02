import SwiftUI

struct NativeToolsView: View {
    var body: some View {
        NavigationStack {
            List {
                Section("BetterBot") {
                    NavigationLink { FocusView() } label: { Label("Focus timer", systemImage: "timer") }
                    NavigationLink { LibraryView() } label: { Label("Offline coding library", systemImage: "books.vertical") }
                    #if os(iOS)
                    NavigationLink { HomeView() } label: { Label("Apple Home", systemImage: "house") }
                    #endif
                }
                Section {
                    Text("Native tools work locally. Chats, projects, and timers don’t sync between devices yet.")
                        .font(.caption).foregroundStyle(.secondary)
                }
            }.navigationTitle("BetterBot")
        }
    }
}
