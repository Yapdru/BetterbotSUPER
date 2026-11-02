# BetterBot platform previews

These are development wrappers around the bundled BetterBot web app. They are not store-ready releases and do not implement operating-system computer control.

## Status

| Target | Status |
| --- | --- |
| macOS | Local development build passed; bundled interface launched in WKWebView |
| iPhone/iPad | iOS Simulator build passed; physical-device signing and runtime testing remain |
| visionOS | Dedicated resizable SwiftUI app with workspace, native focus timer, and offline reader; Simulator build passed |
| watchOS | Standalone native focus timer and offline coding reader; Simulator build passed |
| tvOS | Remote-friendly native focus timer and offline coding reader; Simulator build passed |
| Apple Home | iPhone/iPad HomeKit rooms and scenes screen, with opt-in access and confirmation before scene execution; physical-home testing pending |
| Dynamic Island | iPhone focus Live Activity extension, including compact/expanded/minimal and Lock Screen views; build passed, device testing pending |
| Android | Gradle/Java source target and bundled assets prepared; not built here |
| Windows | .NET 10 WPF/WebView2 source target and bundled assets prepared; not built here |
| Web/PWA | Existing browser app; local Chrome testing completed in earlier passes |
| Linux | Browser/PWA path only; no native package |

## Shared assets

Run `node scripts/package-native-web.mjs` from the repository root after changing the web app. This updates the Apple Web.bundle, Android assets/Web, and Windows Web directories. Never place server secrets in these bundles.

## Apple

Open **`apple/BetterBotApple.xcodeproj`** in Xcode. Shared schemes: `BetterBot` (iPhone/iPad, with embedded Live Activity), `BetterBotMac`, `BetterBotVision`, `BetterBotWatch`, and `BetterBotTV`. The earlier nested BetterBot project is a legacy wrapper and does not embed the Live Activity extension. Physical devices and App Store distribution need an Apple development team, signing, entitlements, and release testing. The iPhone bundle ID is `com.yapdru.betterbot`; change the extension prefix alongside it if necessary for your account.

The Mac development build uses local ad-hoc signing and is not notarized for public distribution. The Simulator build cannot be installed on a physical iPhone.

See [Apple features and verification](apple/README.md) for the feature boundaries, HomeKit behavior, and runtime checklist. To regenerate the project and attributed offline reader after changing shared sources, run `node scripts/generate-apple-project.mjs`.

## Android

Open `android` in Android Studio with JDK 17 and Android SDK 35, or run `./gradlew assembleDebug` in that folder. SDK licenses must be reviewed and accepted by the developer. A release APK/AAB needs a developer-owned signing key. The current debug target is a source preview, not a verified APK.

## Windows

On Windows, install .NET SDK 10 and Microsoft Edge WebView2 Runtime, then run:

```powershell
dotnet publish platforms/windows/BetterBot.csproj -c Release -r win-x64 --self-contained false -o output/windows
```

The workflow `Native preview builds` can run the Windows and Android builds after the source is published to GitHub. It is manual-only and has not been run. Hosted-runner availability, account usage limits, and SDK availability must be checked before running it.

## Native preview limitations

Local webviews have a different origin and session from the hosted website. Firebase OAuth, cloud AI routing, public-library CORS access, microphone/camera, file pickers, downloads, and GPU model behavior need platform-specific integration and testing. The native previews provide an Online workspace button for browser sign-in and cloud features; that browser session is not imported into the native webview. Bundled local tools and projects are the initial native scope. The hosted website may differ from the bundled UI until web deployment is completed.

Projects are stored locally, not synced between platforms. There is no native code-execution bridge and no access to other apps, terminal commands, screen capture, Gmail, or system credentials. Google/browser sign-in is not proof of a paid subscription; backend billing and usage enforcement are still separate unfinished work.
