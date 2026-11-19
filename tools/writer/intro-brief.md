# Intro brief: an introduction card for every lesson

Project ROOT: /Users/atishmondi/Documents/german/sites/german-current. The learner said: "you are jumping into the teaching right away … add an introduction to all the lessons and blend it with the current stuff (don't edit current stuff)". Quality rule (user's words): "MAKE SURE THE QUALITY OF THE WHOLE LEARNING DOESNT DROP."

Load the `eli5` skill first. Read ROOT/active/content-contract.md (card format) and, for context, run `python3 SP/taught.py ROOT/content/a1/ch01.json … chNN.json` (SP = /private/tmp/claude-501/-Users-atishmondi-Documents-german/2f9db4c1-24bc-40e8-ae71-583306c22e39/scratchpad). Then read EVERY lesson of your chapters in full (cards, grammar, goal) before writing its intro.

## What to write
For each lesson, ONE intro card. It is inserted before the existing cards; never edit the existing lesson. The card is the friendly "here is where we are going" moment: a beginner with ADHD should feel oriented and curious, not tested.
```json
{"intro": true,
 "title": "Before we start: <the topic in plain words>",
 "body": "≤ 60 words, plain short English: a real-life moment where you need this today (ordering in a café, asking the way …), and how it grows out of what you already know.",
 "steps": ["You already know: <a concrete thing from an EARLIER lesson, named, e.g. 'der, die, das from chapter 2'>",
           "New today: <the one new idea, in plain words>",
           "By the end you can: <a concrete can-do sentence>"],
 "examples": [
   {"de": "<a sentence the learner ALREADY knows>", "en": "…", "why": "You know this already.", "parts": [[…,"role"],…]},
   {"de": "<the same kind of sentence with today's new thing>", "en": "…", "why": "New today: <what changed>", "parts": [[…,"role"],…]}
   // optional third example
 ],
 "more": "60–120 words, ELI5: the big picture of the lesson as a story or everyday comparison (a map, a toolbox, building with blocks), why German works this way, and a calm 'you will learn this step by step in the next cards'."}
```
Rules:
- Blend: the "You already know" step and the first example must point at something specific the learner really learned earlier (this chapter or earlier chapters; for a1-c01-01 the very first lesson, "You already know" can be English sentence order / that German shares words with English). The second example shows the contrast known → new.
- Lesson 1 of each chapter also introduces the chapter: its theme and what the chapter's days will cover, in one sentence of the body.
- Use only German that the lesson itself teaches or earlier lessons taught; the new-today example must use the lesson's own grammar point exactly as its cards teach it (same forms, same words where possible). No new vocabulary.
- `parts` must spell `de` exactly; 16 roles only: subject verb verb2 object dative article noun adjective ending question negation time place preposition conjunction other. Match the role choices the lesson's own cards use.
- Plain learner labels (never "blind", "skill day", "retrieval"). Characters: Mira, Ben, Leon, Anna, Frau Weber, Herr Ali.
- German must be correct and natural.

## Output
Write `SP/intros/chNN.json` per chapter: `{"a1-cNN-01": {card}, "a1-cNN-02": {card}, …}` covering every lesson. Then run `python3 SP/merge-intros.py --check NN` (validates without writing) and fix until clean. Do NOT edit content/ files yourself; do not touch git, dist or tools.
Final report ≤ 120 words: lessons covered, anything unsure (exact German).
