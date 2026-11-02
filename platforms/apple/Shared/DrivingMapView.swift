#if os(iOS)
import SwiftUI
import MapKit
import CoreLocation
import Combine

@MainActor final class DrivingLocation: NSObject, ObservableObject, CLLocationManagerDelegate {
    @Published var location: CLLocation?
    @Published var status = "Enable location while parked to show your position and GPS speed."
    private let manager = CLLocationManager()
    private var requested = false
    override init() { super.init(); manager.delegate = self; manager.desiredAccuracy = kCLLocationAccuracyBest; manager.activityType = .automotiveNavigation }
    func start() { requested = true; manager.requestWhenInUseAuthorization(); if manager.authorizationStatus == .authorizedWhenInUse || manager.authorizationStatus == .authorizedAlways { manager.startUpdatingLocation() } }
    func startIfAuthorized() { requested = true; if manager.authorizationStatus == .authorizedWhenInUse || manager.authorizationStatus == .authorizedAlways { manager.startUpdatingLocation() } }
    func stop() { requested = false; manager.stopUpdatingLocation(); location = nil }
    nonisolated func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        Task { @MainActor [weak self] in
            guard let self, self.requested else { return }
            switch self.manager.authorizationStatus {
            case .authorizedAlways, .authorizedWhenInUse: self.status = "Waiting for a GPS fix…"; self.manager.startUpdatingLocation()
            case .denied, .restricted: self.status = "Location access is unavailable. Enable it in system Settings."; self.location = nil
            default: break
            }
        }
    }
    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let fix = locations.last else { return }
        Task { @MainActor [weak self] in guard let self, self.requested else { return }; self.location = fix; self.status = "GPS speed is approximate and is not a road speed limit." }
    }
    nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        Task { @MainActor [weak self] in self?.location = nil; self?.status = "GPS is unavailable. Try again with a clear view of the sky." }
    }
    func speed(at date: Date, mph: Bool) -> String {
        guard let fix = location, abs(fix.timestamp.timeIntervalSince(date)) < 10, fix.horizontalAccuracy >= 0,
              fix.horizontalAccuracy <= 50, fix.speed >= 0, fix.speedAccuracy >= 0, fix.speedAccuracy <= 5 else { return "—" }
        return String(Int((fix.speed * (mph ? 2.236936 : 3.6)).rounded()))
    }
}

struct DrivingMapView: View {
    @StateObject private var gps = DrivingLocation()
    @State private var camera: MapCameraPosition = .automatic
    @State private var destination = ""
    @State private var searching = false
    @State private var result: MKMapItem?
    @State private var error = ""
    @AppStorage("betterbot.driving.mph") private var mph = ["US", "GB"].contains(Locale.current.region?.identifier ?? "")
    var body: some View {
        VStack(spacing: 12) {
            Map(position: $camera) { UserAnnotation(); if let result { Marker(item: result) } }
                .mapControls { MapCompass(); MapScaleView() }.frame(minHeight: 220)
                .overlay(alignment: .trailing) { GuidancePill(cue: NavigationCue(unit: mph ? "mph" : "km/h")).padding(12) }
            TimelineView(.periodic(from: .now, by: 1)) { context in
                HStack { Text(gps.speed(at: context.date, mph: mph)).font(.system(size: 42, weight: .semibold, design: .rounded)).monospacedDigit(); Text(mph ? "mph" : "km/h").foregroundStyle(.secondary); Spacer(); Toggle("mph", isOn: $mph).fixedSize() }
            }
            Text(gps.status).font(.caption).foregroundStyle(.secondary)
            HStack {
                Button("Enable location") { gps.start() }
                Button("Recenter") { camera = .userLocation(fallback: .automatic) }
            }.buttonStyle(.bordered)
            HStack {
                TextField("Destination", text: $destination).textFieldStyle(.roundedBorder).submitLabel(.search).onSubmit { search() }
                Button(searching ? "Searching…" : "Find") { search() }.disabled(searching || destination.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            if let result {
                Text(result.name ?? "Destination").font(.headline)
                Button("Directions in Apple Maps") { result.openInMaps(launchOptions: [MKLaunchOptionsDirectionsModeKey: MKLaunchOptionsDirectionsModeDriving]) }
            }
            if !error.isEmpty { Text(error).font(.caption).foregroundStyle(.red) }
            Text("Apple Maps is the worldwide default; coverage varies by region. Choose your destination while parked. CarPlay navigation requires Apple approval.").font(.caption).foregroundStyle(.secondary)
        }.padding().navigationTitle("Driving map").onDisappear { gps.stop() }
    }
    private func search() {
        let query = destination.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !query.isEmpty, !searching else { return }; searching = true; result = nil; error = ""
        Task { @MainActor in
            defer { searching = false }
            let request = MKLocalSearch.Request(); request.naturalLanguageQuery = query
            if let location = gps.location { request.region = MKCoordinateRegion(center: location.coordinate, latitudinalMeters: 50000, longitudinalMeters: 50000) }
            do {
                let response = try await MKLocalSearch(request: request).start()
                guard let item = response.mapItems.first else { error = "No matching destination found."; return }
                result = item; camera = .region(response.boundingRegion)
            } catch { self.error = "Search unavailable. Check your connection and try again." }
        }
    }
}
#endif
