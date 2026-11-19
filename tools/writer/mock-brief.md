# Mock brief: one A1 practice exam (Goethe "Start Deutsch 1" style, original content)

ROOT = /Users/atishmondi/Documents/german/sites/german-current ; SP = /private/tmp/claude-501/-Users-atishmondi-Documents-german/2f9db4c1-24bc-40e8-ae71-583306c22e39/scratchpad
Read first: ROOT/active/content-contract.md (Question schema + "Mock" section), ROOT/compile-course.py functions `question`/`questions` and the mock block (search "mocks.json"), ROOT/dist/lesson.js function mountMock (how sections render: one section = one text/script + its questions; listening `text` is a script read aloud by the browser's German voice, with "Name:" speaker labels), and one skill day in ROOT/content/a1/ch12.json for question style. What the learner knows: `python3 SP/taught.py ROOT/content/a1/ch*.json` (all 12 A1 chapters). Use ONLY that grammar and vocabulary (plus a few glossed-in-instructions words at most). Characters only Mira, Ben, Leon, Anna, Frau Weber, Herr Ali (plus generic shop/station voices). Never the learner's name. Never copy the Netzwerk books or any real Goethe exam — all content original.

## Shape (write SP/mocks/mock-N.json, one object)
{"id": "a1-mock-N", "level": "a1", "title": "...", "sections": [ ... ]} with sections, in this order (instructions in plain English, like a real exam but friendly):
1. listening — Part 1: 3 short everyday dialogues in ONE script (label them "Dialog 1:", … as plain lines is NOT allowed — the speaker-label regex eats "Word:"; instead start each dialog with a line like "Erster Dialog." spoken by a narrator line without colon), 6 questions (choice, 3 options).
2. listening — Part 2: station/shop/radio announcements (4–5 short ones in one script), 5 questions (richtig/falsch style as choice ["Richtig","Falsch"] or 3 options).
3. listening — Part 3: one longer phone message or dialogue, 5 questions.
4. reading — Part 1: two short emails/notes (one text, ~120 words), 5 questions (richtig/falsch or choice).
5. reading — Part 2: ads/signs/notices (one text with several short labelled notices, ~120 words), 6 questions.
6. writing — 8 items: a form to fill (type answers: name/city/date-style facts taken from a short given situation in the prompt) + sentence-building (build) + one short message completion (type). Each type question lists every acceptable answer variant.
7. grammar — 15 questions across all A1 chapters (sein/haben, verb position, modal + infinitive at the end, separable verbs, accusative/dative articles, dative pronouns, two-way prepositions, Perfekt haben/sein + participles, war/hatte, imperative, welch-/dies-, plural, ein/kein, possessives), "grammar": true on each, mixed choice/type/build.
Total ≥ 50 questions. Every question: prompt, hint (a nudge, never the answer), explanation (one line why). Right choice at varied positions (≈ evenly 0/1/2; Richtig/Falsch evenly split). Reading/listening answers must come ONLY from the text.
German 100% correct and natural (gender, case, endings, word order, NFC Umlauts). No adjective endings before nouns except fixed chunks already taught (A1 doesn't teach them).

## Steps
1. Write SP/mocks/mock-N.json (one Write).
2. Validate: `python3 SP/validate-mock.py N` — fix until "clean".
3. Reread every German string once more for correctness; check answers against texts.
Final report (≤150 words): section list with question counts, total, any German you're unsure about.
