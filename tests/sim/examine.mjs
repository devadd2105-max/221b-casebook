import { OPTIONS, OBJECTS, PEOPLE, PLACES, forced, act } from './lib.mjs';
const V = ['examine the {o}', 'look at the {o}', 'inspect {o}', 'check the {o}', 'study the {o} closely', 'what about the {o}'];
const fails = []; let tried = 0, ok = 0;
for (const o of OPTIONS.filter((x) => x.kind === 'examine')) {
  const names = OBJECTS[o.obj].names.filter((n) => n.length > 2);
  for (const nm of names) for (const v of V) {
    const s = forced(o);
    for (const x of OPTIONS) if (x.id !== o.id && x.kind === 'examine' && x.obj === o.obj) s.done[x.id] = 1;
    tried++; act(s, v.replace('{o}', nm));
    if (s.done[o.id]) ok++; else fails.push([o.id, v.replace('{o}', nm)]);
  }
}
console.log('examine', { tried, ok, fails: fails.length });
const by = {}; fails.forEach(([id, t]) => (by[id] ||= []).push(t)); for (const [id, ts] of Object.entries(by)) console.log(' ', id, ts.length, JSON.stringify(ts.slice(0, 3)));
// services
const S = ['send the irregulars to {v} {t}', 'have wiggins {v} {t}', 'set the boys to {v} {t}', 'put wiggins on {t}'];
const V2 = { tail: 'follow', lodging: 'watch' };
let st = 0, so = 0; const sf = [];
for (const o of OPTIONS.filter((x) => x.kind === 'service')) {
  for (const t of (o.targets || [''])) {
    const tn = t ? (PEOPLE[t]?.names[0] || PLACES[t]?.names[0] || t) : '';
    for (const tpl of S) for (const vb of ['follow', 'watch', 'tail', 'find out about']) {
      const s = forced(o); for (const x of OPTIONS) if (x.id !== o.id && x.kind === 'service') s.done[x.id] = 1;
      st++; act(s, tpl.replace('{v}', vb).replace('{t}', tn || 'the pawnbrokers'));
      if (OPTIONS.some((x) => x.kind === 'service' && s.done[x.id] && x.id !== undefined && (x.id === o.id || (x.targets || []).some((q) => (tn || '').includes(q))))) so++; else sf.push([o.id, tpl.replace('{v}', vb).replace('{t}', tn)]);
    }
  }
}
console.log('services', { tried: st, ok: so, fails: sf.length }, JSON.stringify(sf.slice(0, 6)));
console.log(OPTIONS.filter((x) => x.kind === 'service').map((o) => o.id + ':' + o.topics.join('/') + ':' + (o.targets || []).join('/')).join('\n'));
