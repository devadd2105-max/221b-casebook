// For every option: with its preconditions forced and its siblings silenced, does every natural phrasing reach it?
import { OPTIONS, PEOPLE, OBJECTS, TOPICS, forced, clone, act, personName, toneWords } from './lib.mjs';
const T_ASK = ['ask {n} about {p}', 'what does {n} know about {p}', 'question {n} about {p}', '{n}, tell me about {p}', 'press {n} on {p}', 'interview {n} regarding {p}', 'I want to hear from {n} about {p}'];
const fails = []; let tried = 0, ok = 0;
for (const o of OPTIONS) {
  if (o.kind !== 'ask' || !o.who || ['watson','hudson'].includes(o.who) && false) continue;
  const topics = (o.topics || []).filter((t) => t !== 'greet' && TOPICS[t]);
  const name = personName(o.who);
  const phrases = topics.flatMap((t) => TOPICS[t].slice(0, 4).map((p) => [t, p]));
  if (!phrases.length) continue;
  for (const [t, p] of phrases) {
    for (const tone of toneWords(o)) {
      for (const tpl of T_ASK.slice(0, 3)) {
        const remote = o.remote || PEOPLE[o.who].remote;
        let text = (remote ? 'wire {n} about {p}' : tpl).replace('{n}', name).replace('{p}', p);
        if (tone) text += tone.startsWith('and') || tone.startsWith('confront') ? ' ' + tone : ' ' + tone;
        if (o.need?.pay) text += ` and I will pay ${o.need.pay} shillings`;
        if (o.need?.mention) text += ' ' + o.need.mention.map((m) => PEOPLE[m]?.names[0] || m).join(' ');
        const s = forced(o);
        for (const x of OPTIONS) if (x.id !== o.id && x.who === o.who) s.done[x.id] = 1;
        tried++;
        let r; try { r = act(s, text); } catch (e) { fails.push({ id: o.id, text, why: 'CRASH ' + e.message }); continue; }
        if (s.done[o.id]) ok++; else fails.push({ id: o.id, text, why: 'did not fire' });
      }
    }
  }
}
console.log({ tried, ok, rate: (ok / tried * 100).toFixed(1) + '%', fails: fails.length });
const byTone = {}; fails.forEach((f) => { const w = f.text.split(' ').slice(-1)[0]; byTone[w] = (byTone[w] || 0) + 1; }); console.log(byTone);
const by = {}; fails.forEach((f) => (by[f.id] ||= []).push(f));
for (const [id, fs] of Object.entries(by)) console.log(id.padEnd(22), fs.length, 'fails e.g.', JSON.stringify(fs[0].text));
