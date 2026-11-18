// The controller: wires the engine to the page.
import { newGame, load, save, wipe, timeLeft, deadlineNow, hasFact, hasFlag } from './state.js';
import { act, suggest, compareMaker, peopleHere } from './engine.js';
import { FACTS, CONTRADICTIONS } from './case/facts.js';
import { PEOPLE, PLACES, MAKERS, MAKER_ORDER, parentPlace } from './case/world.js';
import { weighEvidence } from './evidence.js';
import { accuse, escaped, epilogue, reportLines, IDEAL_COMMANDS, IDEAL_NARRATIVE, formatSpan, SUSPECTS } from './scoring.js';
import { clockText, money, dayOf, START } from './clock.js';
import { renderScene } from './art/scenes.js';
import { room221b } from './art/room221b.js';
import { portrait } from './art/portraits.js';
import { mapSVG } from './art/london.js';
import { esc } from './art/common.js';
import { lightTint } from './art/common.js';

const $ = (s, r = document) => r.querySelector(s);
let S = null;
let busy = false;
let sceneKey = '';

// ------------------------------------------------------------------ title
function showTitle() {
  $('#title-art').innerHTML = room221b({ t: 19 * 60 });
  $('#title').classList.remove('hidden');
  $('#app').classList.add('hidden');
  const saved = load();
  $('#btn-continue').classList.toggle('hidden', !saved || !!saved.ended);
}

function startNew() {
  wipe();
  S = newGame();
  $('#title').classList.add('hidden');
  $('#app').classList.remove('hidden');
  $('#log').innerHTML = '';
  sceneKey = '';
  refresh(true);
  intro();
  $('#in').focus({ preventScroll: true });
}

function resume() {
  S = load();
  if (!S) return startNew();
  $('#title').classList.add('hidden');
  $('#app').classList.remove('hidden');
  $('#log').innerHTML = '';
  sceneKey = '';
  refresh(true);
  line('sys', 'You pick up the case where you left it.');
  line('narr', `It is ${clockText(S.t)}. You are at ${PLACES[S.place].name}.`);
  $('#in').focus({ preventScroll: true });
}

function intro() {
  const L = [
    ['place', '221B Baker Street'],
    ['narr', 'Sunday, the twelfth of October, 1890. Twenty to nine. The fog has not lifted since Friday, and the rain has taken its place against the glass.'],
    ['narr', 'The fire is lit. Watson is behind the Sunday paper, pretending not to watch you. On the table lies the telegram Mrs. Hudson brought up at breakfast, still unopened, with the chemical table crowding it into one corner.'],
    ['say', 'Watson', 'Well, Holmes? You have been looking at that envelope for ten minutes. Open it, or I shall.'],
    ['sys', 'You are Sherlock Holmes. Type anything: where to go, whom to question, what to examine. Click glowing objects in the room, or use the casebook and map.'],
  ];
  for (const l of L) line(...l);
  chips(['Examine the telegram', 'Ask Watson to read the morning papers', 'Ask Watson what he makes of it']);
}

// ------------------------------------------------------------------ the log
function line(kind, a, b, opts = {}) {
  const el = document.createElement('p');
  el.className = kind;
  if (kind === 'say') { el.innerHTML = `<b>${esc(a)}</b>“${esc(b)}”`; }
  else if (kind === 'learn') { el.className = 'learn' + (opts.claim ? ' claim' : ''); el.textContent = a; }
  else el.textContent = a;
  el.style.animationDelay = (opts.delay || 0) + 'ms';
  const log = $('#log');
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}

function render(out) {
  let d = 0;
  for (const o of out) {
    const o0 = { delay: d };
    switch (o.k) {
      case 'narr': line('narr', o.text, null, o0); d += 80; break;
      case 'say': line('say', o.who, o.text, o0); d += 120; break;
      case 'sys': line('sys', o.text, null, o0); break;
      case 'learn': line('learn', o.text, null, { ...o0, claim: o.kind === 'claim' }); d += 80; break;
      case 'place': line('place', o.text, null, o0); break;
      case 'alert': line('alert', o.text, null, o0); toast(o.text); break;
      case 'suggest': chips(o.items); break;
      case 'end': break;
      default: break;
    }
  }
  const log = $('#log'); log.scrollTop = log.scrollHeight;
  setTimeout(() => { log.scrollTop = log.scrollHeight; }, 120 + d);
}

function chips(items) {
  const box = $('#chips');
  box.innerHTML = '';
  for (const t of items) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = t;
    b.addEventListener('click', () => submit(t));
    box.appendChild(b);
  }
}

let toastT = 0;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.classList.remove('hidden');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.add('hidden'), 4200);
}

// ------------------------------------------------------------------ HUD, stage, portrait
function refresh(force = false) {
  $('#clock').textContent = clockText(S.t);
  $('#where').textContent = PLACES[S.place].name;
  $('#purse').textContent = money(Math.max(0, Math.round(S.purse)));
  const left = Math.max(0, timeLeft(S));
  const d = Math.floor(left / 1440), h = Math.floor((left % 1440) / 60);
  $('#deadline').textContent = d ? `${d} d ${h} h` : `${h} h ${Math.floor(left % 60)} m`;
  $('#deadline').style.color = left < 720 ? '#ff9d8a' : '';
  $('#alert i').style.width = Math.min(100, S.alert) + '%';
  const hour = ((S.t % 1440) / 60);
  const key = S.place + '|' + JSON.stringify(lightTint(hour)).length + '|' + lightTint(hour).sky;
  if (force || key !== sceneKey) {
    const placeChanged = !sceneKey || sceneKey.split('|')[0] !== S.place;
    sceneKey = key;
    const stage = $('#stage');
    const paint = () => { stage.innerHTML = renderScene(S.place, S); stage.classList.remove('swap'); };
    if (placeChanged && !force) { stage.classList.add('swap'); setTimeout(paint, 380); } else paint();
  }
  const who = S.last.who;
  const here = peopleHere(S);
  const pEl = $('#portrait');
  if (who && who !== 'watson' && here.includes(who) && PEOPLE[who]) { pEl.innerHTML = portrait(who, { size: 190 }); pEl.classList.remove('hidden'); }
  else if (who && PEOPLE[who]?.remote && S.log.length && S.log[S.log.length - 1]?.who === who) { pEl.innerHTML = portrait(who, { size: 190 }); pEl.classList.remove('hidden'); }
  else pEl.classList.add('hidden');
  save(S);
}

// ------------------------------------------------------------------ acting
async function submit(text) {
  text = String(text || '').trim();
  if (!text || busy || !S) return;
  if (S.ended) { openEnd(); return; }
  busy = true;
  line('you', text);
  const prevPlace = S.place;
  const { out, ui } = act(S, text);
  render(out);
  chips(suggest(S));
  refresh();
  $('#in').value = '';
  if (S.ended?.kind === 'escaped') { setTimeout(() => openEnd(), 1400); }
  else if (ui) setTimeout(() => openUI(ui), 450);
  busy = false;
}

// ------------------------------------------------------------------ overlays
function openOverlay(html, cls = '') {
  const o = $('#overlay');
  o.innerHTML = `<div class="sheet ${cls}">${html}</div>`;
  o.classList.remove('hidden');
  o.querySelector('.close')?.addEventListener('click', closeOverlay);
  o.addEventListener('mousedown', (e) => { if (e.target === o) closeOverlay(); }, { once: true });
  return o;
}
function closeOverlay() { $('#overlay').classList.add('hidden'); $('#overlay').innerHTML = ''; $('#in').focus({ preventScroll: true }); }

function openUI(ui) {
  if (ui.open === 'specimens') openSpecimens();
  else if (ui.open === 'accuse') openAccuse(ui.suspect);
  else if (ui.open === 'casebook') openCasebook();
  else if (ui.open === 'map') openMap();
}

const GROUPS = [
  ['scene', 'The scene of the crime'], ['note', 'The note, the paper and the hand'], ['means', 'The key'], ['witness', 'Who saw what'],
  ['motive', 'Money and motive'], ['motive-red', 'Other quarrels'], ['sale', 'Sir Alistair’s secrets'], ['flight', 'Flight'], ['recovery', 'The stone'], ['outside', 'Scotland Yard'], ['press', 'The newspapers'],
];

function openCasebook(tab = 'evidence') {
  const tabs = [['evidence', 'Evidence'], ['people', 'People'], ['timeline', 'Timeline'], ['notes', 'My notes']];
  const html = `<button class="close" aria-label="Close">×</button>
  <h2>The Casebook</h2><p class="lead">The Marlowe Star: everything you have learned, and nothing you have not.</p>
  <div class="tabs" role="tablist">${tabs.map(([id, n]) => `<button role="tab" data-tab="${id}" aria-selected="${id === tab}">${n}</button>`).join('')}</div>
  <div class="page" id="page"></div>
  <div class="row-btns"><button class="btn primary" id="cb-accuse">Name the culprit</button><button class="btn" id="cb-close">Back to the case</button></div>`;
  openOverlay(html);
  const page = $('#page');
  const draw = (t) => {
    document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === t));
    if (t === 'evidence') page.innerHTML = evidenceHTML();
    if (t === 'people') page.innerHTML = peopleHTML();
    if (t === 'timeline') page.innerHTML = timelineHTML();
    if (t === 'notes') { page.innerHTML = `<textarea class="notes" id="notes" placeholder="Your own jottings, theories and doubts…" spellcheck="false">${esc((S.notebook || []).join('\n'))}</textarea>`; $('#notes').addEventListener('input', (e) => { S.notebook = [e.target.value]; save(S); }); }
  };
  document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => draw(b.dataset.tab)));
  $('#cb-close').addEventListener('click', closeOverlay);
  $('#cb-accuse').addEventListener('click', () => openAccuse());
  draw(tab);
}

function evidenceHTML() {
  const ids = Object.keys(S.facts);
  if (!ids.length) return '<p class="empty">The casebook is empty. Holmes begins, as he always does, knowing nothing.</p>';
  let h = '';
  const clashes = CONTRADICTIONS.filter((c) => hasFact(S, c.a) && hasFact(S, c.b));
  if (clashes.length) h += `<h3>Lies and contradictions</h3>${clashes.map((c) => `<div class="clash"><b>Contradiction.</b> ${esc(c.label)}</div>`).join('')}`;
  for (const [cat, title] of GROUPS) {
    const list = ids.filter((id) => (FACTS[id].cat || 'scene') === cat).sort((a, b) => S.facts[a].t - S.facts[b].t);
    if (!list.length) continue;
    h += `<h3>${title}</h3><ul>${list.map((id) => `<li class="${FACTS[id].kind === 'claim' ? 'claim' : ''}">${esc(FACTS[id].label)}</li>`).join('')}</ul>`;
  }
  const ev = weighEvidence(S);
  h += `<h3>Where it stands</h3><p>Your strongest case against any one person: <b>${ev.grade === 'none' ? 'nothing yet' : ev.grade}</b>. Means ${'●'.repeat(ev.by.means)}${'○'.repeat(3 - ev.by.means)}, motive ${'●'.repeat(ev.by.motive)}${'○'.repeat(3 - ev.by.motive)}, opportunity ${'●'.repeat(ev.by.opportunity)}${'○'.repeat(3 - ev.by.opportunity)}, the hand and the paper ${'●'.repeat(ev.by.identity)}${'○'.repeat(3 - ev.by.identity)}.</p>`;
  return h;
}

function peopleHTML() {
  const ids = S.known.people.filter((id) => PEOPLE[id] && id !== 'watson');
  return `<div class="people">${ids.map((id) => `<div class="person">${portrait(id, { size: 66, frame: false })}<div><b>${esc(PEOPLE[id].name)}</b><span>${esc(PEOPLE[id].role)}${PEOPLE[id].home ? ' · ' + esc(PLACES[PEOPLE[id].home].short) : ''}</span></div></div>`).join('')}</div>`;
}

const TIMELINE = [
  ['8.00 p.m.', 'guest_list'], ['9.15 p.m.', 'pell_left_early'], ['10.00 p.m.', 'gradwell_left'], ['10.00 p.m.', 'ashby_billiards'], ['10.00–11.15 p.m.', 'reeve_not_at_door'],
  ['10.30 p.m.', 'mary_stairs'], ['10.35 p.m.', 'reeve_light'], ['11.00 p.m.', 'theft'], ['11.30 p.m.', 'tull_pell'], ['Midnight', 'hodge_heavy'],
];
function timelineHTML() {
  const rows = TIMELINE.filter(([, f]) => hasFact(S, f));
  if (!rows.length) return '<p class="empty">Saturday evening is a blank. Ask who was where, and when.</p>';
  return `<h3>Saturday, the eleventh of October</h3><div class="timeline">${rows.map(([t, f]) => `<div class="row"><time>${t}</time>${esc(FACTS[f].label)}</div>`).join('')}<div class="row gap"><time>?</time>Who was where between a quarter to ten and half past eleven, when the Star was taken?</div></div>`;
}

function openMap() {
  openOverlay(`<button class="close" aria-label="Close">×</button><h2>London, 1890</h2><p class="lead">Click a pin to go there. Cab fares and the clock apply. Shops keep Sabbath hours.</p><div class="mapwrap">${mapSVG(S)}</div>`);
  document.querySelectorAll('.pin').forEach((p) => {
    const go = () => { const c = p.dataset.cmd; if (c) { closeOverlay(); submit(c); } };
    p.addEventListener('click', go); p.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  });
}

function specimenCard(id) {
  const m = MAKERS[id];
  const lines = m.laid ? Array.from({ length: 22 }, (_, i) => `<line x1="0" y1="${8 + i * 6}" x2="120" y2="${8 + i * 6}" stroke="#000" opacity=".1"/>`).join('') : '';
  const mark = { crown: '<path d="M44 80 l8 -22 l10 14 l10 -22 l10 22 l10 -14 l8 22z" fill="none" stroke="#6a5a3a" stroke-width="2"/><rect x="44" y="82" width="56" height="6" fill="none" stroke="#6a5a3a" stroke-width="2"/>',
    wreath: '<path d="M60 40 a26 26 0 1 0 0.1 0" fill="none" stroke="#6a7a8a" stroke-width="2"/><path d="M52 60 q8 -14 16 0 q-8 14 -16 0" fill="none" stroke="#6a7a8a" stroke-width="2"/>',
    wave: '<path d="M30 70 q10 -14 20 0 t20 0 t20 0 M30 86 q10 -14 20 0 t20 0 t20 0" fill="none" stroke="#7a8a9a" stroke-width="2"/>',
    shield: '<path d="M44 46 h32 v28 q0 18 -16 24 q-16 -6 -16 -24z" fill="none" stroke="#6a5a3a" stroke-width="2"/>',
    star: '<path d="M60 48 l6 16 l17 1 l-13 11 l5 17 l-15 -10 l-15 10 l5 -17 l-13 -11 l17 -1z" fill="none" stroke="#6a5a3a" stroke-width="2"/>' }[m.mark];
  return `<svg viewBox="0 0 120 150"><rect width="120" height="150" fill="${m.tint}" stroke="#7a6a4a" stroke-width="2"/>${lines}${mark}</svg>`;
}

function openSpecimens() {
  const html = `<button class="close" aria-label="Close">×</button><h2>The paper specimens</h2><p class="lead">Lay the thief’s note beside each maker’s sheet, and hold them to the lamp. Look at the tint, the lines and the watermark.</p>
  <div class="spec-grid"><div class="spec note"><svg viewBox="0 0 120 150"><rect width="120" height="150" fill="#efe3c4" stroke="#7a6a4a" stroke-width="2"/>${Array.from({ length: 22 }, (_, i) => `<line x1="0" y1="${8 + i * 6}" x2="120" y2="${8 + i * 6}" stroke="#000" opacity=".1"/>`).join('')}<path d="M44 80 l8 -22 l10 14 l10 -22 l10 22 l10 -14 l8 22z" fill="none" stroke="#6a5a3a" stroke-width="2" opacity=".8"/><text x="60" y="118" text-anchor="middle" font-family="Homemade Apple, cursive" font-size="8" fill="#1a1a4a">I regret the</text><text x="60" y="130" text-anchor="middle" font-family="Homemade Apple, cursive" font-size="8" fill="#1a1a4a">inconvenience.</text></svg>The note<small>laid lines, crown mark</small></div>
  ${MAKER_ORDER.map((id) => `<button class="spec ${S.flags['tried_' + id] ? 'tried' : ''}" data-maker="${id}">${specimenCard(id)}${MAKERS[id].name}<small>${MAKERS[id].line}</small></button>`).join('')}</div>
  <div class="row-btns"><button class="btn" id="sp-close">Put the books away</button></div>`;
  openOverlay(html);
  document.querySelectorAll('[data-maker]').forEach((b) => b.addEventListener('click', () => {
    closeOverlay();
    submit('Compare the note with ' + MAKERS[b.dataset.maker].name);
  }));
  $('#sp-close').addEventListener('click', closeOverlay);
}

function openAccuse(pre = null) {
  const known = SUSPECTS.filter((id) => S.known.people.includes(id));
  const ev = weighEvidence(S);
  const html = `<button class="close" aria-label="Close">×</button><h2>Name the culprit</h2>
  <p class="lead">You will have one chance. A wrong name frees the guilty man. Your strongest case so far stands at <b>${ev.grade === 'none' ? 'nothing' : ev.grade}</b>.</p>
  <div class="suspects">${known.map((id) => `<button class="sus" data-id="${id}" aria-pressed="${id === pre}">${portrait(id, { size: 150 })}</button>`).join('')}</div>
  <div class="row-btns"><button class="btn primary" id="ac-go" ${pre ? '' : 'disabled'}>This is the man</button><button class="btn" id="ac-back">Not yet</button></div>`;
  openOverlay(html);
  let pick = pre;
  document.querySelectorAll('.sus').forEach((b) => b.addEventListener('click', () => {
    pick = b.dataset.id;
    document.querySelectorAll('.sus').forEach((x) => x.setAttribute('aria-pressed', x === b));
    $('#ac-go').disabled = false;
  }));
  $('#ac-back').addEventListener('click', closeOverlay);
  $('#ac-go').addEventListener('click', () => { if (pick) confirmAccuse(pick); });
}

function confirmAccuse(id) {
  const right = id === 'pell';
  if (right && !S.fled) {
    const html = `<button class="close" aria-label="Close">×</button><h2>You have your man</h2><div class="epi"><p>Julian Pell stands at the window with his back to the room. He does not deny it. Sir Alistair has not spoken. Lestrade waits at the door with the handcuffs and a face that says he would rather not.</p><p>It is for you to say what happens next.</p></div>
    <div class="verdicts"><button data-v="prosecute"><b>Lestrade takes him down.</b>Report him to the police and press charges. The law decides what a man owes the law.</button><button data-v="mercy"><b>You let him go.</b>Hold your tongue, return the Star, and let a desperate man go to a dying sister. As you have done before.</button></div>`;
    openOverlay(html);
    document.querySelectorAll('[data-v]').forEach((b) => b.addEventListener('click', () => finish(id, b.dataset.v)));
  } else finish(id, null);
}

function finish(id, verdict) {
  const r = accuse(S, id, verdict);
  S.ended = { kind: r.kind, total: r.total, verdict, suspect: id };
  save(S);
  openEnd(r);
}

function idealRun() {
  const s = newGame();
  for (const c of IDEAL_COMMANDS) act(s, c);
  const r = accuse(s, 'pell', 'mercy');
  return { s, r, used: s.t - START };
}

function openEnd(r) {
  if (!r) {
    if (S.ended?.kind === 'escaped') r = escaped(S);
    else r = accuse(S, S.ended.suspect, S.ended.verdict);
  }
  const ideal = idealRun();
  const epi = epilogue(r, S);
  const missed = r.kind === 'solved' || r.kind === 'fled' || r.kind === 'escaped' ? reportLines(S, r) : [];
  const used = S.t - START;
  const title = r.kind === 'solved' ? (r.verdict === 'mercy' ? 'Case closed. Mercy.' : 'Case closed. Justice.') : r.kind === 'wrong' ? 'The wrong man' : r.kind === 'fled' ? 'The bird has flown' : 'The steamer sails';
  const html = `<button class="close" aria-label="Close">×</button><h2>${title}</h2>
  <div class="epi">${epi.map((l) => `<p>${esc(l)}</p>`).join('')}</div>
  <div class="rankbox"><div class="score">${r.total}<small> / 1000</small></div><div class="rank">${esc(r.rank[1])}</div><div style="color:var(--mute);font-style:italic">${esc(r.rank[2])}</div></div>
  <table class="parts">${r.parts.map((p) => `<tr><td>${p.label}</td><td>${p.pts} / ${p.max}<div class="bar"><i style="width:${Math.round((p.pts / p.max) * 100)}%"></i></div></td><td>${esc(p.note)}</td></tr>`).join('')}</table>
  <div class="report">
    <h3>The most ideal way</h3>
    <p style="color:var(--parch2)">Holmes would have had the case closed in <b>${formatSpan(ideal.used)}</b>, by ${clockText(ideal.s.t)}, scoring ${ideal.r.total}. You took ${formatSpan(used)}. The route:</p>
    <ol>${IDEAL_NARRATIVE.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ol>
    ${missed.length ? `<h3>What you did not find</h3><ul style="padding-left:20px">${missed.map((m) => `<li style="margin-bottom:6px;color:var(--parch2)">${esc(m)}</li>`).join('')}</ul>` : ''}
    <p style="color:var(--mute);font-style:italic;margin-top:14px">There are many other routes: by the shops on Monday, by Mycroft and the Irregulars, by Lestrade’s warrant, or by breaking Pell himself. This is merely the shortest.</p>
  </div>
  <div class="row-btns"><button class="btn primary" id="again">Play again</button><button class="btn" id="to-title">Title</button></div>`;
  openOverlay(html);
  $('#again').addEventListener('click', () => { closeOverlay(); startNew(); });
  $('#to-title').addEventListener('click', () => { closeOverlay(); showTitle(); });
}

function openMenu() {
  openOverlay(`<button class="close" aria-label="Close">×</button><h2>Menu</h2><p class="lead">The case saves itself after every move.</p>
  <div class="row-btns" style="flex-direction:column;align-items:stretch;max-width:320px"><button class="btn" id="m-how">How to play</button><button class="btn" id="m-acc">Name the culprit</button><button class="btn" id="m-title">Back to title</button><button class="btn" id="m-new">Start over</button></div>`);
  $('#m-how').addEventListener('click', openHow);
  $('#m-acc').addEventListener('click', () => openAccuse());
  $('#m-title').addEventListener('click', () => { closeOverlay(); showTitle(); });
  $('#m-new').addEventListener('click', () => { if (confirm('Abandon this case and begin again?')) { closeOverlay(); startNew(); } });
}

function openHow() {
  openOverlay(`<button class="close" aria-label="Close">×</button><h2>How to play</h2><div class="how"><p>You are Sherlock Holmes. There is no menu of choices: <em>type what you would do</em>, in your own words.</p><ul>
  <li><em>Go anywhere</em> you know: “go to Marlowe House”, “take a cab to Scotland Yard”, or click a pin on the map.</li>
  <li><em>Question anyone</em>, and choose your tone: “ask Mary kindly what she saw”, “press Pell about the library”, “ask Peabody if Pell buys Joynson paper”.</li>
  <li><em>Examine anything</em>: “search the study”, “examine the keyhole”, “look under the desk”. Or skip the study and rely on the witnesses.</li>
  <li><em>Use Watson</em>: ask him to read a particular newspaper. The Times is careful; the Police News is not.</li>
  <li><em>Use Mycroft</em> (three favours only, evenings at the Diogenes Club) for diplomatic and official facts, and <em>the Irregulars</em> for street work: “send Wiggins to follow Pell”.</li>
  <li>Compare the thief’s note against five makers’ paper at Baker Street: “compare the note with my specimens”.</li>
  <li>The casebook keeps what you learn. When you are ready, “accuse”. Naming the wrong person is costly.</li>
  <li>Time and money matter: cabs cost shillings, shops keep hours, and the guilty man is watching you. If he grows wary he will run.</li></ul></div>`);
}

// ------------------------------------------------------------------ wiring
$('#cmd').addEventListener('submit', (e) => { e.preventDefault(); submit($('#in').value); });
$('#tools').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.open === 'casebook') openCasebook();
  if (b.dataset.open === 'map') openMap();
  if (b.dataset.open === 'menu') openMenu();
});
$('#stage').addEventListener('click', (e) => {
  const h = e.target.closest('.hot'); if (h && h.dataset.cmd) submit(h.dataset.cmd);
});
$('#stage').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const h = e.target.closest?.('.hot'); if (h && h.dataset.cmd) submit(h.dataset.cmd);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#overlay').classList.contains('hidden')) closeOverlay();
});
$('#btn-new').addEventListener('click', startNew);
$('#btn-continue').addEventListener('click', resume);
$('#btn-how').addEventListener('click', () => { openHow(); $('#overlay').style.zIndex = 60; $('#app').classList.remove('hidden'); });

showTitle();
window.__game = { get state() { return S; }, submit };
