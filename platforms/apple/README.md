# BetterBot on Apple devices

Open `BetterBotApple.xcodeproj`. The generated project includes shared schemes and uses the installed Apple SDKs. Its generator is `scripts/generate-apple-project.mjs` at the repository root; update that generator when changing target membership or build settings. Refresh web assets separately with `scripts/package-native-web.mjs`.

## Features

| Scheme or integration | Implemented behavior |
| --- | --- |
| BetterBot, iPhone/iPad | Existing bundled workspace plus an Apple tools sheet with focus, offline coding reader, and Apple Home |
| BetterBotMac | Existing workspace plus native focus and coding reader |
| BetterBotVision | Resizable spatial window with translucent glass background, workspace and native tools tabs |
| BetterBotWatch | Independent Watch app; 5/25/50-minute focus sessions and searchable offline Python Q&A |
| BetterBotTV | Native focus board and searchable coding reader with remote focus navigation |
| BetterBotLiveActivity | Embedded iPhone WidgetKit extension for focus countdown on the Lock Screen and supported Dynamic Island devices |
| Apple Home | Optional HomeKit connection on iPhone/iPad; rooms, accessory counts, scene names, explicit confirmation before executing a chosen scene |

The watch and TV apps are local companions, not full AI chat clients. They do not inherit browser authentication, paid entitlements, or cloud chat history. Timers, projects, and conversations do not sync across devices. There is no immersive mixed-reality scene, gesture tracking, or headset camera access.

The coding reader bundles the existing **20-record public pilot**, not millions of answers. It preserves question/answer authors, source URLs, and licenses. HTML is adapted into plain text; originals and provenance remain in `knowledge/pilot.json`. The data is available offline and is not freshly generated AI advice.

## Focus and Dynamic Island

On iPhone, open **Apple tools → Focus timer**, choose a duration, then leave the app to see the Live Activity. Lock Screen display works without a Dynamic Island. An iPad or a device without the hardware cannot gain a Dynamic Island through this app.

Only focus sessions use Live Activities in this version. They do not show AI generation progress. No push-token registration or remote notifications are used. Timer countdown uses an absolute end date saved locally; suspension does not reset it. Open the timer and choose **End session** to dismiss the activity, including after the countdown reaches zero. System settings can disable Live Activities; the in-app timer remains usable and reports the limitation. A new session cleans up stale BetterBot focus activities before requesting another.

## Apple Home

Opening Apple tools does not instantiate `HMHomeManager` or request HomeKit access. Tap **Connect Apple Home** to initiate the system permission flow. Home data is not sent to Cloudflare, Gemini, or the public coding library. If access is denied or there are no homes, the app explains the next step. Existing scenes come from Apple Home; BetterBot does not create accessories, change automations, or execute scenes in the background. Running a scene prompts for confirmation; the scene can control any accessories configured in Apple Home, so review its actions there first. Execution errors are shown instead of reporting success.

The iPhone target declares the HomeKit entitlement and usage description. A matching developer provisioning profile and a physical configured home are needed to validate it. **There is no standalone HomePod app or HomePod firmware modification.** Apple Home integration uses the user's existing HomeKit home and home hub setup. It does not replace Siri.

## Verification

Simulator SDK builds were checked for iPhone including the embedded Live Activity, Watch, TV, and Vision; the Mac target also builds. These checks validate compilation and app-extension embedding. They do not prove physical-device functionality, HomeKit authorization, actual scene execution, Dynamic Island rendering, accessibility, or App Store review compliance.

Mac runtime check: opened Apple tools, started a five-minute timer, navigated away and back, observed the countdown continue from 5:00 to 4:50, and ended the session. Opened the offline library, searched `merge`, and verified the matching question, answer, both authors, original-source links, and license were displayed. This validates the shared native screen flow on Mac; Watch, TV, Vision, and iPhone still need their own interaction tests.

Before release, test:

- iPhone/iPad: native tools navigation, optional Home permission accept/deny/revoke, no-home state, scene cancellation and failure. Use a harmless scene to verify execution.
- Dynamic Island: start/end, app suspension/relaunch, timer expiry, disabled Live Activities, compact/expanded/minimal layouts, Lock Screen, and a device without Dynamic Island. Verify VoiceOver and large text.
- Watch: independent installation, Digital Crown scrolling, search/dictation, timer relaunch, and small/large watch sizes.
- TV: Siri Remote navigation, long-answer scrolling, keyboard search, and focus visibility.
- Vision: window resize, gaze/pinch interaction, text readability, and external-link handling.

Example build (replace scheme/platform for other targets):

```sh
xcodebuild -project platforms/apple/BetterBotApple.xcodeproj -scheme BetterBotWatch \
  -destination 'generic/platform=watchOS Simulator' CODE_SIGNING_ALLOWED=NO build
```

Watch-only packaging is intentional; no WatchConnectivity or iPhone companion embedding is configured. Physical builds, distribution signing, icons and store assets, notifications, sync, and release QA remain separate work. Simulator packages are not device installers.

## Apple references

- [Displaying Live Activities](https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities)
- [Dynamic Island configuration](https://developer.apple.com/documentation/widgetkit/dynamicisland)
- [Enabling HomeKit](https://developer.apple.com/documentation/homekit/enabling-homekit-in-your-app)
- [Single-target watchOS apps](https://developer.apple.com/documentation/watchos-apps/migrating-to-a-single-target-watchos-app)
- [Apple Home development](https://developer.apple.com/apple-home/)
