import SwiftUI
import WebKit
import Combine
#if os(macOS)
import AppKit
#else
import UIKit
#endif

struct ContentView: View {
    @StateObject private var browser = BrowserModel()
    @Environment(\.openURL) private var openURL
    var body: some View {
        VStack(spacing: 0) {
            NativeWebView(model: browser)
            if let error = browser.error {
                HStack {
                    Text(error).font(.caption)
                    Button("Reload") { browser.load() }
                }.padding()
            }
        }
        .navigationTitle("BetterBot")
        .toolbar {
            ToolbarItem {
                Button("Online workspace", systemImage: "safari") {
                    openURL(URL(string: "https://betterai-3ca66.web.app")!)
                }
            }
        }
        .alert(browser.dialogTitle, isPresented: $browser.showDialog) {
            if browser.promptDefault != nil { TextField("Response", text: $browser.promptText) }
            Button("Cancel", role: .cancel) { browser.finishDialog(false) }
            Button("OK") { browser.finishDialog(true) }
        } message: { Text(browser.dialogMessage) }
        .frame(minWidth: 320, minHeight: 480)
    }
}

@MainActor final class BrowserModel: NSObject, ObservableObject, WKNavigationDelegate, WKUIDelegate {
    @Published var error: String?
    @Published var showDialog = false
    var dialogTitle = "BetterBot"
    var dialogMessage = ""
    var promptDefault: String?
    var promptText = ""
    private var completion: ((Bool) -> Void)?
    let webView = WKWebView(frame: .zero)
    private var root: URL? { Bundle.main.resourceURL?.appendingPathComponent("Web.bundle", isDirectory: true) }

    override init() {
        super.init()
        webView.navigationDelegate = self
        webView.uiDelegate = self
        load()
    }
    func load() {
        error = nil
        guard let root, FileManager.default.fileExists(atPath: root.appendingPathComponent("index.html").path) else {
            error = "Bundled workspace is missing. Rebuild the web assets."; return
        }
        webView.loadFileURL(root.appendingPathComponent("index.html"), allowingReadAccessTo: root)
    }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError failure: Error) {
        if (failure as NSError).code != NSURLErrorCancelled { error = "The workspace could not load. Try Reload." }
    }
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = action.request.url else { decisionHandler(.cancel); return }
        if url.isFileURL, let root, url.standardizedFileURL.path.hasPrefix(root.standardizedFileURL.path + "/") {
            decisionHandler(.allow); return
        }
        if action.targetFrame?.isMainFrame == false && ["https", "about", "blob"].contains(url.scheme ?? "") {
            decisionHandler(.allow); return
        }
        if ["https", "mailto"].contains(url.scheme ?? ""), action.navigationType == .linkActivated {
            #if os(macOS)
            NSWorkspace.shared.open(url)
            #else
            UIApplication.shared.open(url)
            #endif
        }
        decisionHandler(.cancel)
    }
    func present(_ message: String, prompt: String? = nil, completion: @escaping (Bool) -> Void) {
        self.completion?(false)
        dialogMessage = message; promptDefault = prompt; promptText = prompt ?? ""
        self.completion = completion; showDialog = true
    }
    func finishDialog(_ accepted: Bool) { let handler = completion; completion = nil; handler?(accepted) }
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        present(message) { _ in completionHandler() }
    }
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        present(message, completion: completionHandler)
    }
    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        present(prompt, prompt: defaultText ?? "") { [weak self] accepted in completionHandler(accepted ? self?.promptText : nil) }
    }
}

#if os(macOS)
struct NativeWebView: NSViewRepresentable {
    let model: BrowserModel
    func makeNSView(context: Context) -> WKWebView { model.webView }
    func updateNSView(_ view: WKWebView, context: Context) {}
}
#else
struct NativeWebView: UIViewRepresentable {
    let model: BrowserModel
    func makeUIView(context: Context) -> WKWebView { model.webView }
    func updateUIView(_ view: WKWebView, context: Context) {}
}
#endif
