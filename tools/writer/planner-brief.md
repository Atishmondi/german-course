# Planner brief: plan ONE A1 chapter so 3 writers can write it in parallel

Read first: SP/writer-brief.md (the full chapter-writer spec: quality bar, hard rules, intro card, lead, deeper) and SP/intro-brief.md. SP = /private/tmp/claude-501/-Users-atishmondi-Documents-german/2f9db4c1-24bc-40e8-ae71-583306c22e39/scratchpad, ROOT = /Users/atishmondi/Documents/german/sites/german-current.
Then do steps 4–6 of "Before writing" in the writer brief (ch02 model, inventory entry, levels chapterDays, taught list: `python3 SP/taught.py ROOT/content/a1/ch0{1..8}.json`).
Also skim ROOT/content/a1/ch08.json lesson 1 to see the current card style (intro card, lead, deeper).

Your job: write `SP/drafts/chNN/plan.md`, a BINDING plan that 3 writers will follow at the same time without seeing each other's work:
- Writer A: lessons 1–3 + skill day 1. Writer B: lessons 4–6 + skill day 2. Writer C: lessons 7–9 + skill day 3.
So the plan must make every lesson self-contained and fix everything later lessons depend on.

For each of the 9 lessons:
- id (a1-cNN-0N), title, goal, grammar point (one line), minutes, printedPages (inside the chapter range)
- intro card: title "Before we start: …", the earlier lesson it bridges from
- 5–7 teaching cards: title + 1–2 lines of what it teaches (table/steps) — in teach-before-you-test order
- grammar.mistake (wrong / right)
- EXACT 10 vocabulary items: word, article + plural for nouns (checked on de.wiktionary.org if at all unsure), forms for verbs, English
- chunks taught ahead of their grammar
- what drills/check may test (so later writers know what's known)
- media: 1–3 grammarVideos keys + 1–2 nicosWeg keys from ROOT/content/resources.json (search with python; real keys only, ok: true, matching topic; never reuse a key used in ch01–08 if a fitting unused one exists)
For each skill day (dK covers that day's 3 lessons): reading topic + characters, listening dialogue topic, writing free task.
End with a "Known after lesson N" cumulative list of grammar + vocab (so writer B/C know exactly what A taught).
Chapter title and printed page range at the top. Lessons = 9 (3 days × 3), skill days = 3.

Spread the chapter's inventory grammar/communication/vocab/pronunciation/culture sensibly over the 9 lessons, heavy grammar first with its own cards. Keep it A1. Do not write lesson JSON. Do not touch ROOT.
Final report (≤150 words): lesson titles + grammar point each, and anything uncertain.
