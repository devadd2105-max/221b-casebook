// A hand-inked map of London, 1890, with pins for the places Holmes knows.
import { PLACES, parentPlace } from '../case/world.js';
import { esc } from './common.js';

export function mapSVG(state) {
  const known = new Set(state.known.places.map(parentPlace));
  const here = parentPlace(state.place);
  const pins = Object.entries(PLACES).filter(([id]) => !PLACES[id].parent && known.has(id)).map(([id, p]) => {
    const [x, y] = p.pos;
    const cur = id === here;
    return `<g class="pin ${cur ? 'cur' : ''}" data-cmd="${cur ? '' : 'Go to ' + esc(p.short)}" tabindex="0" role="button" aria-label="${esc(p.name)}" transform="translate(${x},${y})">
      <circle r="${cur ? 17 : 12}" class="pin-halo"/>
      <path d="M0 0 c-14 -16 -14 -38 0 -38 c14 0 14 22 0 38z" transform="translate(0,6)" fill="${cur ? '#7d1f25' : '#a8802e'}" stroke="#2a1608" stroke-width="2"/>
      <circle cy="-26" r="5" fill="#f3e2b4"/>
      <text y="26" text-anchor="middle" class="pin-t">${esc(p.short)}</text></g>`;
  }).join('');
  const streets = [
    'M40 260 Q300 240 520 285 T980 330', 'M420 40 Q440 200 520 285 T560 440', 'M60 400 Q300 360 470 345 T900 250', 'M300 60 Q360 220 400 290', 'M600 40 Q620 150 590 205 T660 238',
    'M700 60 Q720 180 715 275', 'M780 120 Q790 200 775 205', 'M100 150 Q220 170 300 220', 'M860 220 Q840 280 830 320', 'M520 285 Q540 360 540 430', 'M200 520 Q400 480 600 520',
  ].map((d) => `<path d="${d}" fill="none" stroke="#6a5a3a" stroke-width="2.2" opacity=".6"/>`).join('');
  return `<svg viewBox="0 0 1000 640" class="map" xmlns="http://www.w3.org/2000/svg" aria-label="Map of London, 1890">
  <defs><pattern id="mapPaper" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#e6d9b4"/><circle cx="2" cy="3" r=".7" fill="#b79f6a" opacity=".35"/></pattern>
  <filter id="mapAge"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="3" seed="2"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .28  0 0 0 0 .1  0 0 0 .5 0"/></filter></defs>
  <rect width="1000" height="640" fill="url(#mapPaper)"/><rect width="1000" height="640" filter="url(#mapAge)" opacity=".5"/>
  <path d="M0 470 Q180 410 330 455 T560 500 T780 430 T1000 470 V540 Q850 500 780 520 T560 570 T330 520 T0 560z" fill="#9db7c4" stroke="#4a6a7a" stroke-width="3"/>
  <path d="M0 500 Q180 440 330 485 T560 535 T780 465 T1000 505" fill="none" stroke="#c9dde6" stroke-width="2" stroke-dasharray="3 8"/>
  <path d="M70 250 Q170 200 270 235 Q300 330 210 380 Q110 350 70 250z" fill="#b8c99a" stroke="#6a7a4a" stroke-width="2"/><text x="170" y="300" text-anchor="middle" class="park-t">Hyde Park</text>
  <path d="M390 40 Q470 30 520 75 Q500 150 420 140 Q380 100 390 40z" fill="#b8c99a" stroke="#6a7a4a" stroke-width="2"/><text x="450" y="95" text-anchor="middle" class="park-t">Regent’s Park</text>
  <path d="M440 365 Q500 355 520 390 Q490 420 450 410z" fill="#b8c99a" stroke="#6a7a4a" stroke-width="2"/><text x="482" y="392" text-anchor="middle" class="park-t" style="font-size:12px">St James’s</text>
  ${streets}
  <text x="640" y="560" class="river-t" transform="rotate(-6 640 560)">The River Thames</text>
  <g transform="translate(880,90)"><circle r="46" fill="none" stroke="#6a5a3a" stroke-width="2"/><path d="M0 -40 L8 0 L0 40 L-8 0z" fill="#7d1f25"/><path d="M-40 0 L0 -6 L40 0 L0 6z" fill="#3a2a18" opacity=".8"/><text y="-52" text-anchor="middle" class="park-t">N</text></g>
  <text x="500" y="620" text-anchor="middle" class="map-title">LONDON · MDCCCXC</text>
  ${pins}</svg>`;
}
