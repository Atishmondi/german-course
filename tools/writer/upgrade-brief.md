# Upgrade brief: bring ONE finished A2 chapter up to the full bar (no compromises)

SP = /private/tmp/claude-501/-Users-atishmondi-Documents-german/473d14d5-8a5f-4097-81e2-41142357e50c/scratchpad
ROOT = /Users/atishmondi/Documents/german/sites/german-current
You edit ONLY ROOT/content/a2/chNN.json, in place, with python (json.load / json.dump(ensure_ascii=False, indent=1)). Never rewrite it another way, never touch other files, no rm, no git.

User's words (binding):
- "MAKE SURE THE QUALITY OF THE WHOLE LEARNING DOESNT DROP. use all the resources and make the ones like chapter 1,2."
- "not js simple expalin the same thing simply but add some depth with all i resources that i provided"
- "i want to you checkt the whole of a2 i dont want any compromises"
- Grammar feels overwhelming but is needed: make it digestible (clear steps, one idea per card), do not remove book grammar.

Read first: SP/writer-brief.md (card format, hard rules), ROOT/active/content-contract.md (schema), the chapter's entry in ROOT/content/a2/inventory.json (chapters[NN-1]), and the chapter's plan SP/drafts/a2-chNN/plan.md or ~/Documents/german/drafts-backup/a2-chNN/plan.md ("Known after lesson N" = what may be used).

Do, lesson by lesson:
1. BOOK COVERAGE: list every inventory item (communication, grammar, vocab, pronunciation, strategy, culture). Each must be really TAUGHT on a card (not only mentioned). If something is missing, add it: extend a card (body/table/steps/examples) or turn a weak card into one that teaches it. Keep 1 intro + 5–7 teaching cards per lesson, body ≤60 words.
2. RESOURCES: every lesson ≥2 fitting `media.grammarVideos` and ≥1 fitting `media.nicosWeg` from ROOT/content/resources.json (python: match by topics/title/level; only ok: true; prefer keys not used anywhere in ROOT/content — grep). Never add a key that doesn't exist.
3. DEPTH:
   - `deeper.text` (40–80 words) must add a REAL new point: exception, contrast, how natives really say it, register, culture. If it repeats the body, rewrite it. Keep/fix `deeper.example` with parts.
   - `more` = 65–90 words, a NEW angle (picture, comparison with English, everyday scene), never a shorter copy of the body. Rewrite every `more` under 60 words.
4. QUESTIONS: no giveaways (expected answer must not equal the bracket hint or appear in the prompt; wir/sie/Sie form = infinitive → give an English meaning hint instead; choice: right option not copied in prompt). Run `python3 ROOT/tools/giveaways.py ROOT/content/a2/chNN.json` → 0. Every question tests only what was taught before it. Choice answers spread over positions.
5. GERMAN REVIEW (MANDATORY, line by line — dump every German string of the chapter with python and READ each one; tool checks alone are not enough; also check every deeper.example matches its deeper.text and every English translation matches): every German string natural and correct (gender, plural, endings, word order, Umlauts), English matches, facts true. House style: characters only Mira, Ben, Leon, Anna, Frau Weber, Herr Ali (genitive "Herrn Alis"); "im Restaurant „Zum Löwen“"; letter greetings WITH comma ("Liebe Frau Weber," newline lowercase), closings WITHOUT comma; nouns with article in card text; formal Sie with Frau Weber / Herr Ali as the chapter already does; no capitals for stress inside German strings.
6. COLOURS: `parts` must still spell `de` exactly after edits (chips joined by spaces; `ending` chips join onto the adjective without space). Roles only from the existing set; grammar colours are LOCKED.

Then from ROOT run: `python3 compile-course.py --partial` (must succeed), `LEVEL=a2 bash SP/validate.sh NN`, `python3 tools/giveaways.py content/a2/chNN.json`, and `python3 tools/check-german.py content/a2/chNN.json` (fix flags; true false alarms → one word per line in tools/german-ok.txt is the ONLY other file you may edit).

Report ≤200 words: per-lesson media counts before → after, inventory items you added, number of `more`/`deeper` rewritten, German fixes (most important before → after), anything you could not do.
