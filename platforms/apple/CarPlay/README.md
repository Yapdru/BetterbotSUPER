# Driving map and CarPlay navigation prototype

The iPhone Apple tools screen has a MapKit map, opt-in foreground GPS, approximate speed in mph/km/h, destination search, and an explicit handoff to Apple Maps for directions. Apple Maps is the worldwide default; regional feature coverage varies. No additional commercial map SDK or billing key is configured. GPS position is not sent to BetterBot servers; map/search requests use Apple's services. Invalid, older-than-ten-second, or low-accuracy speed fixes show a dash. GPS speed is not a legal speed limit or a calibrated vehicle speedometer.

The side pill on the iPhone map is a **guidance component**, with left/right/straight symbols and an optional posted-limit field. It currently shows unknown guidance and limit because no active turn-by-turn feed or speed-limit provider is connected. It never infers a road speed limit from GPS speed. `NavigationCue.carPlayManeuver()` maps structured direction data to CarPlay maneuver and dashboard symbol metadata, but it is not wired to an active `CPNavigationSession`.

`CarPlayMapScene` compiles with the iPhone target but is intentionally **not registered in the scene manifest** and has no enabled CarPlay entitlement. After approval, it provides an Apple map following the user's location, a recenter control, and approximate speed in the map template bar. It never prompts for location permission in the car; approve access on iPhone while parked first. It does not yet calculate routes, reroute, announce turns, publish a navigation session to the cluster, or render a custom CarPlay Ultra dashboard pill.

## Remaining integration

1. Request Apple's navigation entitlement for the real application bundle ID. This cannot be granted by source-code changes.
2. After approval, use a provisioning profile with `com.apple.developer.carplay-maps`, and register `CPTemplateApplicationSceneSessionRoleApplication` with scene class `CPTemplateApplicationScene` and delegate `$(PRODUCT_MODULE_NAME).CarPlayMapScene`. Keep the ordinary SwiftUI application scene configuration intact. Do not enable the entitlement with an unapproved profile.
3. Connect an active, tested navigation provider and its structured maneuvers to `CPNavigationSession`. Use `CPManeuver` dashboard metadata for cluster/HUD guidance. Add a licensed, region-appropriate speed-limit source before displaying numeric limits.
4. Validate location authorization, connect/disconnect, stale GPS, real route progress, off-route recovery, language/units, dashboard/cluster placement, and simulator/vehicle behavior before distribution.

Apple and the vehicle control dashboard and cluster placement. The app cannot overlay a custom blob on Apple Maps or another app, or force a particular screen position on CarPlay Ultra. No CarPlay permission, Developer agreement, or store submission has been completed automatically.

References:
- https://developer.apple.com/documentation/carplay/integrating-carplay-with-your-navigation-app
- https://developer.apple.com/videos/play/wwdc2025/216/
- https://www.apple.com/ios/feature-availability/
