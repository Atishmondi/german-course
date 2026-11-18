# Full A1 content asset contract

User: complete beginner, ADHD, pure BLACK UI, sequential day-grouped lessons. Five weeks/35 days. Teach the supplied Netzwerk neu A1 book's full learning scope inside the app. Every lesson must learn twice with >=2 explained examples EACH pass, >=3 drills, reading + writing, then a NEW blind transfer sentence. Original examples and passages; do not copy textbook exercises. Precise finite goals, no mentions masquerading as teaching. No personal names Atish/Mondi anywhere in authored content. Default characters Mira, Ben, Leon, Anna.

Source: user-supplied 176-page PDF /Users/atishmondi/Documents/german/five-week-sources/Netzwerk_neu_A1.pdf. Every PDF page is rendered as /Users/atishmondi/Documents/german/five-week-sources/pages/page-NNN.jpg (PDF page is printed page +1). Read source images with view_image. TOC pages005–008; relevant chapter pages below. Supporting primary publisher plans: https://www.klett.cz/uploads/66fd3d2a5dead-netzwerk-neu_a1-1_stoffverteilung.pdf and https://www.klett.cz/uploads/66fd3da87ae63-netzwerk-neu_a1-2_stoffverteilung.pdf. The split-volume page numbers differ; use supplied full-book printed numbers for mappings.

Write one JSON file containing exactly 24 lesson records, six per assigned chapter. Each chapter's first three lessons part:1, next three part:2. IDs c01-01 … c12-06. Cover all assigned chapter concepts, communicative goals, pronunciation, strategy and vocabulary categories across six lessons (references can support subtopics). Existing 34 foundational grammar lessons remain as additional reference, but new assets must not rely on opening them or an external PDF to explain core chapter content.

Each record schema (JSON, no code):

```
{
 "id":"c01-01", "chapter":1, "part":1,
 "title":"…", "goal":"one practical outcome", "minutes":15,
 "objectives":[{"category":"grammar|function|vocabulary|pronunciation|strategy|culture","title":"specific taught skill"}],
 "prerequisites":[], "pages":[8,17],
 "cards":[{"title":"…","body":"25–65 plain-English words, explain terms first","examples":[{"de":"…","en":"…","why":"precise explanation"},{"de":"…","en":"…","why":"…"}]}, {"title":"same concept explained again differently","body":"…","examples":[{"de":"…","en":"…","why":"…"},{"de":"…","en":"…","why":"…"}]}],
 "references":[{"title":"useful complete paradigm/table/list","headers":["…"],"rows":[["…"]],"note":"plain English with two short explained examples if adding a new rule"}],
 "terms":[{"term":"…","meaning":"…"},{"term":"…","meaning":"…"}],
 "watch":"one precise common error",
 "practice":[{"type":"choice","prompt":"…","options":["…","…","…"],"answer":0,"explanation":"why"}, {"type":"build","prompt":"…","tokens":["scrambled","tokens"],"answer":["correct","tokens"],"explanation":"why"}, {"type":"type","prompt":"complete a small phrase","answers":["…"],"hint":"help","explanation":"why"}],
 "blind":{"type":"type","prompt":"fresh transfer, explicitly state requested detail/form","answers":["accepted sentence","valid alternate if needed"],"explanation":"why"},
 "retrieval":[{"type":"type","prompt":"different taught-pattern transfer for later recall","answers":["…"],"explanation":"…"},{"type":"type","prompt":"another variant","answers":["…"],"explanation":"…"},{"type":"type","prompt":"third variant","answers":["…"],"explanation":"…"}],
 "reading":{"title":"…","text":"35–65 German words, new situation","translation":"complete accurate English","questions":[{"type":"choice","prompt":"meaning question","options":["…","…","…"],"answer":0,"explanation":"specific evidence"},"3 questions total"],"glossary":[{"de":"…","en":"…"}]},
 "listening":{"title":"…","text":"different original dialogue/announcement, 25–50 German words","translation":"…","questions":["3 complete choice objects with explanation as reading"]},
 "writing":{"type":"writing","prompt":"fixed short scenario, 1–2 sentences; state requested forms/details so exact checks are fair","answers":["model","alternate wording if valid"],"checks":[],"model":"same as accepted canonical answer","hint":"specific useful help","explanation":"why target works"},
 "speaking":{"prompts":["three concrete short conversational tasks"],"examples":[{"de":"spoken model","en":"…","why":"…"},{"de":"second model","en":"…","why":"…"}],"rubric":["3 observable self-checks"]},
 "vocabulary":[{"de":"lemma or useful phrase WITHOUT noun article","article":"der/die/das or empty","plural":"full noun plural or Sg. or empty","en":"meaning","forms":"useful verb forms if relevant","examples":[{"de":"short contextual sentence","en":"…"},{"de":"another contextual sentence","en":"…"}]}]
}
```

Minimum eight useful vocabulary entries per record (more where necessary); 2 examples per word; nouns with article/plural; verbs useful present/past forms. Teach finite sets in reference tables: all weekdays/months/number patterns, modal paradigms, pronouns, relevant prepositions, etc. Include simple diagram-ready word order examples as ordinary sentences. No hidden unintroduced grammar in blind/retrieval. Keep clauses short. Alternative correct answers supported explicitly where natural. Use NFC German umlauts. Do not accept unrelated answers. Use 3 drills exactly; compiler adds reading/writing to main flow. Put pronunciation contrasts and learning strategies into actual explanations, examples and references, not only objective labels. Basic regional culture: use source facts in original mini-readings, without copied passages.

Write the complete JSON directly to your assigned file. Validate JSON and required fields with Python/node. Do not change any app/compiler/schema files. Return lesson count, vocabulary count, objectives covered, source pages inspected, and genuine remaining gaps. Never claim full scope based on counts alone.
