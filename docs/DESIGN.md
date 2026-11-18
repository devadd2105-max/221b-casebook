# Design notes

**Parser** (`js/parser.js`): normalise, stem, fuzzy-match; longest-phrase entity registry (people, places, objects, papers, makers); intents (ask, go, examine, papers, send, tail, wire, accuse, think, wait); topics, tone, offers, times.

**Options** (`js/case/options.js`): each interview, examination or service is data with `need` (facts, flags, tone, pay, mentions, evidence grade, alert, time), `gives`, `flags`, `delay`, `cost`, `refuse`, `text`.

**Facts and evidence** (`js/case/facts.js`, `js/evidence.js`): facts and false claims; tags for means, motive, opportunity, identity; contradictions. Grades: flimsy, thin, sound, airtight.

**Clock** (`js/clock.js`, `js/state.js`): deadline Friday 17:00, wariness thresholds at 60 and 100, shop hours, schedules, Mycroft's favours.

**Scoring** (`js/scoring.js`): evidence 350, speed 200, economy 100, insight 150, recovery 100, verdict 90; ideal route replayed on a fresh game.

**Art** (`js/art/`): layered animated SVG scenes, generated engraved portraits, hand-inked London map.
