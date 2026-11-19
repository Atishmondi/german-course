# Deeper brief: a visible "A bit deeper" block on EVERY teaching card

The learner asked: "how about adding a little more stuff to each lesson like explaining more right there and go just a tad bit in depth?"
Today each teaching card has: lead ("What this card teaches"), body (≤60 words), visual, examples, and a hidden "Explain it more simply" (`more`). Add `deeper`: always visible, shown under the examples with the label "A bit deeper". It goes ONE small step beyond the body: the why behind the rule, a useful detail, a pattern to notice, a common exception at A1 level, how a native would really say it, or a link to English. Not a repeat of body/more/lead.

## Shape
"deeper": {"text": "40–80 words, plain short English, one idea", "example": {"de": "...", "en": "...", "parts": [["Wort","role"], ...]}}
- `example` is required: ONE new German sentence (not already an example on this card) that shows the deeper point. `parts` must spell `de` exactly, token by token like the existing examples on the card (punctuation stays attached to the word, as in the card's examples). Roles only: subject verb verb2 object dative article noun adjective ending question negation time place preposition conjunction other.
- Only grammar and words taught on this card, earlier cards, or earlier lessons/chapters (teach before you test is about questions; here a tiny new word is OK only if you gloss it in the text). Keep it A1-friendly: depth, not difficulty. Never introduce grammar from later chapters as something to learn now; you may say "later you'll see…" in one short phrase at most.
- German must be 100% correct and natural: gender, plural, case endings, verb position, capitals, Umlauts (single NFC characters). When unsure, pick a simpler sentence.
- Characters only Mira, Ben, Leon, Anna, Frau Weber, Herr Ali. Never the learner's name. Never the words blind, skill day, recall, retrieval.
- Vary the angle across cards (why / detail / exception / real-life usage / English link / pronunciation tip). Don't start every text the same way.

## Output
ROOT = /Users/atishmondi/Documents/german/sites/german-current ; SP = /private/tmp/claude-501/-Users-atishmondi-Documents-german/2f9db4c1-24bc-40e8-ae71-583306c22e39/scratchpad
For each chapter you are given, read ROOT/content/a1/chNN.json lesson by lesson (every card in full: title, lead, body, table, examples, more) — read via python/bash, not the Read tool on the whole file.
Write SP/deeper/chNN.json:
{"a1-c03-01": [{"title": "<exact title of cards[1]>", "deeper": {...}}, ...], ...}
One entry per teaching card in order, skipping cards[0] (the intro card). Do NOT edit anything in ROOT. Write per chapter in 2–3 parts if large (e.g. write SP/deeper/chNN.part1.json …, then combine with python into chNN.json).
Then run `python3 SP/merge-deeper.py --check NN` and fix until "clean".
Then reread every `de` sentence once more, slowly, for German correctness.

## Final report (≤150 words)
Counts, check output, 3 samples, and any German sentence you are not 100% sure about (exact text).
