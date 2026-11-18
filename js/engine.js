// The game itself: reads what Holmes types and makes it happen.
import { parse, parseTime } from './parser.js';
import { findPhrase } from './text.js';
import { PEOPLE, PLACES, OBJECTS, PAPERS, MAKERS, PAPER_ORDER, TOPICS, parentPlace, travelMinutes, travelFare } from './case/world.js';
import { FACTS } from './case/facts.js';
import { OPTIONS } from './case/options.js';
import { PAPER_EDITIONS, PAPER_PROFILE } from './case/papers.js';
import { weighEvidence, atLeast } from './evidence.js';
import { hasFact, hasFlag, learnFact, learnPerson, learnPlace, knowsPerson, knowsPlace, spend, advance, whereIs, placeClosed, timeLeft, deadlineNow } from './state.js';
import { clockText, shortClock, dayOf, DAY_NAMES, hourOf, money } from './clock.js';
const isSundayAt = (t) => dayOf(t) % 7 === 0;

const say = (who, text) => ({ k: 'say', who, text });
const narr = (text) => ({ k: 'narr', text });
const sys = (text) => ({ k: 'sys', text });
const learnLine = (id) => ({ k: 'learn', id, text: FACTS[id].label, kind: FACTS[id].kind });

function lineFrom(x) { return Array.isArray(x) ? say(x[0], x[1]) : narr(x); }
const personName = (id) => PEOPLE[id]?.short ?? id;
const placeName = (id) => PLACES[id]?.name ?? id;

// ---------------------------------------------------------------- presence
function peopleHere(s, place = s.place) {
  const out = ['watson'];
  if (parentPlace(place) === 'baker_street') out.push('hudson');
  for (const id of Object.keys(PEOPLE)) {
    if (id === 'watson' || id === 'hudson') continue;
    const w = whereIs(s, id);
    if (w && parentPlace(w) === parentPlace(place)) out.push(id);
  }
  return out;
}

function nextAvailability(s, id) {
  for (let m = 15; m < 4000; m += 15) {
    const w = whereIs(s, id, s.t + m);
    if (w) return { at: s.t + m, place: w };
  }
  return null;
}

// ---------------------------------------------------------------- moving
function arrive(s, placeId, out, info) {
  const first = !knowsPlace(s, placeId) || !s.flags['visited_' + parentPlace(placeId)];
  learnPlace(s, placeId); learnPlace(s, parentPlace(placeId));
  if (s.place !== placeId) s.prevPlace = s.place;
  s.place = placeId;
  s.flags['visited_' + parentPlace(placeId)] = true;
  const p = PLACES[placeId];
  if (parentPlace(placeId) === 'marlowe_house') for (const id of ['mary', 'reeve', 'pargeter', 'tull']) learnPerson(s, id);
  if (info?.travelled) out.push(narr(info.line));
  out.push({ k: 'place', id: placeId, text: p.name, blurb: first ? p.blurb : '' });
  if (first && p.blurb) out.push(narr(p.blurb));
}

function goTo(s, placeId, out) {
  if (s.place === placeId) { out.push(sys('You are already here.')); return false; }
  if (!PLACES[placeId]) return false;
  let wait = 0;
  let closed = placeClosed(s, placeId, s.t + travelMinutes(s.place, placeId));
  if (closed && !isSundayAt(s.t + travelMinutes(s.place, placeId)) && hourOf(s.t + travelMinutes(s.place, placeId)) < 9) {
    const early = 540 - (s.t % 1440 + travelMinutes(s.place, placeId));
    if (early > 0 && early <= 90) { wait = early; closed = null; }
  }
  if (closed) { out.push(narr(`${PLACES[placeId].name}. ${closed}`)); return false; }
  const mins = travelMinutes(s.place, placeId);
  let fare = travelFare(s.place, placeId);
  let line = '';
  if (mins <= 2) line = placeId === 'marlowe_study' ? 'You cross the hall and let yourself into the study.' : 'You move through the house.';
  else if (fare > 0 && s.purse >= fare) {
    spend(s, fare); s.stats.cabs++;
    line = `You whistle up a hansom. ${personName('watson')} climbs in after you. The fare is ${money(fare)}.`;
  } else {
    line = 'Your purse is too thin for a cab; you take the omnibus and the better part of the morning with it.';
  }
  const walk = mins > 2 && !(fare > 0 && s.purse + fare >= fare && line.startsWith('You whistle'));
  const real = walk ? Math.round(mins * 1.8) : mins;
  const { arrived, slept } = advance(s, real + wait);
  s.stats.moves++;
  if (wait) line += ` You are early, and wait on the step for the shutters to come down.`;
  arrive(s, placeId, out, { travelled: true, line });
  deliver(s, arrived, out);
  if (slept) out.push(sys('The small hours have come and gone. You sleep, and rise at eight.'));
  return true;
}

// ---------------------------------------------------------------- requirement checking
function tonePasses(s, need, p) {
  if (need.tone === 'gentle') return p.tone.gentle && !p.tone.harsh;
  if (need.tone === 'harsh') return p.tone.harsh || p.tone.confront;
  if (need.tone === 'confront') return p.tone.confront || p.tone.harsh || Object.keys(p.topics).length >= 2;
  return true;
}
function mentioned(p, id) {
  if (p.found.person.some((e) => e.id === id) || p.found.place.some((e) => e.id === id)) return true;
  const per = PEOPLE[id];
  return !!per && per.names.some((n) => n.length > 3 && findPhrase(p.toks, n) >= 0);
}
function needStatus(s, o, p) {
  const n = o.need || {};
  const dem = [];
  const miss = [];
  const chk = (cond, label) => { if (cond) dem.push(label); else miss.push(label); };
  if (n.facts) n.facts.forEach((f) => chk(hasFact(s, f), 'fact'));
  if (n.anyFacts) chk(n.anyFacts.some((f) => hasFact(s, f)), 'anyfact');
  if (n.notFacts) n.notFacts.forEach((f) => chk(!hasFact(s, f), 'notfact'));
  if (n.flags) n.flags.forEach((f) => chk(hasFlag(s, f), 'flag'));
  if (n.notFlags) n.notFlags.forEach((f) => chk(!hasFlag(s, f), 'notflag'));
  if (n.tone) chk(tonePasses(s, n, p), 'tone');
  if (n.pay) chk(p.offer >= n.pay && s.purse >= n.pay, 'pay');
  if (n.mention) n.mention.forEach((id) => chk(mentioned(p, id), 'mention'));
  if (n.evidence) chk(atLeast(weighEvidence(s).grade, n.evidence), 'evidence');
  if (n.alertBelow != null) chk(s.alert < n.alertBelow, 'alert');
  if (n.alertAtLeast != null) chk(s.alert >= n.alertAtLeast, 'alert');
  if (n.days) chk(dayOf(s.t) >= n.days[0] && dayOf(s.t) <= n.days[1], 'day');
  if (n.from != null) chk(s.t >= n.from, 'from');
  return { ok: miss.length === 0, demanding: dem.length + miss.length, miss };
}

function pickOption(s, p, candidates, topicKeys) {
  const scored = [];
  for (const o of candidates) {
    const m = topicKeys ? o.topics.filter((t) => topicKeys.includes(t)).length : 0;
    const st = needStatus(s, o, p);
    scored.push({ o, m, st, score: m * 10 + st.demanding * 4 + (o.priority ?? 0), done: s.done[o.id] || 0 });
  }
  const eligible = scored.filter((x) => (x.m > 0 || !topicKeys) && x.st.ok);
  let fresh = eligible.filter((x) => !x.done).sort((a, b) => b.score - a.score);
  if (fresh.length) return { pick: fresh[0], blocked: null, repeat: false };
  if (eligible.length) return { pick: eligible.sort((a, b) => b.score - a.score)[0], blocked: null, repeat: true };
  const blocked = scored.filter((x) => x.m > 0 && !x.st.ok).sort((a, b) => b.score - a.score)[0] || null;
  return { pick: null, blocked, repeat: false };
}

// ---------------------------------------------------------------- applying an option
function applyOption(s, o, p, out, { skipText = false } = {}) {
  if (o.cost && s.purse < o.cost) { out.push(narr('Your purse will not stand it.')); return false; }
  if (o.favour) {
    if (s.favours >= 3) { out.push(say('Mycroft', 'My dear Sherlock, I have already been more obliging this week than the Cabinet would care to know. Three is my limit.')); return false; }
    s.favours++;
  }
  if (o.cost) spend(s, o.cost);
  if (!skipText) for (const l of o.text || []) out.push(lineFrom(l));
  if (o.delay) {
    s.pending.push({ at: s.t + o.delay, id: o.id, gives: o.gives, learnsP: o.learnsP, learnsPl: o.learnsPl, flags: o.flags, who: o.who });
    out.push(sys(`Word will reach you in about ${Math.round(o.delay / 60)} hour${o.delay >= 120 ? 's' : ''}.`));
  } else {
    for (const f of o.gives || []) if (learnFact(s, f, o.id)) out.push(learnLine(f));
    for (const f of o.flags || []) s.flags[f] = true;
    for (const id of o.learnsP || []) if (learnPerson(s, id)) out.push({ k: 'sys', text: `${personName(id)} added to People.` });
    for (const id of o.learnsPl || []) learnPlace(s, id);
  }
  if (o.alert) s.alert = Math.min(120, s.alert + o.alert);
  s.done[o.id] = (s.done[o.id] || 0) + 1;
  if (o.kind === 'ask') s.stats.asked++; else if (o.kind === 'examine') s.stats.examined++;
  const { arrived, slept } = advance(s, o.minutes);
  deliver(s, arrived, out);
  if (slept) out.push(sys('The small hours have come and gone. You sleep, and rise at eight.'));
  s.log.push({ t: s.t, id: o.id, who: o.who, obj: o.obj, kind: o.kind });
  return true;
}

function deliver(s, arrived, out) {
  for (const a of arrived) {
    if (a.event === 'stone_moved') { s.stoneMoved = true; continue; }
    if (a.event === 'flees') { s.fled = true; out.push(narr('A boy comes running with a note from the Irregulars: Mr. Pell has not come to Marlowe House this morning, and his lodgings are empty.')); continue; }
    const lines = [`A reply reaches you from ${a.who === 'wiggins' ? 'Wiggins' : personName(a.who)}:`];
    out.push(sys(lines[0]));
    for (const f of a.gives || []) if (learnFact(s, f, a.id)) out.push(learnLine(f));
    for (const id of a.learnsP || []) learnPerson(s, id);
    for (const id of a.learnsPl || []) learnPlace(s, id);
    for (const f of a.flags || []) s.flags[f] = true;
  }
}

// ---------------------------------------------------------------- the quarry’s nerves
function checkNerves(s, out) {
  if (s.alert >= 60 && !s.deadline) {
    s.deadline = Math.min(deadlineNow(s), 4 * 1440 + 17 * 60);
    s.pending.push({ at: s.t + 120, event: 'stone_moved' });
    out.push(narr('Something has changed. Pell has the look of a hunted man. You feel it, as a hound feels weather. He will not wait for Friday now: you judge Thursday afternoon at the latest.'));
    out.push({ k: 'alert', text: 'The quarry is alarmed. The deadline moves to Thursday 5 p.m.' });
  }
  if (s.alert >= 100 && !s.fled) {
    s.pending.push({ at: s.t + 60, event: 'flees' });
  }
  if (s.stoneMoved && !hasFlag(s, 'stone_moved_note')) {
    s.flags['stone_moved_note'] = true;
    s.flags['stone_at_moss'] = true;
  }
}

// ---------------------------------------------------------------- papers
function editionFor(s, id) {
  const eds = PAPER_EDITIONS[id];
  return [...eds].reverse().find((e) => s.t >= e.from) || eds[0];
}

// What the reader sees for each paper: masthead, date, a headline and the column itself.
export function paperSheets(s, ids) {
  return ids.map((id) => {
    const ed = editionFor(s, id);
    const day = s.t < 1440 ? 6 : dayOf(s.t);
    const dateNo = s.t < 1440 ? 11 : 12 + dayOf(s.t);
    const date = `${DAY_NAMES[day % 7]} ${dateNo} October 1890`;
    const articles = []; const notes = [];
    for (const l of ed.lines) {
      if (Array.isArray(l)) articles.push(String(l[1]).replace(/^[“"]|[”"]$/g, ''));
      else notes.push(l);
    }
    let headline = ''; let body = articles;
    if (articles.length) {
      const m = articles[0].match(/^(.{12,110}?[!.?])\s+([\s\S]*)$/);
      if (m) { headline = m[1]; body = [m[2], ...articles.slice(1)]; }
    } else headline = 'Nothing on the matter in hand';
    return { id, name: PAPERS[id].name, date, reliability: PAPER_PROFILE[id].reliability, headline, body, notes };
  });
}

function readPapers(s, ids, out) {
  ids = [...ids];
  if (!ids.length && s.awaitPapers) ids = [...PAPER_ORDER];   // asked twice: stop asking, hand over the lot
  if (!ids.length) {
    s.awaitPapers = true;
    out.push(say('Watson', 'Which paper shall I fetch, Holmes? We have the Times, the Telegraph, the Morning Post, the Pall Mall Gazette, the City Press and, I regret to say, the Illustrated Police News. Choose one, or several, or all of them.'));
    out.push({ k: 'suggest', items: ['All of them', ...PAPER_ORDER.map((id) => PAPERS[id].name)] });
    return;
  }
  s.awaitPapers = false;
  const names = ids.map((id) => PAPERS[id].name);
  out.push(say('Watson', ids.length === 1 ? `Here you are, Holmes: ${names[0]}. Read it yourself, or say the word and I shall give you the gist.` : `Here, Holmes, I have laid out ${names.length === PAPER_ORDER.length ? 'every one of them' : names.join(', ').replace(/, ([^,]*)$/, ' and $1')}. Read them yourselves, or say the word and I shall give you the gist.`));
  for (const id of ids) {
    const ed = editionFor(s, id);
    for (const f of ed.gives) if (learnFact(s, f, 'paper:' + id)) out.push(learnLine(f));
    if (!s.papersRead.includes(id)) s.papersRead.push(id);
    const { arrived } = advance(s, 10);
    deliver(s, arrived, out);
  }
  s.lastPapers = ids;
  s.uiNext = { open: 'papers', ids };
}

// Watson reads the column aloud, when Holmes would rather listen
function papersGist(s, out) {
  const ids = (s.lastPapers && s.lastPapers.length) ? s.lastPapers : [];
  if (!ids.length) { out.push(say('Watson', 'We have not looked at a paper yet. Which would you like?')); s.awaitPapers = true; return; }
  for (const id of ids) {
    const ed = editionFor(s, id);
    out.push(sys(`${PAPERS[id].name}: ${PAPER_PROFILE[id].reliability}.`));
    for (const l of ed.lines) out.push(lineFrom(l));
  }
}

// ---------------------------------------------------------------- the specimen books
export function compareMaker(s, makerId, out = []) {
  if (!hasFlag(s, 'has_note')) { out.push(narr('You have no thief’s note to compare yet. Sir Alistair has it.')); return out; }
  if (parentPlace(s.place) !== 'baker_street') { out.push(narr('Your specimen books are at Baker Street.')); return out; }
  const m = MAKERS[makerId];
  s.flags['tried_' + makerId] = true;
  out.push(sys(`You lay the note beside the ${m.name} ${m.line} specimen.`));
  if (makerId === 'joynson') {
    out.push(narr('The tint is right, the laid lines run the same way and, held to the lamp, the crown stands out in exactly the same place. It is Joynson’s Crown Laid, to the very mould.'));
    if (learnFact(s, 'paper_joynson', 'specimens')) out.push(learnLine('paper_joynson'));
    learnPerson(s, 'peabody'); learnPlace(s, 'peabody_shop');
    out.push(narr('Joynson sells through very few London houses, and the nearest to the Inns of Court and Bloomsbury is Peabody & Sons, Holborn.'));
    s.flags['joynson_done'] = true;
  } else {
    out.push(narr(`It is not ${m.name}: ${m.note}. The note is cream and laid, with a crown.`));
    if (makerId === 'whatman' && learnFact(s, 'paper_not_whatman', 'specimens')) out.push(learnLine('paper_not_whatman'));
  }
  const { arrived } = advance(s, 15);
  deliver(s, arrived, out);
  return out;
}

// ---------------------------------------------------------------- hints, thinking
export function leads(s) {
  const L = [];
  const has = (f) => hasFact(s, f);
  if (!hasFlag(s, 'has_note')) L.push('The thief’s own note is the one object in this case that was handled by him. Sir Alistair has it.');
  if (hasFlag(s, 'has_note') && !has('paper_joynson')) L.push('The note is on paper. I have five makers’ specimen books in the sitting room. Compare them.');
  if (has('paper_joynson') && !has('paper_ledger_pell')) L.push('Joynson sells through very few houses. Whoever buys it regularly is a short list.');
  if (!hasFlag(s, 'mary_spoke') && !has('mary_stairs')) L.push('Servants see the house when the family are looking elsewhere. A kind word may do what a hard one will not.');
  if (!has('tench_dup') && (has('safe_clean') || hasFlag(s, 'safe_seen'))) L.push('The safe was opened with a key. A man who owns one key does not need another. Someone has made a second.');
  if (!has('pell_debt')) L.push('Motives are expensive things. Who in that house needed money badly?');
  if (hasFlag(s, 'has_note') && !hasFlag(s, 'has_pell_sample')) L.push('Handwriting can be disguised but habits cannot. You will need a sample of the suspect’s own hand to set beside the note.');
  if (hasFlag(s, 'has_note') && hasFlag(s, 'has_pell_sample') && !has('hand_matches_pell')) L.push('You have the note and a sample. There is a man in Gray’s Inn whose business is to say whether they are one hand.');
  if (!has('boat_booked')) L.push('A guilty man does not stay for the trial. Who knows the railway and boat bookings? Perhaps my brother, perhaps the Yard.');
  if (weighEvidence(s).grade === 'sound' || weighEvidence(s).grade === 'airtight') L.push('You hold enough to act. Lestrade could obtain a warrant, or you might put the case to Pell yourself and see whether he breaks.');
  if (!L.length) L.push('Think, Holmes. Lay the facts side by side; where two of them cannot both be true, you have found a liar.');
  return L;
}

function think(s, out) {
  const ev = weighEvidence(s);
  out.push(narr('You settle into the basket chair, light the pipe, and lay the facts side by side.'));
  const kinds = { means: 'the means', motive: 'a motive', opportunity: 'the opportunity', identity: 'the identity of the writer' };
  const lines = [];
  for (const k of Object.keys(kinds)) {
    const v = ev.by[k];
    lines.push(`${kinds[k][0].toUpperCase()}${kinds[k].slice(1)}: ${v >= 3 ? 'established' : v >= 2 ? 'fairly well supported' : v >= 1 ? 'hinted at' : 'nothing yet'}.`);
  }
  lines.forEach((l) => out.push(narr(l)));
  const mentionPell = Object.keys(s.facts).some((f) => FACTS[f].tags);
  out.push(narr(mentionPell ? 'Everything that points anywhere points inside the house, and mostly at one man.' : 'Nothing points anywhere yet. You are still gathering.'));
  const L = leads(s);
  out.push(sys('Watson, glancing up: ' + L[0]));
  s.hints++;
  const { arrived } = advance(s, 20);
  deliver(s, arrived, out);
}

// ---------------------------------------------------------------- the main entry
function splitClauses(text) {
  return text.split(/\s*(?:;|\bthen\b|\band then\b|\bafterwards\b|\bafter that\b|\bnext\b)\s*/i).map((x) => x.trim()).filter(Boolean);
}

export function act(s, text) {
  const out = [];
  if (s.ended) { out.push(sys('The case is closed. Start a new game from the title.')); return { out, ui: null }; }
  const clauses = splitClauses(text);
  let ui = null;
  for (const c of clauses.slice(0, 4)) {
    const r = actOne(s, c, out);
    if (r?.ui) ui = r.ui;
    if (ui?.open === 'accuse') break;
    if (s.ended) break;
  }
  if (s.uiNext) { ui = s.uiNext; delete s.uiNext; }
  checkNerves(s, out);
  checkDeadline(s, out);
  s.log.push({ t: s.t, kind: 'input', text });
  return { out, ui };
}

function checkDeadline(s, out) {
  if (!s.ended && s.t >= deadlineNow(s)) {
    out.push(narr('The clock strikes. Somewhere on the Essex marshes a steamer is casting off, and a very tired young man is standing at its rail.'));
    s.ended = { kind: 'escaped' };
    out.push({ k: 'end', kind: 'escaped' });
  }
}

function actOne(s, text, out) {
  const p = parse(text);
  if (p.empty) { out.push(sys('You say nothing, which is its own kind of answer. Type what Holmes does or says.')); return; }
  const I = p.intents;
  const found = p.found;

  // --- everyday utility commands
  if (!found.person.length && !found.object.length && !found.place.length) {
    if (/\b(map|london)\b/i.test(text) && /\b(show|open|see|look|view|check|where)\b/i.test(text)) return { ui: { open: 'map' } };
    if (/\b(casebook|notes|notebook|my notes|evidence|clues)\b/i.test(text)) return { ui: { open: 'casebook' } };
    if (/\b(money|purse|cash|funds|shillings|afford)\b/i.test(text) && /\b(how|what|check|much|have|left)\b/i.test(text)) {
      out.push(sys(`Your purse holds ${money(s.purse)}. It is ${clockText(s.t)}`.replace(/\.?$/, '.'))); return;
    }
    if (/\b(what('?s| is) the (time|date|day)|what time|what day|the time)\b/i.test(text)) {
      out.push(sys(`It is ${clockText(s.t)} You have until ${clockText(deadlineNow(s))}`.replace(/\.?$/, '.').replace(/\.\s+You/, '. You'))); return;
    }
    if (/^\s*(go back|back|return|return to where i was|go to where i was)\s*$/i.test(text) && s.prevPlace && s.prevPlace !== s.place) { goTo(s, s.prevPlace, out); return; }
    if (/^\s*(leave|exit|go out|step outside|go outside)\s*$/i.test(text)) {
      const dest = parentPlace(s.place) === 'baker_street' ? null : (s.prevPlace && s.prevPlace !== s.place ? s.prevPlace : 'baker_street');
      if (!dest) { out.push(narr('You have nowhere in particular to go. Say where.')); return; }
      goTo(s, dest, out); return;
    }
    if (/^\s*(save|undo|restart|quit)\b/i.test(text)) { out.push(sys('The game saves itself after every move. Use the Menu button to start afresh.')); return; }
  }


  // --- accusing
  const questioning = /\b(ask|asks|question|interview|interrogate|talk to|speak to|speak with|what does .* know|tell me about|regarding|wire|telegraph)\b/i.test(text) && !/\b(accuse|culprit|my solution|final answer)\b/i.test(text);
  if (I.ACCUSE && !questioning && (found.person.length || /\b(accuse|name the (thief|culprit)|culprit|solved|my solution|final answer|close the case)\b/i.test(text))) {
    const suspect = found.person.find((e) => e.id !== 'watson' && e.id !== 'hudson')?.id ?? null;
    out.push(narr('You rise. It is time to say it aloud.'));
    return { ui: { open: 'accuse', suspect } };
  }
  // --- help / think / play
  if (I.HELP && !found.person.length && !found.object.length) {
    out.push(say('Watson', leads(s)[0])); s.hints++;
    out.push(sys('Type anything: where to go, whom to question, what to examine, whom to send. For example: “ask Mary what she saw on the back stairs”.'));
    return;
  }
  if (I.THINK && !found.person.length && !found.object.length && !I.GO && !I.WAIT) { think(s, out); return; }
  if (I.PLAY && !found.person.length && !I.GO) { playFlavour(s, p, out); return; }

  const otherPerson = found.person.find((e) => !['watson', 'hudson'].includes(e.id));

  // --- papers
  // cold request for a summary before any paper has been fetched: lay them all out, then summarise
  if (!s.lastPapers?.length && parentPlace(s.place) === 'baker_street' && !found.person.some((e) => !['watson', 'hudson'].includes(e.id)) && !found.paper.length && /\b(summar|gist|brief me|sum (it|them) up|headlines)/i.test(text) && /\b(papers?|newspapers?|news|dailies)\b/i.test(text)) {
    readPapers(s, [...PAPER_ORDER], out); papersGist(s, out); return;
  }
  if (!s.lastPapers?.length && !s.awaitPapers && parentPlace(s.place) === 'baker_street' && !otherPerson && /\b(any|what'?s the|what is the|the latest|today'?s|this morning'?s|morning) news\b|\bwhat (do|does) the (papers?|newspapers?) (say|report)\b/i.test(text)) {
    readPapers(s, [], out); return;
  }
  if (s.lastPapers?.length && !found.person.some((e) => !['watson', 'hudson'].includes(e.id)) && /\b(summar|gist|read (it|them|that) (to me|aloud|out)|tell me what (it|they) say|what (does|do) (it|they|the papers?|the newspapers?) say|give me the (gist|summary|headlines)|the facts|brief me|in short|sum (it|them) up)/i.test(text) && !found.paper.length) {
    papersGist(s, out); return;
  }
  if (s.awaitPapers && !found.person.some((e) => !['watson', 'hudson'].includes(e.id)) && !found.paper.length && !I.GO && !found.place.length && (/\b(all|every|each|the lot|everything|whole|both|any|whichever|you choose|your choice|surprise me|do it|do so|go ahead|go on|carry on|just|please|sure|yes|yeah|okay|ok|fine)\b/i.test(text) || (!I.ASK && !I.EXAMINE && !I.WAIT && !I.THINK))) {
    readPapers(s, [...PAPER_ORDER], out); return;
  }
  const wantsPapers = !((found.object.length || (parentPlace(s.place) !== 'baker_street' && /\b(examine|inspect|search|check|look (at|through)|go through|rummage)\b/i.test(text) && !/\b(news|newspaper|newspapers|times|telegraph|gazette|morning papers)\b/i.test(text))) && parentPlace(s.place) !== 'baker_street') && (found.paper.length || /\b(pass me|hand me|give me|fetch|bring)\b[^.]*\b(papers?|newspapers?)\b/i.test(text) || /\b(newspaper|newspapers|headline|headlines|the news|morning papers|the papers|dailies)\b/i.test(text) || (I.READ_PAPERS && /\bread\b/i.test(text) && !/\b(note|specimen|watermark|stationer|quire|letter|ledger|copy.?book|sample)\b/i.test(text) && !found.object.length));
  if (wantsPapers && !otherPerson) {
    let ids = found.paper.map((e) => e.id);
    if (/\ball\b|\bevery\b|\beach\b|\bthe lot\b/i.test(text)) ids = [...PAPER_ORDER];
    readPapers(s, [...new Set(ids)], out);
    return;
  }

  // --- the specimen books
  if (!otherPerson && (found.maker.length || (found.object.some((e) => e.id === 'specimens')))) {
    if (hasFlag(s, 'has_note')) {
      if (found.maker.length) { for (const m of found.maker) compareMaker(s, m.id, out); return; }
      out.push(narr('You pull the five specimen books down from the shelf: Whatman, Joynson, Portal, Dickinson and Spicer.'));
      return { ui: { open: 'specimens' } };
    }
  }
  if (!otherPerson && found.object.some((e) => e.id === 'note') && I.EXAMINE && /compare|match|cross|specimen|which paper|what paper|maker|watermark/i.test(text)) {
    if (hasFlag(s, 'has_note') && parentPlace(s.place) === 'baker_street') return { ui: { open: 'specimens' } };
  }

  // --- going somewhere
  const placeE = found.place.find((e) => !e.weak) || found.place[0];
  const goVerb = I.GO && !I.ASK;
  const wireVerb = I.WIRE;
  const wigginsNamed = found.person.some((e) => e.id === 'wiggins') || /\b(boys|irregulars|urchins|lads)\b/i.test(text);
  const tailsSomeone = I.TAIL && found.person.some((e) => !['watson', 'hudson', 'wiggins'].includes(e.id)) && !I.EXAMINE;
  const sendVerb = (I.SEND || I.TAIL || wigginsNamed) && !(I.ASK && !wigginsNamed) && (wigginsNamed || tailsSomeone);
  const personE = found.person.find((e) => !['watson', 'hudson'].includes(e.id)) || found.person.find((e) => e.id === 'watson' || e.id === 'hudson');

  if (sendVerb) { return service(s, p, out); }
  if (wireVerb && personE && PEOPLE[personE.id].remote) { return askPerson(s, p, personE.id, out, { remote: true }); }
  if (wireVerb && personE && ['watson', 'hudson'].includes(personE.id) && peopleHere(s).includes(personE.id)) { return askPerson(s, p, personE.id, out, {}); }
  if (wireVerb && personE && !PEOPLE[personE.id].remote) { out.push(narr('A telegram will not do for that. You will have to see him.')); return; }

  if (placeE && placeE.id === s.place && !goVerb && !personE && !found.object.length && !I.WAIT && !I.ASK) { return searchRoom(s, p, out); }
  if (placeE && (goVerb || (!personE && !found.object.length && !I.EXAMINE && !I.WAIT)) && !I.ASK) {
    const id = placeE.id;
    if (!knowsPlace(s, id)) { out.push(narr(`You have no good reason to go to ${PLACES[id].short} yet.`)); return; }
    goTo(s, id, out);
    return;
  }

  // --- "go to Tench", "visit Mrs. Hodge": just travel to wherever that person is found
  if (personE && I.GO && !I.ASK && !Object.keys(p.topics).length && !PEOPLE[personE.id].remote && !['watson', 'hudson'].includes(personE.id)) {
    if (!knowsPerson(s, personE.id)) { out.push(narr(`You know of no ${PEOPLE[personE.id].short} in this affair yet.`)); return; }
    const home = PEOPLE[personE.id].home;
    const where = whereIs(s, personE.id) || home;
    if (where && !knowsPlace(s, home)) learnPlace(s, home);
    if (where && where !== s.place) { goTo(s, where === 'marlowe_house' && home === 'marlowe_house' ? 'marlowe_house' : where, out); }
    else out.push(sys('You are already here.'));
    return;
  }

  // --- asking a person
  if (personE && !(found.object.length && I.EXAMINE && !I.ASK && !Object.keys(p.topics).length)) {
    if (I.WAIT && !I.ASK && !Object.keys(p.topics).length) { /* "wait for Mycroft" etc. falls to waiting */ }
    else return askPerson(s, p, personE.id, out, {});
  }

  // --- a question to nobody in particular goes to Watson, who is always at your elbow
  if (/^\s*(who|is there|does anyone|can anyone|anyone|do you know|do we know|where can i find|who knows)\b/i.test(text) && !found.person.length && !found.object.length && !found.place.length && Object.keys(p.topics).length && !I.GO) {
    return askPerson(s, p, 'watson', out, {});
  }

  // --- examining
  if (found.object.length || (I.EXAMINE && placeE)) {
    return examine(s, p, out);
  }

  // --- waiting
  if (I.WAIT) { waitFor(s, p, out); return; }
  if (I.GO && placeE) { goTo(s, placeE.id, out); return; }

  // --- pronoun carry-over: "ask him about the key"
  if ((I.ASK || Object.keys(p.topics).length) && s.last.who && peopleHere(s).includes(s.last.who)) {
    return askPerson(s, p, s.last.who, out, {});
  }
  if (I.EXAMINE) return lookAround(s, out);

  if (/^\s*(hello|hi|hey|good (morning|evening|afternoon)|watson)\b/i.test(text) && p.found.person.length === 0) {
    out.push(say('Watson', 'Good day, Holmes. I am at your service whenever you have decided what to do.'));
    out.push({ k: 'suggest', items: suggest(s).slice(0, 3) });
    return;
  }
  if (/\b(who am i|where am i|what is (this|going on)|what('?s| is) the case|what happened|the story|recap|remind me|what was stolen|why are we here)\b/i.test(text)) {
    out.push(narr('You are Sherlock Holmes. The Marlowe Star, a blue-white diamond, was taken from a locked safe at Marlowe House, Campden Hill, on Saturday night, and a polite note was left in its place. Whoever did it will be beyond reach by Friday afternoon.'));
    if (!hasFlag(s, 'has_note')) out.push(narr('Sir Alistair holds the note. You have only his telegram.'));
    out.push({ k: 'suggest', items: suggest(s).slice(0, 3) });
    return;
  }
  out.push(narr(vague(s, p)));
  out.push({ k: 'suggest', items: suggest(s).slice(0, 3) });
}

function vague(s, p) {
  if (/\b(station|train|railway|paddington|waterloo|euston|liverpool street|boat)\b/i.test(p.raw || '')) return 'London has a dozen termini, and a man cannot be traced through them blind. Someone who watches the bookings, at the Yard or the Diogenes Club, would serve better.';
  if (p.found.person.length === 0 && p.found.place.length === 0 && p.found.object.length === 0) {
    return 'You turn it over. It is not quite a thing you can do from here. Say where you will go, whom you will question, or what you will examine.';
  }
  return 'The thought does not resolve into an action. Try it another way.';
}

// ---------------------------------------------------------------- asking
function askPerson(s, p, id, out, { remote = false } = {}) {
  const per = PEOPLE[id];
  if (!knowsPerson(s, id)) {
    out.push(narr(`You know of no ${per.short} in this affair yet. Someone will have to mention the name.`));
    return;
  }
  if (id === 'hudson' || id === 'watson') {
    if (id === 'hudson' && parentPlace(s.place) !== 'baker_street') { out.push(narr('Mrs. Hudson is at Baker Street.')); return; }
  } else if (!remote) {
    let where = whereIs(s, id);
    const here = where && parentPlace(where) === parentPlace(s.place);
    if (!here) {
      const dest = per.home;
      if (!dest) { out.push(narr(`${per.short} is not to be found by the usual means.`)); return; }
      let where2 = where;
      if (!where2) {
        const nx = nextAvailability(s, id);
        if (nx && nx.at - s.t <= 90) {
          out.push(narr(`${per.short} is not yet at ${PLACES[dest].short}. You take a turn about the streets and come back at ${shortClock(nx.at)}.`));
          const { arrived } = advance(s, nx.at - s.t); deliver(s, arrived, out);
          where2 = whereIs(s, id);
        } else {
          out.push(narr(`${per.short} is not at ${PLACES[dest].short} at this hour.${nx ? ` You judge you would find them there about ${shortClock(nx.at)}${dayOf(nx.at) !== dayOf(s.t) ? ' tomorrow' : ''}.` : ''}`));
          return;
        }
      }
      where = where2;
      if (!knowsPlace(s, dest)) { learnPlace(s, dest); out.push(sys(`You look up the address in the Post Office Directory: ${PLACES[dest].name}.`)); advance(s, 5); }
      if (!goTo(s, where, out)) return;
      if (whereIs(s, id) == null || parentPlace(whereIs(s, id)) !== parentPlace(s.place)) { out.push(narr(`By the time you arrive, ${per.short} has gone.`)); return; }
    }
  }

  const cands = OPTIONS.filter((o) => o.who === id && o.kind === 'ask' && !!o.remote === !!remote);
  if (!cands.length) { out.push(say(per.short, 'I do not think I can help you with that.')); return; }
  let topicKeys = Object.keys(p.topics);
  if (!topicKeys.length) topicKeys = ['greet', 'theft'];
  // naming a person in the question is a topic of its own: "ask Mary about Pell"
  const named = p.found.person.filter((e) => e.id !== id && !['watson', 'hudson'].includes(e.id)).map((e) => e.id);
  if (named.includes('pell')) topicKeys.push('character', 'evening');
  s.last.who = id;
  const r = pickOption(s, p, cands, topicKeys);
  if (r.pick) {
    const { o } = r.pick;
    if (r.repeat) {
      out.push(narr(`You have been over this with ${per.short} already.`));
      const recap = (o.text || []).filter((l) => Array.isArray(l)).slice(0, 1);
      for (const l of recap) out.push(lineFrom(l));
      const { arrived } = advance(s, 3); deliver(s, arrived, out);
      return;
    }
    // some options care that the speaker was not already won over; ignore flags
    applyOption(s, o, p, out);
    return;
  }
  // blocked: show the closest option’s own refusal
  if (r.blocked?.o.refuse) {
    for (const l of r.blocked.o.refuse) out.push(lineFrom(l));
    advance(s, 5);
    s.log.push({ t: s.t, id: 'refused:' + r.blocked.o.id, kind: 'ask', who: id });
    return;
  }
  const fb = cands.find((o) => !o.topics.length);
  if (fb) {
    for (const l of fb.text) out.push(lineFrom(l));
    if (fb.alert) s.alert = Math.min(120, s.alert + fb.alert);
    const { arrived } = advance(s, fb.minutes); deliver(s, arrived, out);
    return;
  }
  out.push(say(per.short, 'I have nothing to say to that.'));
}

// ---------------------------------------------------------------- examining
function lookAround(s, out) {
  const here = parentPlace(s.place);
  const objs = Object.entries(OBJECTS).filter(([, o]) => o.at && (o.at === s.place || (s.place === here && parentPlace(o.at) === here && o.at === s.place)));
  const list = objs.map(([, o]) => o.names[0]).slice(0, 10);
  out.push(narr(list.length ? `Things that would repay a close look here: ${list.join(', ')}.` : 'Nothing here that wants examining.'));
}

function examine(s, p, out) {
  let objE = p.found.object[0];
  if (objE?.alts?.length > 1) {
    const pick = objE.alts.find((id) => OBJECTS[id].at === s.place) || objE.alts.find((id) => parentPlace(OBJECTS[id].at || '') === parentPlace(s.place)) || objE.alts[0];
    objE = { ...objE, id: pick };
  }
  if (!objE) {
    // "search the study", "look around" with only a place
    const placeE = p.found.place[0];
    if (placeE && placeE.id !== s.place) {
      if (!goTo(s, placeE.id, out)) return;
    }
    return searchRoom(s, p, out);
  }
  const def = OBJECTS[objE.id];
  if (def.at && def.at !== s.place) {
    const sameHouse = parentPlace(def.at) === parentPlace(s.place) && def.at !== s.place;
    if (def.at === 'marlowe_house' && parentPlace(s.place) === 'marlowe_house') { /* fine from the study, too */ }
    else if (sameHouse || knowsPlace(s, def.at)) {
      const closed = placeClosed(s, def.at);
      if (closed) { out.push(narr(closed)); return; }
      if (!goTo(s, def.at, out)) return;
    } else { out.push(narr('That is not something you can reach from here.')); return; }
  }
  const cands = OPTIONS.filter((o) => o.kind === 'examine' && o.obj === objE.id);
  if (!cands.length) { out.push(narr('You give it a thorough look and find nothing of consequence.')); advance(s, 5); return; }
  const r = pickOption(s, p, cands, null);
  if (r.pick) {
    if (r.repeat) {
      out.push(narr('You have been over this already. Nothing new presents itself.'));
      const known = (r.pick.o.gives || []).filter((f) => hasFact(s, f)).map((f) => FACTS[f].label);
      if (known.length) out.push(sys('You noted: ' + known[0]));
      advance(s, 2);
      return;
    }
    applyOption(s, r.pick.o, p, out);
    return;
  }
  const blocked = cands.map((o) => ({ o, st: needStatus(s, o, p) })).sort((a, b) => a.st.miss.length - b.st.miss.length)[0];
  if (blocked.o.gives?.length && blocked.o.gives.every((f) => hasFact(s, f))) { out.push(narr('You have already learned what this has to tell you.')); advance(s, 2); return; }
  for (const l of blocked.o.refuse || ['You cannot do that yet.']) out.push(lineFrom(l));
  advance(s, 3);
}

function searchRoom(s, p, out) {
  const here = s.place;
  const items = OPTIONS.filter((o) => o.kind === 'examine' && OBJECTS[o.obj]?.at === here && !s.done[o.id] && needStatus(s, o, p).ok);
  const seen = new Set();
  const list = items.filter((o) => (seen.has(o.obj) ? false : (seen.add(o.obj), true)));
  if (!list.length) { out.push(narr('You have been over every inch of it. There is nothing more.')); return; }
  out.push(narr('You set to work methodically, on hands and knees where necessary.'));
  for (const o of list) applyOption(s, o, p, out);
}

// ---------------------------------------------------------------- services (the Irregulars)
function service(s, p, out) {
  const targets = p.found.person.map((e) => e.id).concat(p.found.place.map((e) => e.id));
  let topicKeys = Object.keys(p.topics);
  if (/follow|tail|shadow|watch/i.test(p.raw)) topicKeys.push('tail');
  if (!topicKeys.length) topicKeys = ['tail', 'key', 'debts', 'paper'];
  const cands = OPTIONS.filter((o) => o.kind === 'service');
  const pre = cands.map((o) => {
    const tMatch = (o.targets || []).filter((t) => targets.includes(t)).length;
    const topMatch = o.topics.filter((t) => topicKeys.includes(t)).length;
    return { o, tMatch, topMatch };
  }).filter((x) => x.topMatch || x.tMatch);
  const ok = pre.map((x) => ({ ...x, st: needStatus(s, x.o, p) }));
  const good = ok.filter((x) => x.st.ok).sort((a, b) => (b.tMatch * 6 + b.topMatch) - (a.tMatch * 6 + a.topMatch));
  const fresh = good.find((x) => !s.done[x.o.id]) || null;
  if (fresh) { applyOption(s, fresh.o, p, out); return; }
  if (good.length) { out.push(narr('Wiggins has already been given that errand. Nothing more can come of it.')); return; }
  const blocked = ok.find((x) => x.o.refuse);
  if (blocked) { for (const l of blocked.o.refuse) out.push(lineFrom(l)); return; }
  out.push(say('Wiggins', 'I could do with a name, a street, or a thing to look for, Mr. Holmes. Tell me what you want the boys to find.'));
}

// ---------------------------------------------------------------- waiting, flavour
function waitFor(s, p, out) {
  const tm = p.time;
  let mins = 60;
  let cap = 16 * 60;
  if (tm?.untilDay != null) {
    const target = tm.untilDay * 1440 + tm.until;
    if (target <= s.t) { out.push(narr('That day is already here, or past. Say what you would do with it.')); return; }
    mins = target - s.t; cap = 6 * 1440;
  } else if (tm?.duration) { mins = tm.duration; if (mins > cap) cap = mins; }
  else if (tm?.until != null) {
    let target = dayOf(s.t) * 1440 + tm.until;
    if (tm.nextDay || target <= s.t) target += 1440;
    mins = target - s.t;
  }
  mins = Math.max(5, Math.min(mins, cap));
  if (s.t + mins >= deadlineNow(s) - 30) { out.push(narr('You cannot afford to wait that long. The quarry sails at ' + clockText(deadlineNow(s)).replace(/^\w+ \d+ October, /, '') + ' on ' + clockText(deadlineNow(s)).split(' ').slice(0, 3).join(' ').replace(',', '') + ', and waiting that long would hand him the victory.')); return; }
  const { arrived, slept } = advance(s, mins);
  out.push(narr(mins >= 480 ? 'You sleep, and take the day as it comes.' : mins >= 120 ? 'The hours go by with the fog.' : 'You wait.'));
  deliver(s, arrived, out);
  if (slept) out.push(sys('The small hours have come and gone. You rise at eight.'));
}

function playFlavour(s, p, out) {
  if (/violin|stradivarius|music|tune/i.test(p.raw)) out.push(narr('You take up the Stradivarius and saw out a slow, wandering air. Watson, who has heard worse, goes on with his paper. The thinking is easier, and the quarter-hour is gone.'));
  else if (/pipe|tobacco|slipper|shag/i.test(p.raw)) out.push(narr('You fill the pipe from the Persian slipper and think in a long blue cloud.'));
  else if (/bullet|revolver|v\.?r\.?|wall/i.test(p.raw)) out.push(narr('You consider the V.R. in bullet-pocks on the wall. Mrs. Hudson would not approve. You put the revolver down.'));
  else out.push(narr('You amuse yourself for a little. It does not hurt the case.'));
  const { arrived } = advance(s, 15); deliver(s, arrived, out);
}

// ---------------------------------------------------------------- suggestions (a nudge, never a menu)
const TOPIC_LABEL = { theft: 'the theft', evening: 'that evening', guests: 'the guests', combination: 'the combination', key: 'the key', safe: 'the safe', note: 'the note', paper: 'the paper', hand: 'the handwriting', ink: 'the ink', debts: 'money troubles', sister: 'his sister', sale: 'a sale of the Star', insurance: 'the insurance', quarrel: 'a quarrel', stairs: 'the back stairs', garden: 'the garden', light: 'the study lamp', servants: 'the servants', boat: 'the boat trains', fence: 'a fence', professional: 'professional thieves', record: 'a record', warrant: 'a warrant', police: 'the police', curse: 'the Star’s curse', value: 'the Star’s value', character: 'his character', employer: 'his employer', lodging: 'his lodging', letters: 'his letters', customers: 'the customers', warn: 'a warning', callers: 'the callers at the door' };
export function suggest(s) {
  const out = [];
  const h = parentPlace(s.place);
  const here = peopleHere(s);
  const asked = (id) => OPTIONS.some((o) => o.who === id && s.done[o.id]);
  if (h === 'baker_street') {
    if (!hasFact(s, 'theft')) out.push('Examine the telegram');
    if (hasFlag(s, 'has_note') && !hasFact(s, 'paper_joynson')) out.push('Compare the note with my paper specimens');
    if (!s.papersRead.length) out.push('Ask Watson to read the morning papers');
  }
  if (h === 'marlowe_house' && !hasFlag(s, 'has_note')) out.push('Question Sir Alistair');
  // people on the spot you have not yet spoken to
  for (const id of here) {
    if (['watson', 'hudson'].includes(id) || asked(id)) continue;
    out.push(`Question ${PEOPLE[id].short}`);
  }
  // a thread worth pulling with someone you have already questioned here
  const basicOk = (o) => { const n = o.need || {}; return (n.facts || []).every((f) => hasFact(s, f)) && (!n.anyFacts || n.anyFacts.some((f) => hasFact(s, f))) && (n.notFacts || []).every((f) => !hasFact(s, f)) && (n.flags || []).every((f) => hasFlag(s, f)) && (n.notFlags || []).every((f) => !hasFlag(s, f)) && !n.pay && !n.evidence && n.alertAtLeast == null; };
  for (const id of here) {
    if (['watson', 'hudson'].includes(id) || !asked(id)) continue;
    const o = OPTIONS.find((x) => x.who === id && x.kind === 'ask' && !x.remote && !s.done[x.id] && x.topics.some((tp) => tp !== 'greet' && TOPICS[tp]) && basicOk(x) && (x.gives.length || x.learnsP || x.learnsPl));
    if (o) { const tp = o.topics.find((x) => x !== 'greet' && TOPICS[x]); out.push(`Ask ${PEOPLE[id].short} ${o.need?.tone === 'gentle' ? 'gently ' : o.need?.tone === 'harsh' ? 'sharply ' : ''}about ${TOPIC_LABEL[tp] || TOPICS[tp][0]}`); break; }
  }
  // rooms to search where you stand
  const exam = OPTIONS.filter((o) => o.kind === 'examine' && OBJECTS[o.obj]?.at === s.place && !s.done[o.id]);
  if (exam.length) out.push(s.place === 'marlowe_study' ? 'Search the study' : 'Search the room');
  // people you know of, elsewhere, not yet questioned
  for (const id of s.known.people) {
    if (['watson', 'hudson'].includes(id) || here.includes(id) || asked(id)) continue;
    const per = PEOPLE[id]; if (!per) continue;
    if (id === 'wiggins') { if (s.known.people.includes('pell') && !s.done.wi_tail_pell) out.push('Send the Irregulars to follow Pell'); continue; }
    out.push(per.remote ? `Wire ${per.short}` : `Question ${per.short}`);
  }
  // places you know of but have never been to
  for (const id of s.known.places) {
    const pl = PLACES[id]; if (!pl || parentPlace(id) !== id || id === 'baker_street') continue;
    if (!s.flags['visited_' + id] && id !== h) out.push(`Go to ${pl.short}`);
  }
  if (h === 'baker_street' && hasFlag(s, 'has_note')) out.push('Think it over');
  const uniq = [...new Set(out)];
  if (uniq.length < 5 && h !== 'baker_street') uniq.push('Go home');
  if (!uniq.length) uniq.push('Think it over');
  return uniq.slice(0, 5);
}

export { peopleHere };
