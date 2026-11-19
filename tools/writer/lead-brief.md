# Lead brief: a short introduction at the top of EVERY teaching card

The learner said: "all the cards in learn of each lesson have same introduction but what i want is introduction to what u are going to teach in each learn card".
So every teaching card (every card except `cards[0]`, which is the lesson's `"intro": true` card) gets a `lead`: 1–2 short sentences shown at the top of that card, under the label **"What this card teaches"**, before the body. It prepares the learner for THIS card.

## What a lead says (15–40 words, plain short English, ADHD-friendly)
1. A bridge from what came just before: the previous card, or for the first teaching card the lesson intro / an earlier lesson. ("You just saw …", "So far you can …", "In lesson 2 you learned …")
2. What this card will teach, in learner words, and why it helps in real life. ("On this card: … so you can …", "Next: …")
- Name the actual thing (the word, ending, rule) the card teaches. Never vague ("we learn something new").
- Do NOT repeat the card's title or body word for word, and do NOT give the full rule away (the body teaches it). The lead is the "here is where we are going" moment.
- German words only if they appear on this card or earlier cards/lessons (teach before you test). Write German words plainly, e.g. kein, keine, ich bin.
- Vary the wording across cards; don't start every lead with the same phrase.
- Never the words blind, skill day, recall, retrieval. Characters only Mira, Ben, Leon, Anna, Frau Weber, Herr Ali. Never the learner's name.
- Last teaching card of a lesson may say it pulls things together / is the last step, if true.

Example (ch03 lesson "kein, keine", card "kein for der-words and das-words", after the intro card):
"In the introduction you saw that kein means not a. On this card: how ein turns into kein for der-words and das-words, so you can say a place is not there."

## Output
For each chapter you are given, read `ROOT/content/a1/chNN.json` (ROOT = /Users/atishmondi/Documents/german/sites/german-current) lesson by lesson, every card in full (title, body, steps, table, examples), plus earlier chapters only as needed for bridges.
Write `SP/leads/chNN.json` (SP = /private/tmp/claude-501/-Users-atishmondi-Documents-german/2f9db4c1-24bc-40e8-ae71-583306c22e39/scratchpad):
{"a1-c03-01": [{"title": "<exact title of cards[1]>", "lead": "..."}, {"title": "<exact title of cards[2]>", "lead": "..."}, ...], "a1-c03-02": [...], ...}
One entry per teaching card, in order, skipping cards[0]. Titles must match exactly (a script checks). Do NOT edit any chapter file or anything in ROOT.
Then run `python3 SP/merge-leads.py --check NN` for each chapter and fix until it prints "clean".

## Final report (≤120 words)
Count of leads per chapter, the check output, and 3 sample leads.
