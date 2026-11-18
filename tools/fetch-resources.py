#!/usr/bin/env python3
"""Build content/resources.json: verified free German-learning media catalog. Stdlib only."""
import json, re, sys, time, datetime, html, urllib.request, urllib.parse
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "content" / "resources.json"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": "en"}
failed_sources = []

def get(url, tries=3):
    """Return (status, body) ; status 0 on failure."""
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return r.status, r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code in (404, 410): return e.code, ""
            err = e.code
        except Exception as e:
            err = e
        time.sleep(1 + i)
    return 0, ""

def check(url, body=False):
    """HEAD-ish check: GET but don't need body (PDFs are small enough)."""
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                r.read(1024); return r.status == 200
        except Exception:
            time.sleep(1)
    return False

# ---- topic tagging: key -> regex over lowercase title/grammar text
T = {
 "present-tense": r"present tense|präsens|conjugat|konjugation|verb ending",
 "sein-haben": r"\bsein\b|\bhaben\b|\bto be\b|to have",
 "w-questions": r"w-frage|w-question|question words|wer,? was|wo,? wie|\bfragewort",
 "yes-no-questions": r"yes.?no question|ja.?nein.?frage",
 "word-order-v2": r"word order|wortstellung|position 2|verb position|satzbau|sentence structure|main clause|hauptsatz",
 "articles-definite": r"definite article|bestimmte[rn]? artikel|der,? die,? das|\bder die das\b",
 "articles-indefinite": r"indefinite article|unbestimmte[rn]? artikel|ein,? eine|\bein/eine",
 "plural": r"plural|mehrzahl",
 "negation-kein-nicht": r"negation|\bkein\b|\bnicht\b|verneinung|negative",
 "accusative": r"accusative|akkusativ",
 "dative": r"dative|dativ",
 "genitive": r"genitive|genitiv",
 "n-declension": r"n-declension|n-deklination|weak noun",
 "personal-pronouns": r"personal pronoun|personalpronom|pronouns?\b|pronomen",
 "possessives": r"possessive|possessiv|mein,? dein|\bmein\b",
 "modal-verbs": r"modal verb|modalverb|können|müssen|dürfen|wollen|sollen|mögen|möchten|\bcan\b.*\bmust\b",
 "separable-verbs": r"separable|trennbar|inseparable|untrennbar",
 "imperative": r"imperativ|command|bitte!",
 "prepositions-accusative": r"prepositions? with (the )?accusative|accusative prepositions|präpositionen mit akkusativ|durch, für|für, gegen|bis, durch",
 "prepositions-dative": r"prepositions? with (the )?dative|dative prepositions|präpositionen mit dativ|aus, bei, mit|mit, nach|seit, von",
 "two-way-prepositions": r"two-way|wechselpräposition|an, auf, in|wohin.*wo\b|wo oder wohin|location or direction",
 "time-expressions": r"time expression|temporal|zeitangabe|\bseit\b|\bvor\b.*\bnach\b|days of the week|months|weekday|wochentag|\bam,? um\b|\bin,? am\b|dates?\b|datum|\bwhen\b.*\bday",
 "numbers-time": r"numbers?\b|zahlen|uhrzeit|telling time|clock|\btime\b|\buhr\b|spelling.*number",
 "perfekt": r"perfekt|present perfect|perfect tense|past participle|partizip ii|partizip perfekt|haben oder sein",
 "praeteritum": r"präteritum|simple past|preterite|imperfect|past tense|\bwar\b.*\bhatte\b",
 "plusquamperfekt": r"plusquamperfekt|past perfect|pluperfect",
 "futur": r"futur|future tense|\bwerden\b.*future|will\b.*future",
 "reflexive-verbs": r"reflexive|reflexiv|\bsich\b",
 "adjective-endings": r"adjective ending|adjektivdeklination|adjektivendung|adjective declension|declin.*adjective|adjectives?\b|adjektive",
 "comparative-superlative": r"comparative|superlative|komparativ|steigerung|compar",
 "subordinate-weil-dass": r"\bweil\b|\bdass\b|subordinate|nebensatz|subordinating|\bda\b.*weil|conjunctions?|konjunktion",
 "wenn-als": r"\bwenn\b|\bals\b.*\bwenn\b|wenn oder als",
 "ob-indirect-questions": r"\bob\b|indirect question|indirekte frage",
 "relative-clauses": r"relative clause|relativsatz|relativpronom|relative pronoun",
 "konjunktiv-ii": r"konjunktiv|subjunctive|würde|hätte|wäre|wishes? and|polite request|hypothetical",
 "passive": r"passiv|passive voice|vorgangspassiv|zustandspassiv",
 "zu-infinitive": r"zu.?infinitiv|infinitive with zu|infinitiv mit zu|\bzu\b.*infinitive",
 "um-zu-damit": r"\bum\b.{0,6}\bzu\b|damit|um...zu",
 "verbs-with-prepositions": r"verbs? with prepositions?|verben mit präposition|prepositional verb|verb.?preposition",
 "da-wo-words": r"\bda[-\s]?compounds?|pronominaladverb|\bdafür\b|\bdarauf\b|\bwomit\b|wo-?compounds?|\bdamit\b.*\bwomit\b|\bdavon\b",
 "connectors-deshalb-trotzdem": r"deshalb|trotzdem|darum|deswegen|therefore|nevertheless|connectors?|adverbial conjunction|konnektor",
 "two-part-connectors": r"two-part|zweiteilig|entweder|weder|sowohl|nicht nur|einerseits|either.*or|neither",
 "je-desto": r"\bje\b.*\bdesto\b|je\s*[.…]+\s*desto|je.{0,3}umso",
 "nicht-position": r"position of nicht|nicht position|where to put nicht|stellung von nicht",
 "lassen": r"\blassen\b|\blässt\b",
 "participles-as-adjectives": r"participle.{0,20}adjective|partizip.{0,20}adjektiv|partizip i\b|present participle|laufend",
 "modal-particles": r"modal particle|modalpartikel|\bdoch\b|\bmal\b|\bja\b.*\beben\b|\bhalt\b|\beigentlich\b|\bschon\b",
 "pronunciation": r"pronunciation|aussprache|phonetic|umlaut|\bsounds?\b|\bch\b|accent|intonation|alphabet|spelling|buchstabier",
 "vocabulary": r"vocabulary|vokabel|wortschatz|words?\b|wortliste|\bword list\b|phrases|colou?rs|food|family|weather|clothes|\bhouse\b|body parts",
 "listening-everyday": r"slow german|super easy german|dialogue|dialog|in the street|interview|conversation|everyday|listening|hörverstehen|nachrichten|news|street interviews|alltag",
}
T = {k: re.compile(v, re.I) for k, v in T.items()}

def tag(text):
    return [k for k, rx in T.items() if rx.search(text)]

A1_TOPICS = {"present-tense","sein-haben","w-questions","yes-no-questions","word-order-v2","articles-definite","articles-indefinite","plural","negation-kein-nicht","accusative","personal-pronouns","possessives","modal-verbs","separable-verbs","imperative","numbers-time"}
A2_TOPICS = {"dative","perfekt","praeteritum","reflexive-verbs","comparative-superlative","subordinate-weil-dass","wenn-als","prepositions-accusative","prepositions-dative","two-way-prepositions","adjective-endings","time-expressions","connectors-deshalb-trotzdem","ob-indirect-questions","verbs-with-prepositions"}
def guess_level(base, topics):
    if base: return base
    if any(t not in A1_TOPICS | A2_TOPICS for t in topics if t not in ("vocabulary","pronunciation","listening-everyday")): return "b1"
    if any(t in A2_TOPICS for t in topics): return "a2"
    return "a1"

# ---- 1. Nicos Weg
NW = {"a1": "https://learngerman.dw.com/en/nicos-weg/c-36519789",
      "a2": "https://learngerman.dw.com/en/nicos-weg/c-36519797",
      "b1": "https://learngerman.dw.com/de/nicos-weg/c-36519718"}
def clean(s): return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()

def nicos():
    out = {}
    for lvl, url in NW.items():
        st, body = get(url)
        if not body: failed_sources.append("nicos " + lvl); continue
        seen, n = set(), 0
        for m in re.finditer(r'<a [^>]*href="([^"]*/l-\d+[^"]*)"[^>]*>(.*?)</a>', body, re.S):
            href, inner = m.group(1), m.group(2)
            if href in seen: continue
            seen.add(href); n += 1
            h3 = re.search(r"<h3[^>]*>(.*?)</h3>", inner, re.S)
            spans = [clean(s) for s in re.findall(r'<span[^>]*>(.*?)</span>', inner, re.S)]
            rec = {"level": lvl, "n": n}
            if h3:
                rec["title"] = clean(h3.group(1)); rec["topic"] = spans[0] if spans else ""; rec["grammar"] = spans[1] if len(spans) > 1 else ""
            else:
                rec["title"] = ""; rec["label"] = clean(inner)
            rec["url"] = urllib.parse.urljoin(url, href)
            rec["topics"] = tag(" ".join([rec.get("topic", ""), rec.get("grammar", ""), rec.get("label", "")]))
            out[f"nw:{lvl}-{n:02d}"] = rec
        print(f"nicos {lvl}: {n}", file=sys.stderr)
    for r in out.values():  # no per-lesson fetch (polite); the course page listed it, so reachability follows from it
        r["ok"] = True
    return out

# ---- 2. YouTube
PL = {  # id: (name, channel, base level)
 "PLYzp2xhTw9W1NtV8VncZ4-sB55f7TZub6": ("anja-grammar", "anja", None),
 "PLYzp2xhTw9W1Xfjp8_0oxsULeUw5g80TH": ("anja-4-cases", "anja", None),
 "PLYzp2xhTw9W30VaIJfY7tlVXvNJ384Epg": ("anja-reflexive", "anja", "a2"),
 "PLYzp2xhTw9W0jQiqyc2sGk8m0lESN9Ck9": ("anja-two-way-prepositions", "anja", "a2"),
 "PLYzp2xhTw9W1s235dm4ivkPLplaMckaGz": ("anja-a2", "anja", "a2"),
 "PLYzp2xhTw9W1Z9RvnCoveC0W7pkwUMHXy": ("anja-a1", "anja", "a1"),
 "PLYzp2xhTw9W03nqxJvwMM1ZgrJlyRE2Kj": ("anja-modal-particles", "anja", "b1"),
 "PLYzp2xhTw9W0xYYdHGGR6D2e6nTKLVL_K": ("anja-pronunciation", "anja", "a1"),
 "PLk1fjOl39-52ihy3oEHgb6-fI7o5rOww8": ("eg-grammar", "easygerman", None),
 "PLk1fjOl39-53GxQIn1Hxdouokf0J0SDpl": ("eg-super-easy", "easygerman", "a1"),
 "PLk1fjOl39-53Sy0xxIHKnQoZLHWb8rbl9": ("eg-slow-german", "easygerman", "b1"),
 "PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg": ("eg-a1", "easygerman", "a1"),
 "PLk1fjOl39-5201BUdhtOM_x23poNvLouT": ("eg-a2", "easygerman", "a2"),
 "PLk1fjOl39-53yooogv6RaJAK29mx7nz1d": ("eg-b1", "easygerman", "b1"),
}
SEARCH = [("https://www.youtube.com/@EasyGerman/search?query=Konjunktiv", "easygerman", "eg-search-konjunktiv"),
          ("https://www.youtube.com/@LearnGermanwithAnja/search?query=Konjunktiv", "anja", "anja-search-konjunktiv")]

def yt_items(url):
    for _ in range(3):  # YouTube sometimes serves a page without data
        st, body = get(url)
        m = re.search(r"var ytInitialData = (.*?);</script>", body, re.S)
        if m: break
        time.sleep(2)
    if not m: return None
    data = json.loads(m.group(1)); found = []
    def walk(o):
        if isinstance(o, dict):
            if "lockupViewModel" in o:
                l = o["lockupViewModel"]; cid = l.get("contentId", "")
                t = l.get("metadata", {}).get("lockupMetadataViewModel", {}).get("title", {}).get("content")
                if len(cid) == 11 and t and l.get("contentType", "LOCKUP_CONTENT_TYPE_VIDEO").endswith("VIDEO"): found.append((cid, t))
            for k in ("playlistVideoRenderer", "videoRenderer"):
                if k in o:
                    v = o[k]; r = v.get("title", {}).get("runs")
                    if v.get("videoId") and r: found.append((v["videoId"], r[0]["text"]))
            for v in o.values(): walk(v)
        elif isinstance(o, list):
            for v in o: walk(v)
    walk(data)
    return found

def videos():
    vids = {}
    def add(vid, title, ch, pl, base):
        k = "yt:" + vid
        if k in vids:
            if pl not in vids[k]["playlists"]: vids[k]["playlists"].append(pl)
            return
        vids[k] = {"yt": vid, "title": title, "channel": ch, "playlists": [pl], "_base": base}
    for pid, (name, ch, base) in PL.items():
        items = yt_items(f"https://www.youtube.com/playlist?list={pid}")
        if not items: failed_sources.append("playlist " + name); continue
        print(f"{name}: {len(items)}", file=sys.stderr)
        for vid, t in items: add(vid, t, ch, name, base)
    for url, ch, name in SEARCH:
        items = yt_items(url)
        if items is None: failed_sources.append("search " + name); continue
        for vid, t in items:
            if re.search(r"konjunktiv|subjunctive|würde|hätte|wäre", t, re.I): add(vid, t, ch, name, None)
    for i, v in enumerate(vids.values()):
        base = v.pop("_base")
        v["topics"] = tag(v["title"])
        if "eg-search-konjunktiv" in v["playlists"] or "anja-search-konjunktiv" in v["playlists"]:
            v["topics"] = sorted(set(v["topics"]) | {"konjunktiv-ii"}, key=list(T).index)
        v["level"] = "b1" if "konjunktiv-ii" in v["topics"] and not base else guess_level(base, v["topics"])
        # explicit level words in title win
        m = re.search(r"\b(A1|A2|B1|B2|C1)\b", v["title"])
        if m: v["level"] = "b2+" if m.group(1) in ("B2", "C1") else m.group(1).lower()
        u = urllib.parse.quote(f"https://www.youtube.com/watch?v={v['yt']}", safe="")
        st, _ = get(f"https://www.youtube.com/oembed?url={u}&format=json", tries=2)
        v["ok"] = st == 200
        time.sleep(0.2)
        if i % 50 == 0: print(f"oembed {i}/{len(vids)}", file=sys.stderr)
    return vids

# ---- 3. links
LINKS = [("lingolia", "https://deutsch.lingolia.com/en/grammar", "Lingolia German grammar", "lingolia", "a1-b2"),
 ("schubert-aufgaben", "https://www.schubert-verlag.de/aufgaben/", "Schubert Verlag exercises", "schubert", "a1-b1"),
 ("grammatiktraining", "https://grammatiktraining.de/", "Grammatiktraining.de", "grammatiktraining", "a1-b1"),
 ("nthuleen", "https://nthuleen.com/teach/grammar.html", "Nthuleen grammar", "nthuleen", "a1-b1"),
 ("goethe-dfd", "https://www.goethe.de/prj/dfd/m/welcome", "Goethe Deutsch für Dich", "goethe", "a1-b1"),
 ("nachrichtenleicht", "https://www.nachrichtenleicht.de/", "Nachrichtenleicht (simple news)", "nachrichtenleicht", "a2-b1"),
 ("dw-deutschtrainer", "https://learngerman.dw.com/en/deutschtrainer/c-56705009", "DW Deutschtrainer", "dw", "a1-a2"),
 ("goethe-exams", "https://www.goethe.de/en/spr/prf/vor.html", "Goethe practice exams", "goethe", "a1-b1"),
 ("goethe-a2-wortliste", "https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_A2_Wortliste.pdf", "Goethe-Zertifikat A2 word list (PDF)", "goethe", "a2")]

def links():
    out = {}
    for slug, url, title, site, lvl in LINKS:
        out["link:" + slug] = {"title": title, "url": url, "site": site, "level": lvl,
                               "topics": tag(title) if slug not in ("goethe-exams", "lingolia") else [], "ok": check(url)}
    st, body = get("https://deutsch.lingolia.com/en/grammar")
    if not body: failed_sources.append("lingolia index"); return out
    seen = set()
    for m in re.finditer(r'<a [^>]*href="(/en/grammar/[^"#?]+)"[^>]*>(.*?)</a>', body, re.S):
        href, t = m.group(1).rstrip("/"), clean(m.group(2))
        t = re.sub(r"\s+", " ", t)
        if href in seen or not t or href == "/en/grammar": continue
        seen.add(href)
        slug = "lingolia-" + href[len("/en/grammar/"):].replace("/", "-")
        out["link:" + slug] = {"title": t, "url": "https://deutsch.lingolia.com" + href, "site": "lingolia",
                               "level": "a1-b2", "topics": tag(t + " " + href.replace("-", " ")), "ok": check("https://deutsch.lingolia.com" + href)}
        time.sleep(0.2)
    print(f"lingolia topic pages: {len(seen)}", file=sys.stderr)
    return out

def main():
    nw, vd, lk = nicos(), videos(), links()
    gaps = [k for k in T if not any(k in v["topics"] and v["ok"] for v in vd.values())]
    res = {"generated": datetime.date.today().isoformat(), "videos": vd, "nicosWeg": nw, "links": lk, "gaps": gaps}
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
    nok = lambda d: sum(not v["ok"] for v in d.values())
    print(f"videos {len(vd)} (not ok {nok(vd)}) | nicosWeg {len(nw)} (not ok {nok(nw)}) | links {len(lk)} (not ok {nok(lk)})")
    print("not-ok links:", [k for k, v in lk.items() if not v["ok"]])
    print("gaps:", gaps)
    print("failed sources:", failed_sources or "none")

if __name__ == "__main__":
    main()
