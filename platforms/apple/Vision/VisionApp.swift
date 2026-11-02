import SwiftUI

@main struct BetterBotVisionApp: App {
    var body: some Scene {
        WindowGroup {
            TabView {
                NavigationStack { ContentView() }.tabItem { Label("Workspace", systemImage: "bubble.left.and.bubble.right") }
                NativeToolsView().tabItem { Label("Native tools", systemImage: "sparkles") }
            }.frame(minWidth: 640, minHeight: 540).glassBackgroundEffect()
        }.defaultSize(width: 1100, height: 760).windowResizability(.contentMinSize)
    }
}
