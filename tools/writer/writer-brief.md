# Writer brief: one A1 chapter of the German course (shared by all chapter writers)

Project: `/Users/atishmondi/Documents/german/sites/german-current` (call it ROOT). Scratchpad: `/private/tmp/claude-501/-Users-atishmondi-Documents-german/2f9db4c1-24bc-40e8-ae71-583306c22e39/scratchpad` (call it SP).

## The user's hard rule (quote)
"MAKE SURE THE QUALITY OF THE WHOLE LEARNING DOESNT DROP. use all the resources and make the ones like chapter 1,2."
Your chapter must be as rich, careful and beginner-friendly as `content/a1/ch01.json` and `content/a1/ch02.json`. The learner is a complete beginner with ADHD who studies 2 h a day and LOVES the colour-coded sentence chips and the "Explain it more simply" (`more`) text.

## Before writing (read these, in this order)
1. Load the `eli5` skill (Skill tool). Write every `more` in its style.
2. `/Users/atishmondi/Documents/german/CLAUDE.md` (project rules) and `ROOT/active/content-contract.md` (the schema; follow it exactly).
3. `ROOT/compile-course.py` functions `lesson`, `skillday`, `media`, `question(s)`, `bad_parts`, `text_checks`: these are the hard checks.
4. `ROOT/content/a1/ch02.json`: THE MODEL. Read lesson 1, lesson 4, lesson 7 and skill day 1 in full; copy their depth, tone, card rhythm, question style, hints and explanations.
5. Your chapter's entry in `ROOT/content/a1/inventory.json` (communication, grammar, vocab, pronunciation, culture, printed pages) and `chapterDays` in `ROOT/content/levels.json` (lessons = days × 3, skill days = days).
6. What is already taught. Run: `python3 SP/taught.py ROOT/content/a1/ch01.json ROOT/content/a1/ch02.json [later chapters you are told to read]` (prints every lesson's grammar point, terms and vocabulary). Everything in that output is known to the learner. Nothing else is.

## Quality bar (ch02 numbers; meet or beat every one)
- Per lesson: **5–7 cards** (never only 4); **3 examples per card**; **parts on EVERY example** (ch01–02 are 100%) and a card-level `parts` where a sentence pattern is shown; a `table` on most cards (tables built up: forms, endings, word order chairs 1/2/3/4); `steps` for build-ups.
- Card body ≤ 60 words, plain short English, one idea per card. Explain every grammar term in plain English before using it (also add it to `terms`).
- **Every card has `more`** (60–120 words): everyday comparison, tiny numbered steps, why it works, one extra example. Never a copy of the body.
- Hard grammar (irregular forms, stem changes, case endings, word-order rules) gets its own card with a table and ≥3 examples before any question uses it.
- `grammar.mistake` = the most common learner error, with `why` in plain words.
- drills: **8**, mixed choice / type / build. check: **11**, ≥ 6 with `"grammar": true`. blind: 1 fresh type question. retrieval: exactly 4 type questions, all prompts different from drills/check/blind.
- Every question has a `hint` (a nudge to the rule in plain words, never the answer) and an `explanation` (one line why). `type` answers list EVERY acceptable variant (word-order variants, ß/ss, ä/ae only if natural; case and punctuation are ignored by the app, so don't list those).
- vocabulary: **10 per lesson** (allowed 8–12), each with 2 example sentences that use only taught grammar. Nouns: `"article"` and `"plural"` (e.g. `"die Bahnhöfe"`, or `"die Kinos"`; uncountables: leave out `plural`, as ch02 does with Zeit, Musik). Verbs: `"forms"` (e.g. `"isst, hat gegessen"` like ch02). Double-check every noun's gender and plural.
- media: 1–3 `grammarVideos` (keys from `ROOT/content/resources.json` → videos, `ok: true`, level a1 preferred, topic matching the lesson; watch out for titles that teach something else), 1–2 `nicosWeg` (pick episodes whose title/grammar fit), 0–2 `practice` links. Search the json with python; never invent keys.
- minutes: 30 (35 for a heavy lesson). printedPages: per lesson, inside the chapter's printed range (page numbers only; NEVER copy any text or exercise from the Netzwerk books; all German is your own).
- Skill day per learn day: reading 90–130 words (A1 rule 80–140) with glossary for every word not yet taught; 10 reading + 10 listening questions answerable only from the text; listening `script` is a dialogue with labelled speakers (`Mira: …`); writing: 10 guided items (complete / build / transform) + `free` (prompt, `minWords` 15–40, a model answer longer than minWords, 3–4 regex `checks` with plain labels). Use only grammar and words taught up to that day.
- speaking: 3 prompts + 2–3 model answers.

## Hard rules
- **Teach before you test.** Every form, ending, word-order rule or word that a drill, check, blind, retrieval, skill question OR hint relies on must be taught in a card of this lesson or an earlier one (or be in the taught list). Fixed phrases whose grammar comes later (e.g. `mit dem Bus`, `im Januar`, `zum Bahnhof`) are taught as whole chunks ("learn mit dem Bus as one piece; why it is dem comes in chapter 7") and tested only as chunks.
- Characters only: Mira, Ben, Leon, Anna, Frau Weber, Herr Ali. Never the learner's name. Original content only.
- Plain learner labels: "New sentence on your own", "Practice", "Review". Never "blind", "skill day", "retrieval", "recall" in learner-facing text.
- Colour roles (`parts`, exactly these 16): subject verb verb2 object dative article noun adjective ending question negation time place preposition conjunction other. `verb2` = second verb part at the end (infinitive after a modal, separable prefix). Parts must spell the `de` sentence exactly (the compiler checks). Don't invent roles.
- German must be correct and natural (gender, plural, endings, word order, capitals, Umlauts as single NFC characters). When unsure of a gender/plural, check German Wiktionary (`https://de.wiktionary.org/wiki/<Wort>`) with WebFetch or curl, or choose another word.
- IDs: `a1-cNN-0N` for lessons (n = 1..), `a1-cNN-dK` for skill days.

## How to work (avoid one giant write)
1. Plan the chapter first: write `SP/drafts/chNN/plan.md` (per lesson: title, grammar point, cards list, vocab list; per day: reading/listening topic). Check the plan for teach-before-you-test order.
2. Write each lesson to `SP/drafts/chNN/lesson-NN.json` and each skill day to `SP/drafts/chNN/day-K.json` (one Write per file).
3. Assemble: `python3 SP/assemble.py NN "<chapter title>" <printedFrom> <printedTo>` → writes `ROOT/content/a1/chNN.json` (indent 1, like ch02).
4. Validate ONLY with a temp root (never run the compiler without `--root`, it would overwrite dist/): `bash SP/validate.sh NN`. Fix every error and warning about your file, re-assemble, repeat until clean.
5. Quality self-review: `python3 SP/stats.py ROOT/content/a1/ch02.json ROOT/content/a1/chNN.json`. Every number must be ≥ ch02 (parts must be 100%). Then reread every question and hint against the taught list (teach before you test) and reread all German once more for gender/endings/word order.
6. Do NOT touch: other chapter files, `dist/`, `tools/`, `levels.json`, `resources.json`, git. Do not run `tools/check-german.py` (the orchestrator runs it).

## Your final report (≤ 250 words)
Lesson titles + grammar point per lesson; the stats line for your chapter; chunks you taught ahead of their grammar; any German you are unsure about (exact sentences); anything in the brief you could not meet.

## Answer order
The player does not shuffle choice options. Put the right option at varied positions (about evenly 0/1/2); fixed-order sets like der/die/das may stay in order.

## Introduction card (required, compiler-checked)
`cards[0]` of every lesson is an introduction card with `"intro": true`, written exactly as described in `SP/intro-brief.md` (read it): "Before we start: …" title, a real-life why, steps "You already know: … / New today: … / By the end you can: …" that blend with a named earlier lesson, a known example then a known → new contrast example (both with parts), and an ELI5 `more`. Lesson 1 of a chapter also introduces the chapter. It does not count as a teaching card (still ≥ 5 teaching cards after it).
