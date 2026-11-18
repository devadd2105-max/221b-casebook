import fs from 'node:fs'; const require_fs = fs;
// Random-order playthroughs: every run is a different player. Looks for soft-locks, dead options and unwinnable states.
import { newGame, act, OPTIONS, PEOPLE, PLACES, OBJECTS, TOPICS, clone, hasFact, hasFlag } from './lib.mjs';
import { personName, toneWords } from './lib.mjs';
import { weighEvidence } from '../../js/evidence.js';
import { accuse } from '../../js/scoring.js';
import { deadlineNow } from '../../js/state.js';

let seed = +process.argv[2] || 1; const N = +process.argv[3] || 200;
const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const pick = (a) => a[Math.floor(rnd() * a.length)];
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function commandsFor(o, sloppy) {
  const names = [];
  const topics = (o.topics || []).filter((t) => t !== 'greet' && TOPICS[t]);
  const tp = topics.length ? TOPICS[pick(topics)] : [];
  const phrase = tp.length ? pick(tp.slice(0, 4)) : '';
  let tone = pick(toneWords(o)); if (sloppy && rnd() < 0.25) tone = pick(['', 'gently', 'sharply']);
  if (HARSH && rnd() < HARSH) tone = pick(['sharply', 'and tell him I know everything, you liar', 'and I will have you arrested']);
  const pay = o.need?.pay ? ` and I will pay ${o.need.pay} shillings` : '';
  const mention = o.need?.mention ? ' ' + o.need.mention.map((m) => PEOPLE[m].names[0]).join(' ') : '';
  if (o.kind === 'ask') {
    const n = personName(o.who);
    const verb = o.remote || PEOPLE[o.who].remote ? 'wire' : pick(['ask', 'question', 'press']);
    names.push(`${verb} ${n} ${tone} about ${phrase}${pay}${mention}`.replace(/\s+/g, ' '));
  } else if (o.kind === 'examine') {
    names.push(`examine the ${pick(OBJECTS[o.obj].names.filter((x) => x.length > 3))}${mention}`);
  } else if (o.kind === 'service') {
    const t = (o.targets || [])[0]; const tn = t ? (PEOPLE[t]?.names[0] || PLACES[t]?.names[0]) : '';
    names.push(`send the irregulars to ${pick(['follow', 'watch', 'find out about'])} ${tn || phrase || 'the pawnbrokers'}`);
  }
  return names;
}

const SKIP = +process.argv[4] || 0; const HARSH = +process.argv[5] || 0; const ALERT = +process.argv[6] || 0; const PURSE = process.argv[7] != null ? +process.argv[7] : null; const tWins = [];
const dead = {}; const outcomes = { airtight: 0, sound: 0, thin: 0, flimsy: 0 }; let stone = 0, late = 0, fled = 0, crashes = 0, noWin = []; const grades = [];
for (let run = 0; run < N; run++) {
  const s = newGame(); const sloppy = rnd() < 0.5; const log = []; const skipped = new Set(OPTIONS.filter(() => rnd() < SKIP).map((o) => o.id)); let tWin = null;
  const doit = (c) => { log.push(c); return act(s, c); };
  try {
    // a handful of noise actions at the start: a real player dithers
    if (rnd() < 0.5) doit(pick(['read the telegram', 'look around', 'think', 'ask watson what he thinks']));
    if (PURSE != null) s.purse = PURSE;
    if (ALERT) { s.alert = ALERT; doit('wait 5 minutes'); }
    let stuck = 0;
    for (let step = 0; step < 400 && !s.ended && stuck < 3; step++) {
      if (tWin == null && weighEvidence(s).grade === 'airtight' && hasFlag(s, 'stone_found')) { tWin = s.t; break; }
      const pool = shuffle(OPTIONS).filter((o) => !skipped.has(o.id));
      let fired = false;
      for (const o of pool) {
        if (s.done[o.id]) continue;
        for (const c of commandsFor(o, sloppy)) {
          const t = clone(s); act(t, c);
          if (t.done[o.id] && !t.ended) { doit(c); fired = true; break; }
        }
        if (fired) break;
      }
      if (!fired) {
        // other things a player does: compare paper, read papers, wait for a shop to open
        const extras = ['compare the note with joynson', 'read the papers all of them', 'wait until morning', 'wait until monday', 'think'];
        let any = false;
        for (const c of shuffle(extras)) { const t = clone(s); const bt = JSON.stringify(t.done) + t.t + Object.keys(t.facts || {}).length; act(t, c); if (JSON.stringify(t.done) + t.t + Object.keys(t.facts || {}).length !== bt && !t.ended) { doit(c); any = true; break; } }
        if (!any) stuck++;
        if (rnd() < 0.2) doit('wait an hour');
      } else stuck = 0;
      if (rnd() < 0.08) doit(pick(['wait 30 minutes', 'think', 'go home', 'ask watson what he makes of it']));
    }
    if (tWin != null) tWins.push(tWin);
    const ev = weighEvidence(s); outcomes[ev.grade] = (outcomes[ev.grade] || 0) + 1;
    const gotStone = hasFlag(s, 'stone_found'); if (gotStone) stone++;
    if (s.ended) late++; if (s.fled) fled++;
    const res = accuse(clone(s), 'pell', 'mercy');
    grades.push(res.total);
    if (!s.ended && ev.grade === 'airtight' && !gotStone && process.env.DUMP) { require_fs.writeFileSync('/tmp/nostone.json', JSON.stringify(s)); }
    if (!s.ended && ev.grade === 'airtight' && !gotStone) console.log('NOSTONE run', run, 't', s.t, 'alert', s.alert, 'fled', s.fled, 'flags', Object.keys(s.flags).filter((f) => /stone|moved|moss|warrant|hodge/.test(f)).join(','), 'last', JSON.stringify(log.slice(-6)));
    if (!s.ended && ev.grade !== 'airtight') noWin.push({ run, grade: ev.grade, t: s.t, log: log.slice(-12), undone: OPTIONS.filter((o) => !s.done[o.id]).map((o) => o.id) });
    for (const o of OPTIONS) if (!s.done[o.id]) dead[o.id] = (dead[o.id] || 0) + 1;
  } catch (e) { crashes++; console.log('CRASH', e.stack.split('\n').slice(0, 3).join(' | ')); }
}
const tw = tWins.sort((a, b) => a - b); const dl = deadlineNow(newGame());
console.log({ runs: N, skipProb: SKIP, solved: tw.length, solvedInTime: tw.filter((x) => x < dl).length, medianDay: tw.length ? (tw[Math.floor(tw.length / 2)] / 1440).toFixed(2) : null, p90Day: tw.length ? (tw[Math.floor(tw.length * 0.9)] / 1440).toFixed(2) : null, crashes, outcomes, stone, deadlineHit: late, pellFled: fled, avgScore: Math.round(grades.reduce((a, b) => a + b, 0) / grades.length) });
const deadList = Object.entries(dead).sort((a, b) => b[1] - a[1]);
console.log('options never completed (count of runs):', deadList.slice(0, 25).map(([k, v]) => `${k}:${v}`).join(' '));
console.log('non-airtight, alive, stuck runs:', noWin.length);
for (const w of noWin.slice(0, 3)) console.log(JSON.stringify({ grade: w.grade, t: w.t, last: w.log, undone: w.undone.slice(0, 12) }));
