import SwiftUI

struct LibraryRecord: Decodable, Identifiable {
    let id, title, question, answer, author, license, url: String
    let questionAuthor, questionLicense, questionURL: String
}
struct LibraryView: View {
    @State private var query = ""
    @State private var records: [LibraryRecord] = []
    @State private var failed = false
    private var matches: [LibraryRecord] {
        let terms = query.split(whereSeparator: { $0.isWhitespace }).map(String.init)
        return records.filter { record in
            let text = record.title + " " + record.question + " " + record.answer
            return terms.allSatisfy { text.localizedCaseInsensitiveContains($0) }
        }
    }
    var body: some View {
        List {
            Section {
                Text("\(records.count) sourced coding questions · available offline").font(.caption).foregroundStyle(.secondary)
                TextField("Search questions and answers", text: $query)
                if !query.isEmpty {
                    Button("Clear search") { query = "" }
                    Text("\(matches.count) results").font(.caption).foregroundStyle(.secondary)
                }
            }
            if failed { Text("The bundled library could not load. Reinstall the app.") }
            if !failed && matches.isEmpty { Text("No matching questions. Try a shorter search.") }
            ForEach(matches) { record in
                NavigationLink(record.title) {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 16) {
                            Text(record.title).font(.headline)
                            Text(record.question)
                            Text("Question by \(record.questionAuthor) · \(record.questionLicense)").font(.caption).foregroundStyle(.secondary)
                            #if !os(tvOS)
                            if let questionURL = URL(string: record.questionURL) { Link("Original question", destination: questionURL) }
                            #else
                            Text(record.questionURL).font(.caption)
                            #endif
                            Divider()
                            Text(record.answer)
                            Text("Adapted to plain text from Stack Overflow. Answer by \(record.author) · \(record.license)")
                                .font(.caption).foregroundStyle(.secondary)
                            #if !os(tvOS)
                            if let url = URL(string: record.url) { Link("Original answer and attribution", destination: url) }
                            if let license = URL(string: "https://creativecommons.org/licenses/by-sa/\(record.license.split(separator: " ").last ?? "4.0")/") { Link("License", destination: license) }
                            #else
                            Text(record.url).font(.caption)
                            Text(record.license).font(.caption)
                            #endif
                        }.padding()
                    }.focusable().navigationTitle("Coding library")
                }
            }
        }.navigationTitle("Coding library")
        .task {
            do {
                guard let url = Bundle.main.url(forResource: "native-library", withExtension: "json") else { throw CocoaError(.fileNoSuchFile) }
                records = try JSONDecoder().decode([LibraryRecord].self, from: Data(contentsOf: url))
            } catch { failed = true }
        }
    }
}
