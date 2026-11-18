// Engraved-style bust portraits, built from a handful of parameters per person.
import { PEOPLE } from '../case/world.js';
import { esc } from './common.js';

let uid = 0;
export function portrait(id, { size = 220, frame = true } = {}) {
  const p = PEOPLE[id];
  if (!p) return '';
  const L = p.look;
  const f = L.gender === 'f';
  const broad = L.build === 'broad', round = L.build === 'round', slim = L.build === 'slim';
  const sh = broad ? 128 : round ? 124 : slim ? 92 : 108;
  const k = 'p' + (uid++);
  const hair = L.hair, skin = L.skin;
  const hairBack = f ? `<path d="M60 100 q-6 -58 40 -60 q46 2 40 60 q4 44 -6 62 q-6 -30 -34 -30 q-28 0 -34 30 q-10 -18 -6 -62z" fill="${hair}"/>` : '';
  const topHair = f ? `<path d="M68 92 q4 -46 32 -46 q28 0 32 46 q-14 -20 -32 -20 q-18 0 -32 20z" fill="${hair}"/>` : `<path d="M66 92 q-2 -50 34 -50 q36 0 34 50 q-10 -22 -34 -22 q-24 0 -34 22z" fill="${hair}"/>`;
  let facial = '';
  if (L.facial === 'mustache') facial = `<path d="M84 118 q16 -10 32 0 q-8 10 -16 6 q-8 4 -16 -6z" fill="${hair}"/>`;
  if (L.facial === 'beard') facial = `<path d="M70 108 q0 46 30 52 q30 -6 30 -52 q-10 24 -30 24 q-20 0 -30 -24z" fill="${hair}"/><path d="M82 118 q18 -8 36 0 q-8 8 -18 6 q-10 2 -18 -6z" fill="${hair}"/>`;
  if (L.facial === 'sideburns') facial = `<path d="M66 96 q-6 30 6 40 l6 -34z M134 96 q6 30 -6 40 l-6 -34z" fill="${hair}"/>`;
  let hat = '';
  if (L.hat === 'top') hat = `<g><rect x="70" y="14" width="60" height="62" rx="4" fill="#15151a" stroke="#000" stroke-width="2"/><ellipse cx="100" cy="76" rx="52" ry="9" fill="#15151a" stroke="#000" stroke-width="2"/><rect x="70" y="58" width="60" height="9" fill="#3a3a44"/></g>`;
  if (L.hat === 'bowler') hat = `<g><path d="M70 74 q0 -42 30 -42 q30 0 30 42z" fill="#1d1d22" stroke="#000" stroke-width="2"/><ellipse cx="100" cy="76" rx="46" ry="9" fill="#1d1d22" stroke="#000" stroke-width="2"/></g>`;
  if (L.hat === 'cap') hat = f
    ? `<g><path d="M64 78 q4 -34 36 -34 q32 0 36 34 q-18 -6 -36 -6 q-18 0 -36 6z" fill="#f4f0e4" stroke="#8a8272" stroke-width="2"/><path d="M64 78 q36 -12 72 0" stroke="#8a8272" stroke-width="2" fill="none"/></g>`
    : `<g><path d="M66 78 q4 -30 34 -30 q30 0 34 30z" fill="#3a3a40" stroke="#000" stroke-width="2"/><path d="M66 78 q-14 6 -22 2 q10 -8 22 -6z" fill="#2a2a30"/></g>`;
  const glasses = L.glasses ? `<g fill="none" stroke="#2a2a30" stroke-width="2.4"><circle cx="86" cy="96" r="10"/><circle cx="114" cy="96" r="10"/><path d="M96 96 h8"/></g>` : '';
  const content = `
  <defs><clipPath id="${k}c"><rect width="200" height="220"/></clipPath>
  <radialGradient id="${k}bg" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#6a5a3e"/><stop offset="1" stop-color="#1a130c"/></radialGradient></defs>
  <g clip-path="url(#${k}c)">
  <rect width="200" height="220" fill="url(#${k}bg)"/>
  <path d="M0 220 V150 q100 -36 200 0 V220z" fill="${L.coat}"/>
  <path d="M${100 - sh} 220 q${sh * 0.2} -60 ${sh} -64 q${sh * 0.8} 4 ${sh} 64z" fill="${L.coat}" stroke="#000" stroke-width="2"/>
  <path d="M${100 - 26} 158 l26 40 l26 -40 l-10 -8 h-32z" fill="${L.collar}" stroke="#000" stroke-width="1.6"/>
  ${f ? `<path d="M${100 - 34} 160 q34 28 68 0 q-8 36 -34 40 q-26 -4 -34 -40z" fill="${L.collar}" opacity=".95"/>` : `<path d="M100 164 l-8 34 l8 -8 l8 8z" fill="#7a1f25"/>`}
  ${hairBack}
  <rect x="88" y="138" width="24" height="26" fill="${skin}" stroke="#000" stroke-width="1.4"/>
  <ellipse cx="100" cy="102" rx="34" ry="42" fill="${skin}" stroke="#000" stroke-width="2"/>
  <ellipse cx="66" cy="106" rx="6" ry="10" fill="${skin}" stroke="#000" stroke-width="1.5"/><ellipse cx="134" cy="106" rx="6" ry="10" fill="${skin}" stroke="#000" stroke-width="1.5"/>
  ${topHair}${hat}
  <path d="M82 88 q6 -5 12 0 M106 88 q6 -5 12 0" stroke="#2a1a10" stroke-width="3" fill="none"/>
  <ellipse cx="88" cy="97" rx="3.4" ry="2.6" fill="#1a1208"/><ellipse cx="112" cy="97" rx="3.4" ry="2.6" fill="#1a1208"/>
  ${glasses}
  <path d="M100 98 q-4 14 2 17" stroke="#a07050" stroke-width="2" fill="none"/>
  ${facial}
  <path d="M90 128 q10 5 20 0" stroke="${f ? '#8a3a3a' : '#6a3a2a'}" stroke-width="2.2" fill="none"/>
  <path d="M70 124 q-4 14 4 24 M130 124 q4 14 -4 24" stroke="#000" stroke-width="1" opacity=".25" fill="none"/>
  </g>`;
  if (!frame) return `<svg viewBox="0 0 200 220" width="${size}" height="${size * 1.1}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(p.name)}">${content}</svg>`;
  return `<svg viewBox="0 0 230 270" width="${size}" height="${size * 1.17}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(p.name)}">
  <rect x="2" y="2" width="226" height="266" rx="10" fill="#2a180c" stroke="#c9a24a" stroke-width="3"/>
  <rect x="10" y="10" width="210" height="250" rx="6" fill="none" stroke="#8a6a2a" stroke-width="1.5"/>
  <g transform="translate(15,15)">${content}</g>
  <rect x="26" y="238" width="178" height="22" fill="#12100e" stroke="#c9a24a" stroke-width="1.4"/>
  <text x="115" y="254" text-anchor="middle" font-family="IM Fell English, Georgia, serif" font-size="13" fill="#e9d9a8">${esc(p.short)}</text>
  </svg>`;
}
