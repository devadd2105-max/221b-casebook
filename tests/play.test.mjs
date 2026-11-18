import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, hasFact, hasFlag } from '../js/state.js';
import { act, suggest, paperSheets } from '../js/engine.js';
import { IDEAL_COMMANDS, accuse } from '../js/scoring.js';
import { weighEvidence } from '../js/evidence.js';
import { parse } from '../js/parser.js';

function run(cmds, s = newGame()) { for (const c of cmds) act(s, c); return s; }

test('ideal route reaches airtight evidence and the stone', () => {
  const s = run(IDEAL_COMMANDS);
  const ev = weighEvidence(s);
  assert.equal(ev.grade, 'airtight', JSON.stringify(ev));
  assert.ok(hasFlag(s, 'stone_found'));
  const r = accuse(s, 'pell', 'mercy');
  assert.ok(r.total > 700, 'score ' + r.total);
});

test('wrong accusation is heavily penalised', () => {
  const s = run(['go to marlowe house', 'interview sir alistair']);
  const r = accuse(s, 'ashby', 'prosecute');
  assert.ok(r.total <= 60);
});

test('testimony-only route (no study at all) can still reach sound evidence', () => {
  const s = run([
    'go to marlowe house', 'interview sir alistair',
    'ask mary gently about the stairs', 'ask pell gently about his sister',
    'ask reeve about the callers at the door',
    'ask sir alistair about the key',
    'go home', 'compare the note with joynson',
  ]);
  const ev = weighEvidence(s);
  assert.ok(['sound', 'airtight'].includes(ev.grade), JSON.stringify(ev));
});

test('Monday shops route', () => {
  const s = run([
    'go to marlowe house', 'interview sir alistair', 'examine the keyhole',
    'ask mary gently about the stairs', 'ask reeve about the callers at the door', 'examine the copybook', 'go home', 'compare the note with joynson',
    'wait until tomorrow', 'ask lestrade about handwriting',
    'ask tench if it was mr pell who had the key cut',
    'ask peabody if pell buys joynson paper',
    'ask finch to compare the note with pell hand',
    'ask crake about pell debts',
  ]);
  assert.ok(hasFact(s, 'tench_dup'), 'tench');
  assert.ok(hasFact(s, 'paper_ledger_pell'), 'ledger');
  assert.ok(hasFact(s, 'hand_matches_pell'), 'finch');
  assert.ok(hasFact(s, 'pell_debt'), 'crake');
});

test('mary shuts up if you are harsh', () => {
  const s = run(['go to marlowe house', 'ask mary roughly what she saw, or I shall have you arrested']);
  assert.ok(!hasFact(s, 'mary_stairs'));
});

test('typos and loose phrasing', () => {
  const p = parse('Intrerview sir alisttair abuot the safe key plz');
  assert.ok(p.found.person.some((e) => e.id === 'sir_alistair'));
  assert.ok(p.topics.key);
});

test('papers: the rumour sheet lies, the Times does not', () => {
  const s = run(['wait until tomorrow', 'ask watson to read the illustrated police news', 'ask watson to read the times']);
  assert.ok(hasFact(s, 'press_junk'));
  assert.ok(hasFact(s, 'press_times_rumour'));
});

test('closed shops on Sunday', () => {
  const s = run(['go to marlowe house', 'interview sir alistair', 'examine the keyhole', 'go to tench']);
  assert.notEqual(s.place, 'tench_shop');
});

test('deadline ends the game', () => {
  const s = newGame();
  for (let i = 0; i < 40 && !s.ended; i++) act(s, 'wait until tomorrow');
  for (let i = 0; i < 30 && !s.ended; i++) act(s, i % 2 ? 'go to marlowe house' : 'go to baker street');
  assert.equal(s.ended?.kind, 'escaped');
});

test('alarming Pell moves the deadline and the stone', () => {
  const s = run(['go to marlowe house', 'interview sir alistair', 'ask mary gently about the stairs', 'ask pell about the library', 'ask pell what he was doing on the back stairs, mary saw you there', 'ask pell to write a note for me']);
  assert.ok(s.alert >= 25);
});

test('Lestrade route: warrant, landlady, stone', () => {
  const s = run([
    'go to marlowe house', 'interview sir alistair', 'ask sir alistair about pell',
    'ask mary gently about the stairs', 'ask reeve about the callers at the door', 'ask sir alistair about the key',
    'examine the keyhole', 'go home', 'compare the note with joynson', 'wait until tomorrow',
    'ask tench if it was mr pell who had the key cut',
    'ask lestrade for a warrant to search pell lodging',
  ]);
  assert.ok(hasFlag(s, 'warrant'), 'warrant');
  run(['ask mrs hodge about the warrant', 'examine the books'], s);
  assert.ok(hasFlag(s, 'stone_found'), 'stone');
});

test('Pell confesses when the case is sound and he is confronted, if not alarmed', () => {
  const s = run([
    'go to marlowe house', 'interview sir alistair', 'ask mary gently about the stairs', 'ask reeve about the callers at the door',
    'ask pell gently about his sister', 'ask sir alistair about the key', 'examine under the desk', 'go home', 'compare the note with joynson',
    'go to marlowe house',
  ]);
  act(s, 'ask pell about the library');
  act(s, 'confront pell with everything: the maid on the back stairs, the key, the debt, the paper');
  assert.ok(hasFlag(s, 'pell_confessed') || hasFlag(s, 'pell_shaken'));
});

test('typo matcher does not turn "match" into "watch" (no accidental Irregulars errand)', () => {
  const s = run(['go to marlowe house', 'interview sir alistair', 'go home']);
  const purse = s.purse;
  act(s, 'who can tell me if two handwritings match');
  assert.equal(s.purse, purse);
  assert.ok(s.known.people.includes('finch'));
});

test('small talk, recap and utility commands never fall into a dead end', () => {
  const s = newGame();
  for (const c of ['hello', 'who am i', 'what is this about', 'how much money do I have', 'what time is it']) {
    const r = act(s, c);
    assert.ok(r.out.length > 0, c);
    assert.ok(!r.out.some((o) => /not quite a thing you can do/.test(o.text || '')), c);
  }
  assert.equal(act(s, 'show the map').ui.open, 'map');
  assert.equal(act(s, 'open my casebook').ui.open, 'casebook');
});

test('go back and leave return you sensibly', () => {
  const s = run(['go to marlowe house', 'go to the study']);
  act(s, 'go back');
  assert.equal(s.place, 'marlowe_house');
  act(s, 'leave');
  assert.ok(s.place);
});

test('suggestions always exist and never repeat', () => {
  const s = newGame();
  for (const c of ['go to marlowe house', 'interview sir alistair', 'go to the study']) {
    act(s, c);
    const sg = suggest(s);
    assert.ok(sg.length > 0);
    assert.equal(new Set(sg).size, sg.length);
  }
});

test('a saved game survives a JSON round trip and still reaches the same ending', () => {
  const half = IDEAL_COMMANDS.slice(0, Math.floor(IDEAL_COMMANDS.length / 2));
  const s1 = run(half);
  const s2 = JSON.parse(JSON.stringify(s1));
  const rest = IDEAL_COMMANDS.slice(half.length);
  run(rest, s1); run(rest, s2);
  assert.equal(weighEvidence(s2).grade, weighEvidence(s1).grade);
  assert.equal(accuse(s2, 'pell', 'mercy').total, accuse(s1, 'pell', 'mercy').total);
});

test('papers are passed over, shown in a reader, and Watson can give the gist', () => {
  const s = newGame();
  let r = act(s, 'ask watson to read the papers');
  assert.ok(s.awaitPapers);
  r = act(s, "all of them, let's hear the facts on the case");
  assert.equal(r.ui.open, 'papers');
  assert.equal(r.ui.ids.length, 6);
  const sheets = paperSheets(s, r.ui.ids);
  assert.ok(sheets.every((x) => x.name && x.date));
  r = act(s, 'give me the summary');
  assert.ok(r.out.length > 5);
  r = act(s, 'read the times');
  assert.equal(r.ui.open, 'papers');
});

test('after Watson asks which paper, the suggestions offer the papers', () => {
  const s = newGame();
  act(s, 'Watson, read the papers');
  const chips = suggest(s);
  assert.equal(chips[0], 'All of them');
  assert.ok(chips.length >= 7);
  act(s, chips[0]);
  assert.notEqual(suggest(s)[0], 'All of them');
});

test('asking for the papers away from Baker Street gets a useful answer', () => {
  const s = newGame(); act(s, 'go to marlowe house');
  const r = act(s, 'Watson, read the papers');
  assert.match(JSON.stringify(r.out), /back at Baker Street/);
});
