# Part writer brief: write 3 lessons + 1 skill day of a chapter, following its binding plan

SP = /private/tmp/claude-501/-Users-atishmondi-Documents-german/2f9db4c1-24bc-40e8-ae71-583306c22e39/scratchpad, ROOT = /Users/atishmondi/Documents/german/sites/german-current.
1. Read SP/writer-brief.md completely and do its "Before writing" reading (eli5 skill, CLAUDE.md, contract, compiler checks, ch02 model lessons, taught.py on ch01–ch08). Also read SP/intro-brief.md, the "What a lead says" section of SP/lead-brief.md, and the "Shape" section of SP/deeper-brief.md. Every lesson needs: intro card first, then 5–7 teaching cards, EACH with "lead" and "deeper".
2. Read the chapter's binding plan SP/drafts/chNN/plan.md. Follow it exactly for YOUR lessons (titles, cards, vocab, media). Everything in "Known after lesson N" for lessons before yours counts as taught; nothing else from this chapter does.
3. Write ONLY your files: SP/drafts/chNN/lesson-0N.json (one Write per lesson) and SP/drafts/chNN/day-K.json. Never write other writers' files, never assemble, never touch ROOT.
4. Validate your files alone: `python3 SP/validate-part.py NN <your lesson numbers> <your day>` (e.g. `python3 SP/validate-part.py 09 1 2 3 d1`). Fix until it shows no errors for your files.
5. Self-review: reread all German (gender, plural, endings, word order, Umlauts), teach-before-you-test, answer positions varied (right choice not always first), parts on every example.
Final report (≤200 words): lesson titles, stats (cards/lesson, questions), chunks taught ahead of grammar, any German you're unsure about (exact sentences).
