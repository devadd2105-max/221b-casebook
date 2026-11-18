import { newGame, act, clone, hasFlag } from './lib.mjs';
import { weighEvidence } from '../../js/evidence.js';
import { accuse, SUSPECTS, IDEAL_COMMANDS, reportLines, rankFor } from '../../js/scoring.js';
const stages = { fresh: [], early: IDEAL_COMMANDS.slice(0, 6), mid: IDEAL_COMMANDS.slice(0, Math.floor(IDEAL_COMMANDS.length * 0.6)), full: IDEAL_COMMANDS };
let n = 0, bad = 0; const rows = [];
for (const [name, cmds] of Object.entries(stages)) {
  const s = newGame(); for (const c of cmds) act(s, c);
  for (const who of SUSPECTS) for (const v of ['prosecute', 'mercy', undefined]) {
    n++;
    try {
      const r = accuse(clone(s), who, v);
      const txt = JSON.stringify(r);
      if (!Number.isFinite(r.total) || r.total < 0 || r.total > 1000 || /undefined|NaN/.test(txt.replace('"verdict":undefined', ''))) { bad++; console.log('BAD', name, who, v, txt.slice(0, 200)); }
      if (who === 'pell' && v) rows.push(`${name}/${v}: ${r.total} ${rankFor ? rankFor(r.total) : ''}`);
    } catch (e) { bad++; console.log('THROW', name, who, v, e.message); }
  }
}
const s = newGame(); for (const c of IDEAL_COMMANDS) act(s, c);
try { const L = reportLines(s, clone(s)); console.log('report lines', Array.isArray(L) ? L.length : typeof L); } catch (e) { console.log('report throw', e.message); }
console.log({ accusations: n, bad }); console.log(rows.join('\n'));
