// Turns whatever Holmes types into a structured reading: intents, entities, topics, tone.
import { tokens, findPhrase, hasAny, countAny, norm, stem } from './text.js';
import { PEOPLE, PLACES, OBJECTS, PAPERS, MAKERS, TOPICS, TONE_GENTLE, TONE_HARSH, TONE_CONFRONT, TONE_PAY } from './case/world.js';

const INTENT_WORDS = {
  ASK: ['ask', 'question', 'interview', 'interrogate', 'speak', 'talk', 'tell me', 'inquire', 'enquire', 'quiz', 'press', 'converse', 'consult', 'inform', 'query', 'say to', 'say', 'chat', 'address', 'put to', 'demand', 'press him', 'press her', 'what did', 'did you', 'were you', 'where were', 'do you', 'have you', 'can you tell', 'could you tell', 'tell us', 'explain', 'confide', 'hear', 'listen', 'greet', 'hello', 'good morning', 'good afternoon', 'good evening', 'introduce'],
  GO: ['go', 'visit', 'travel', 'head', 'proceed', 'drive', 'cab', 'hansom', 'walk', 'journey', 'call on', 'call at', 'return', 'hurry', 'ride', 'repair to', 'make for', 'betake', 'take me', 'take us', 'off to', 'to the', 'step round', 'pop round', 'run to', 'depart', 'leave for', 'set out', 'arrive', 'enter', 'knock', 'ring the bell', 'omnibus', 'train', 'underground'],
  EXAMINE: ['examine', 'inspect', 'look', 'search', 'study', 'check', 'scrutinise', 'scrutinize', 'observe', 'investigate', 'lens', 'magnify', 'measure', 'smell', 'test', 'analyse', 'analyze', 'dust', 'probe', 'survey', 'see', 'view', 'open', 'handle', 'sniff', 'feel', 'peer', 'glance', 'read the note', 'compare', 'match', 'cross reference', 'cross check', 'verify', 'peruse', 'consult the', 'turn out', 'rummage', 'ransack', 'pick up', 'inspect the', 'crawl', 'kneel', 'take a look', 'have a look', 'go through'],
  READ_PAPERS: ['read', 'newspaper', 'newspapers', 'paper', 'papers', 'press', 'headline', 'headlines', 'column', 'gazette', 'times', 'telegraph', 'morning post', 'city press', 'police news', 'article', 'articles', 'report in', 'reports in', 'the news', 'what do the papers', 'what does the paper', 'society page', 'scandal sheet', 'broadsheet', 'journal'],
  SEND: ['send', 'dispatch', 'deploy', 'set the boys', 'set the irregulars', 'put the boys', 'have the boys', 'have the irregulars', 'get the boys', 'get the irregulars', 'tell wiggins', 'ask wiggins', 'task', 'assign', 'engage', 'commission', 'employ', 'enlist', 'retain', 'hire', 'use the irregulars', 'summon', 'call upon', 'call the boys'],
  TAIL: ['follow', 'tail', 'shadow', 'watch', 'stake', 'keep an eye', 'keep watch', 'trail', 'track', 'spy', 'surveil', 'observe him', 'tabs on', 'dog his steps'],
  WIRE: ['telegraph', 'wire', 'telegram', 'cable', 'write to', 'send word', 'send a note', 'send a message', 'note to', 'letter to', 'dispatch a note', 'message to', 'post to', 'drop a line', 'wire to', 'ring up', 'telephone'],
  ACCUSE: ['accuse', 'arrest', 'i accuse', 'name the culprit', 'the culprit is', 'the thief is', 'he did it', 'she did it', 'i know who', 'i have solved', 'case is solved', 'case solved', 'denounce', 'unmask', 'point the finger', 'name the thief', 'present my solution', 'my solution', 'final answer', 'close the case', 'make an accusation', 'name my suspect'],
  THINK: ['think', 'deduce', 'reflect', 'consider', 'ponder', 'reason', 'summarise', 'summarize', 'recap', 'what do we know', 'what do i know', 'review', 'notes', 'casebook', 'musing', 'meditate', 'smoke', 'pipe', 'contemplate', 'weigh', 'sum up', 'where do we stand', 'where are we', 'so far', 'sort out', 'reconsider', 'theory', 'theories', 'inference', 'put together'],
  WAIT: ['wait', 'sleep', 'rest', 'idle', 'pass the time', 'retire', 'until', 'nap', 'doze', 'lie down', 'bed', 'breakfast', 'luncheon', 'lunch', 'supper', 'dine', 'dinner', 'tea', 'eat', 'sit', 'while away', 'hour', 'hours', 'minute', 'minutes', 'morning', 'tomorrow', 'wait for', 'bide', 'linger', 'loiter'],
  PLAY: ['violin', 'play', 'tobacco', 'persian slipper', 'cocaine', 'experiment', 'bullet', 'revolver', 'practise', 'practice', 'jack knife', 'letters on the mantel', 'dagger', 'bored', 'boredom', 'sing', 'whistle', 'tune', 'stradivarius', 'music', 'dance'],
  HELP: ['help', 'hint', 'what can i do', 'commands', 'how do i', 'how do you', 'how to play', 'instructions', 'options', 'tutorial', 'what now', 'i am stuck', 'im stuck', 'stuck', 'lost', 'what should i', 'advice', 'guidance', 'clue me', 'give me a clue'],
  PAY: ['pay', 'bribe', 'shilling', 'sovereign', 'guinea', 'half crown', 'crown', 'coin', 'reward', 'purse', 'palm'],
};

const PERSON_PHRASES = [], PLACE_PHRASES = [], OBJECT_PHRASES = [], PAPER_PHRASES = [], MAKER_PHRASES = [];
const registry = [];

function reg(list, id, phrases, type) {
  for (const p of phrases) {
    const phraseToks = tokens(p);
    if (!phraseToks.length) continue;
    registry.push({ type, id, phrase: p, len: phraseToks.length, chars: p.length });
  }
}
for (const [id, p] of Object.entries(PEOPLE)) reg(PERSON_PHRASES, id, p.names, 'person');
for (const [id, p] of Object.entries(PLACES)) reg(PLACE_PHRASES, id, p.names, 'place');
for (const [id, o] of Object.entries(OBJECTS)) reg(OBJECT_PHRASES, id, o.names, 'object');
const objAlts = {};
for (const [id, o] of Object.entries(OBJECTS)) for (const n of o.names) for (const k of new Set([n, n.replace(/^the /, ''), 'the ' + n.replace(/^the /, '')].flatMap((x) => [x, x.split(' ').map((w) => stem(w)).join(' ')]))) { objAlts[k] ||= []; if (!objAlts[k].includes(id)) objAlts[k].push(id); }
for (const [id, p] of Object.entries(PAPERS)) reg(PAPER_PHRASES, id, p.names, 'paper');
for (const [id, m] of Object.entries(MAKERS)) reg(MAKER_PHRASES, id, [m.name, m.name + ' paper', m.line], 'maker');
// longest phrases first, so "sir alistair" beats "sir" and "diogenes club" beats "club"
registry.sort((a, b) => b.len - a.len || b.chars - a.chars);

// Some words mean a person only when asked about someone, never when they are the topic.
const WEAK_ENTITY = new Set(['police', 'the police', 'rooms', 'lodging', 'lodgings', 'the house', 'the study', 'study', 'library', 'the library', 'hall', 'door', 'the door', 'home', 'club', 'the club', 'the city', 'city', 'bin', 'books', 'book', 'table', 'papers', 'letters', 'box', 'bag', 'bed', 'gang', 'brother', 'my brother', 'the paper', 'paper', 'the post', 'post', 'crown', 'portal', 'times', 'doctor', 'doc', 'john', 'client', 'host', 'owner', 'the owner', 'the scene', 'stairs', 'staircase', 'passage', 'corridor', 'landing', 'garden', 'lock', 'the books', 'the letter', 'the message', 'the note', 'note']);

export function parse(text, ctx = {}) {
  const raw = String(text ?? '');
  const toks = tokens(raw);
  const used = new Array(toks.length).fill(false);
  const found = { person: [], place: [], object: [], paper: [], maker: [] };

  for (const e of registry) {
    let from = 0;
    // a phrase may appear more than once ("from Pell to Crake") so loop
    for (let guard = 0; guard < 4; guard++) {
      const sub = toks.slice(from);
      const subUsed = used.slice(from);
      const idx = findPhrase(sub, e.phrase, subUsed);
      if (idx < 0) break;
      const start = from + idx;
      for (let k = 0; k < e.len; k++) used[start + k] = true;
      found[e.type].push({ id: e.id, at: start, phrase: e.phrase, alts: e.type === 'object' ? objAlts[e.phrase] : [e.id], weak: WEAK_ENTITY.has(norm(e.phrase)) && e.len === 1 });
      from = start + e.len;
    }
  }
  for (const k of Object.keys(found)) found[k].sort((a, b) => a.at - b.at);

  // intents (whole-text; entity tokens do not suppress them)
  const intents = {};
  for (const [name, words] of Object.entries(INTENT_WORDS)) {
    const n = countAny(toks, words);
    if (n) intents[name] = n;
  }

  // topics
  const topics = {};
  for (const [name, words] of Object.entries(TOPICS)) {
    const n = countAny(toks, words);
    if (n) topics[name] = n;
  }

  const tone = {
    gentle: hasAny(toks, TONE_GENTLE),
    harsh: hasAny(toks, TONE_HARSH),
    confront: hasAny(toks, TONE_CONFRONT),
    pay: hasAny(toks, TONE_PAY),
  };
  const amount = (raw.match(/(\d+)\s*(s\b|shilling|shillings|sovereign|sovereigns|guinea|guineas|pound|pounds|crown|crowns|half crown|£)/i)
    || raw.match(/£\s*(\d+)/)) || null;
  let offer = 0;
  if (amount) {
    const n = parseInt(amount[1], 10);
    const u = (amount[2] || '').toLowerCase();
    offer = /sovereign|pound|£/.test(u) ? n * 20 : /guinea/.test(u) ? n * 21 : /half/.test(u) ? n * 2.5 : /crown/.test(u) ? n * 5 : n;
  } else if (/\bsovereign\b/i.test(raw)) offer = 20;
  else if (/\bguinea\b/i.test(raw)) offer = 21;
  else if (/half[- ]crown/i.test(raw)) offer = 2.5;
  else if (/\bcrown\b/i.test(raw) && !found.paper.length) offer = 5;
  else if (/\bshilling\b/i.test(raw)) offer = 1;
  if (!offer && tone.pay) offer = 5;

  const time = parseTime(raw, toks);
  const isQuestion = /\?/.test(raw) || /^(who|what|where|when|why|how|did|do|does|were|was|is|are|can|could|have|had)\b/i.test(raw.trim());

  return { raw, toks, used, found, intents, topics, tone, offer, time, isQuestion, empty: !toks.length };
}

export function parseTime(raw, toks) {
  const s = raw.toLowerCase();
  let m;
  const WD = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  if ((m = s.match(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/)) && /\b(until|till|til|for|to|next|on|wait|sleep|rest)\b/.test(s)) return { untilDay: WD.indexOf(m[1]), until: 9 * 60 };
  if ((m = s.match(/(\d+|a|one|two|three|four)\s+days?\b/))) { const n = { a: 1, one: 1, two: 2, three: 3, four: 4 }[m[1]] || parseInt(m[1], 10); return { duration: Math.min(n, 5) * 1440 }; }
  if ((m = s.match(/(?:until|till|til|by|at|till)\s+(\d{1,2})(?:[:.](\d{2}))?\s*(am|a\.m\.|pm|p\.m\.)?/))) {
    let h = parseInt(m[1], 10); const min = m[2] ? parseInt(m[2], 10) : 0;
    const ap = m[3] || '';
    if (/p/.test(ap) && h < 12) h += 12;
    if (/a/.test(ap) && h === 12) h = 0;
    if (!ap && h >= 1 && h <= 7) h += 12;
    if (h <= 24) return { until: h * 60 + min };
  }
  if ((m = s.match(/(\d+(?:\.\d+)?)\s*(hour|hours|hr|hrs|h)\b/))) return { duration: Math.round(parseFloat(m[1]) * 60) };
  if ((m = s.match(/(\d+)\s*(minute|minutes|min|mins)\b/))) return { duration: parseInt(m[1], 10) };
  if (/half an hour|half hour/.test(s)) return { duration: 30 };
  if (/quarter of an hour|quarter hour/.test(s)) return { duration: 15 };
  if (/an hour|one hour/.test(s)) return { duration: 60 };
  if (/couple of hours|two hours/.test(s)) return { duration: 120 };
  if (/\bnoon\b|midday/.test(s)) return { until: 12 * 60 };
  if (/this evening|\bevening\b|dusk|sundown/.test(s)) return { until: 18 * 60 };
  if (/\bafternoon\b/.test(s)) return { until: 14 * 60 };
  if (/\bmidnight\b/.test(s)) return { until: 24 * 60 };
  if (/tomorrow|next morning|\bmorning\b|dawn|sleep|retire|night/.test(s)) return { until: 9 * 60, nextDay: true };
  return null;
}

export const INTENT_ORDER = ['ACCUSE', 'GO', 'READ_PAPERS', 'WIRE', 'SEND', 'TAIL', 'EXAMINE', 'ASK', 'THINK', 'WAIT', 'PLAY', 'HELP'];
