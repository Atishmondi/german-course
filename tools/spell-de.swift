// Reads words (one per line) on stdin; prints the ones the macOS German dictionary marks as misspelled.
import AppKit
let checker = NSSpellChecker.shared
guard checker.setLanguage("de") else { FileHandle.standardError.write("German dictionary not available\n".data(using: .utf8)!); exit(2) }
while let w = readLine() {
    let word = w.trimmingCharacters(in: .whitespaces)
    if word.isEmpty { continue }
    let r = checker.checkSpelling(of: word, startingAt: 0, language: "de", wrap: false, inSpellDocumentWithTag: 0, wordCount: nil)
    if r.location != NSNotFound { print(word) }
}
