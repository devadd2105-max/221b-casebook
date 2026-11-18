// The game state: one plain object, easy to save and easy to test.
import { START, dayOf, hourOf, sleepIfLate } from './clock.js';

export const SAVE_KEY = 'casebook221b.marlowe.v1';

export function newGame() {
  return {
    v: 1,
    t: START,
    place: 'baker_street',
    purse: 80,
    facts: {},        // id -> { t, via }
    flags: {},
    known: { people: ['watson', 'hudson', 'sir_alistair', 'lestrade', 'mycroft', 'wiggins'], places: ['baker_street', 'marlowe_house', 'marlowe_study', 'scotland_yard', 'diogenes'] },
    done: {},         // option id -> count
    alert: 0,
    favours: 0,
    last: { who: null },
    log: [],          // {t, kind, who?, lines:[...]}
    pending: [],      // {at, id, kind, lines, gives, learns}
    stats: { moves: 0, asked: 0, examined: 0, cabs: 0, spent: 0 },
    papersRead: [],
    notebook: [],     // player's own jottings
    ended: null,      // {accused, verdict, ...}
    deadline: null,   // set earlier if the quarry is alarmed
    stoneMoved: false,
    fled: false,
    hints: 0,
  };
}

export const hasFact = (s, id) => !!s.facts[id];
export const hasFlag = (s, id) => !!s.flags[id];
export const knowsPerson = (s, id) => s.known.people.includes(id);
export const knowsPlace = (s, id) => s.known.places.includes(id);

export function learnFact(s, id, via = '') {
  if (s.facts[id]) return false;
  s.facts[id] = { t: s.t, via };
  return true;
}
export function learnPerson(s, id) { if (!s.known.people.includes(id)) { s.known.people.push(id); return true; } return false; }
export function learnPlace(s, id) { if (!s.known.places.includes(id)) { s.known.places.push(id); return true; } return false; }

export function spend(s, shillings) {
  const c = Math.max(0, Math.round(shillings));
  s.purse -= c; s.stats.spent += c;
}

/** Move the clock on. Returns { slept, arrived:[pending items that came due] }. */
export function advance(s, minutes) {
  s.t += Math.max(0, Math.round(minutes));
  let slept = false;
  const [t2, sl] = sleepIfLate(s.t);
  if (sl) { s.t = t2; slept = true; }
  const arrived = [];
  const rest = [];
  for (const p of s.pending) (p.at <= s.t ? arrived : rest).push(p);
  s.pending = rest;
  return { slept, arrived };
}

export function deadlineNow(s) { return s.deadline ?? (5 * 1440 + 17 * 60); }
export const timeLeft = (s) => deadlineNow(s) - s.t;

export function save(s) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (_) { /* private mode */ }
}
export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.v === 1 ? s : null;
  } catch (_) { return null; }
}
export function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (_) {} }

// ----------------------------------------------------------------- who is where, and when
const SHOP_PLACES = new Set(['peabody_shop', 'tench_shop', 'crake_office', 'moss_shop', 'insurance_office', 'finch_chambers']);

export function isSunday(t) { return dayOf(t) % 7 === 0; }

/** Where is this person at time t? null = out of reach. */
export function whereIs(s, id, t = s.t) {
  const h = hourOf(t);
  const sun = isSunday(t);
  switch (id) {
    case 'watson': case 'hudson': return null; // with Holmes, handled by the engine
    case 'sir_alistair': case 'mary': case 'reeve': case 'pargeter': case 'tull':
      return h >= 8 && h < 21 ? 'marlowe_house' : null;
    case 'pell':
      if (s.fled) return null;
      if (h >= 9 && h < 17.5) return 'marlowe_house';
      if (h >= 17.5 || h < 8) return h >= 17.5 || h < 8 ? 'pell_lodging' : null;
      return null;
    case 'ashby': return h >= 10 && h < 22 ? 'ashby_rooms' : null;
    case 'gradwell': return h >= 10 && h < 19 ? 'gradwell_gallery' : null;
    case 'lestrade': return h >= 9 && h < 19 ? 'scotland_yard' : null;
    case 'mycroft': return h >= 16.75 && h < 20.25 ? 'diogenes' : null;
    case 'hodge': return h >= 8 && h < 22 ? 'pell_lodging' : null;
    case 'peabody': return !sun && h >= 9 && h < 18 ? 'peabody_shop' : null;
    case 'tench': return !sun && h >= 8 && h < 18 ? 'tench_shop' : null;
    case 'crake': return !sun && h >= 10 && h < 17 ? 'crake_office' : null;
    case 'moss': return !sun && h >= 9 && h < 19 ? 'moss_shop' : null;
    case 'fenwick': return !sun && h >= 10 && h < 16 ? 'insurance_office' : null;
    case 'finch': return !sun && h >= 10 && h < 17 ? 'finch_chambers' : null;
    default: return null; // remote people, Wiggins
  }
}

export function placeClosed(s, placeId, t = s.t) {
  if (!SHOP_PLACES.has(placeId)) return null;
  const h = hourOf(t);
  if (isSunday(t)) return 'It is the Sabbath and the door is shut fast. Try again tomorrow.';
  if (h < 9) return 'The shutters are still up. They will open at nine.';
  if (h >= 18) return 'The shutters are up. They will open at nine tomorrow.';
  return null;
}
