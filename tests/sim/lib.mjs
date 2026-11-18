// Shared helpers for the exhaustive simulations.
import { newGame, hasFact, hasFlag, learnFact, learnPerson, learnPlace, whereIs } from '../../js/state.js';
import { act } from '../../js/engine.js';
import { OPTIONS } from '../../js/case/options.js';
import { PEOPLE, OBJECTS, PLACES, TOPICS, parentPlace } from '../../js/case/world.js';
import { FACTS } from '../../js/case/facts.js';

export { newGame, act, OPTIONS, PEOPLE, PLACES, OBJECTS, TOPICS, FACTS, hasFact, hasFlag, whereIs };
export const clone = (s) => JSON.parse(JSON.stringify(s));
export const texts = (r) => r.out.map((o) => o.text || (o.k === 'say' ? o.text : '') || '').join(' ');

// a time at which this option's person is available (Monday-ish, shops open)
export function openTime(o, base = 1440 + 11 * 60) {
  for (let t = base; t < base + 3 * 1440; t += 30) {
    const s = { fled: false };
    if (!o.who) return t;
    if (['watson', 'hudson'].includes(o.who)) return t;
    if (PEOPLE[o.who]?.remote || o.remote) return t;
    if (whereIs(s, o.who, t)) return t;
  }
  return base;
}

// a game state in which every precondition of option `o` is satisfied
export function forced(o) {
  const s = newGame();
  s.t = Math.max(openTime(o), (o.need?.from ?? 0));
  const n = o.need || {};
  for (const f of n.facts || []) learnFact(s, f, 'force');
  if (n.anyFacts?.length) learnFact(s, n.anyFacts[0], 'force');
  for (const f of n.flags || []) s.flags[f] = true;
  if (n.alertAtLeast != null) s.alert = n.alertAtLeast;
  s.flags.has_note = true;
  learnPerson(s, o.who);
  for (const p of o.targets || []) learnPerson(s, p);
  if (o.who && PEOPLE[o.who]?.home) learnPlace(s, PEOPLE[o.who].home);
  if (o.kind === 'examine' && OBJECTS[o.obj]) { s.place = OBJECTS[o.obj].at; learnPlace(s, parentPlace(s.place)); }
  else if (o.who && !['watson', 'hudson'].includes(o.who)) {
    const here = whereIs(s, o.who, s.t); if (here) { s.place = here; learnPlace(s, parentPlace(here)); }
  }
  if (n.evidence) for (const [id, f] of Object.entries(FACTS)) if (f.kind === 'fact') learnFact(s, id, 'force');
  s.purse = 500;
  return s;
}

// every way a player might phrase the option's essentials
export function personName(id) { return PEOPLE[id].names.find((x) => x.length > 3) || PEOPLE[id].names[0]; }
export function toneWords(o) {
  const t = o.need?.tone;
  return t === 'gentle' ? ['gently', 'kindly', 'softly'] : t === 'harsh' ? ['sharply', 'harshly', 'firmly'] : t === 'confront' ? ['and tell him I know everything', 'confront him with the evidence'] : [''];
}
