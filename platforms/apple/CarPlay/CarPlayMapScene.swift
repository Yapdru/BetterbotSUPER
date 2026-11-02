#if os(iOS)
import CarPlay
import MapKit
import Combine

// Register this scene only after Apple approves the navigation entitlement.
@MainActor final class CarPlayMapScene: UIResponder, CPTemplateApplicationSceneDelegate {
    private var controller: UIViewController?
    private var gps: DrivingLocation?
    private var clock: AnyCancellable?
    func templateApplicationScene(_ scene: CPTemplateApplicationScene, didConnect interfaceController: CPInterfaceController, to window: CPWindow) {
        let map = MKMapView(); map.showsUserLocation = true; map.userTrackingMode = .followWithHeading
        let viewController = UIViewController(); viewController.view = map
        window.rootViewController = viewController; controller = viewController
        let template = CPMapTemplate()
        let recenter = CPMapButton { _ in map.setUserTrackingMode(.followWithHeading, animated: true) }
        recenter.image = UIImage(systemName: "location.fill"); template.mapButtons = [recenter]
        let location = DrivingLocation(); gps = location; location.startIfAuthorized()
        let mph = (UserDefaults.standard.object(forKey: "betterbot.driving.mph") as? Bool) ?? ["US", "GB"].contains(Locale.current.region?.identifier ?? "")
        clock = Timer.publish(every: 1, on: .main, in: .common).autoconnect().sink { date in
            let speed = CPBarButton(title: location.speed(at: date, mph: mph) + (mph ? " mph" : " km/h"), handler: nil)
            speed.isEnabled = false; template.trailingNavigationBarButtons = [speed]
        }
        interfaceController.setRootTemplate(template, animated: false, completion: nil)
    }
    func templateApplicationScene(_ scene: CPTemplateApplicationScene, didDisconnect interfaceController: CPInterfaceController, from window: CPWindow) {
        clock?.cancel(); clock = nil; gps?.stop(); gps = nil; window.rootViewController = nil; controller = nil
    }
}
#endif
