# Visual polish plan (execute after the 5h reset)

Skills: design-taste-frontend (redesign, preserve mode) + dataviz. **Looks only.** Never touch `content/`, `dist/full-content.js`, lesson/question text, or any learner-facing wording. Files in scope: `dist/styles.css`, `dist/lesson.css`, and markup/class changes in `dist/app.js` (Progress, Chapters, Grammar, Words, Settings screens) and `dist/lesson.js` only where a class or wrapper is needed.

**Design read:** a calm, focused study app for one adult learner with ADHD who studies on a laptop. The visual language is dark and premium (Apple-like), keeping the existing tokens. Dials: VARIANCE 4, MOTION 3, DENSITY 4 (a calm app, not a landing page).

## Locked (do not change)
- UPDATE (user, 2026-11-19): the black background and the amber accent MAY change. Pick a good dark-theme palette: an off-black base (not pure #000), layered surfaces, and one refined accent. Validate contrast (text AA/AAA, accent on surface) and keep it distinct from the locked grammar colours. Liquid glass on top bar / lesson nav / toasts stays.
- Grammar colours: `--m --f --n --pl` and all 16 `--r-*` role chips.
- Fonts: Figtree + Bricolage Grotesque.
- Routes, nav labels, IDs, localStorage keys.

## Audit findings
1. **Radius drift:** the CSS uses 14px (`--radius`), 12px, 10px, 8px, 4px, 999px and 99px. Lock this system: cards = `--radius` (14px), inner chips/inputs = 10px, interactive pills/buttons = 999px. Replace stray 12px/8px/99px values.
2. **Blue glow in the body background** (`rgba(86,120,230,.07)`): this is the generic AI blue tell, and it clashes with the warm accent. Remove it and keep only the faint amber corner glow, or none.
3. **Progress page:**
   - The 6 stat tiles are equal boxes in 2 uneven rows, and the 4th tile clips at narrow widths.
   - The "By level" bars have filled background tracks (a dataviz anti-pattern).
   - The weekly chart has no hover tooltips, and its bars use `--ok` green, which is a status colour, not series identity.
4. **Cards everywhere:** many sections are boxed (`.card`) where spacing alone would do. Keep cards only for real elevation: the Home focal card, lesson cards, and Grammar tables.
5. **Eyebrows:** uppercase micro-labels repeat on Grammar groups and the Home "Where you learn it" list. Ration them to about 1 in 3 sections.
6. **Middle-dot separators (·)** in breadcrumbs and links: ration them to 1 per line.

## Changes, in order (stop if the budget runs low; push after each)
1. **Tokens and shape lock** (styles.css + lesson.css):
   - Normalise radii to the three-step system.
   - Remove the blue body glow.
   - Add a type scale: h1 2.4rem/-0.025em, h2 1.4rem/-0.015em, body 1rem/1.55, small .875rem.
   - Add a spacing scale on rem steps (8/12/16/24/32/48).
2. **Progress page (dataviz):**
   - Hero number row: days done, as one big number with "of 156" muted.
   - Then 3 secondary figures in a single line (lessons, answers right %, words seen). Streak and answers given become a quiet line.
   - Weekly chart:
     - Single-series bars in `--accent` (sequential, one hue), with a muted outline-only zero state.
     - 4px rounded tops anchored to the baseline and a 2px gap between bars.
     - The current week gets an accent ring, not a bold stroke.
     - Recessive axis: week numbers every 4 weeks in `--muted`.
     - A hover tooltip per bar ("Week 7: 4 of 6 days"); the existing `<title>` stays for accessibility.
     - A visually hidden table with the same data.
   - "By level": replace the track bars with a number plus a thin inline bar without a filled track.
   - Run `validate_palette.js` on `#f2b866` against `#000` (dark mode) before shipping.
3. **Chapters page:**
   - Chapter rows become clean disclosure rows with no box per day: the number in a 32px circle, then title and progress text.
   - Day rows use spacing and one hairline per group instead of borders on every row.
   - The status pills (Today / Done / Locked) keep their colours and text.
4. **Grammar page:**
   - The core table cards keep their box (real elevation), with less inner padding noise.
   - Ration group eyebrows.
   - The "Where you learn it" list becomes link rows with an arrow and no eyebrow.
   - The level segmented control gets the same 999px pill as the buttons.
5. **Words and Settings:** apply the shared tokens only, with no layout change.
6. **Lesson player** (lesson.css, looks only):
   - Unify the box radii of the card visuals, the lead box, the "A bit deeper" box and the mistake box.
   - Make spacing between the stacked boxes consistent.
   - Keep the chip colours.
7. **Motion:** only what is motivated:
   - press feedback (`:active` scale .97) on all buttons;
   - a 150ms colour/opacity transition on links;
   - page content fades in at 200ms on route change.

   Everything honours `prefers-reduced-motion`.
8. **Pre-flight:**
   - no em-dashes in any new UI string;
   - button contrast AA;
   - no CTA wraps at 1280px;
   - check at 1280 and 1600 widths;
   - console clean;
   - 4 tests + compile pass;
   - visit Home, Chapters, a lesson card, Grammar, Progress, Words and Settings.

## Verify and ship
Compile (this restamps the cache hashes), run the 4 tests, do the browser pass above and take screenshots. Restore `position.day` and the study-time entry afterwards, then commit and push.
