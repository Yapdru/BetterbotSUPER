import SwiftUI

@main struct MyApp: App {
    @State private var showingTools = false
    var body: some Scene {
        WindowGroup {
            NavigationStack {
                ContentView().toolbar {
                    ToolbarItem { Button("Apple tools", systemImage: "sparkles") { showingTools = true } }
                }
            }.sheet(isPresented: $showingTools) {
                NativeToolsView(onDone: { showingTools = false }).frame(minWidth: 300, minHeight: 400)
            }
        }
    }
}
