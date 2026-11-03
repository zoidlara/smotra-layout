/** Event details and the list of exhibiting faculties (from the organiser's schedule). */

export const EVENT = {
  name: 'Smotra Sveučilišta u Splitu',
  /** Accusative form, for sentences like "materijale za Smotru…". */
  nameAcc: 'Smotru Sveučilišta u Splitu',
  tagline: 'Upoznavanje s uvjetima upisa, upisima i studiranjem na našim studijima',
  dates: '8. – 11. prosinca 2026.',
  place: 'Kampus – zgrada tri fakulteta, Ruđera Boškovića 33',
  year: 2026,
  /** Address universities send their ZIP to. */
  organizerEmail: 'larabozichtt@gmail.com',
  /** Most mail servers reject attachments around 20–25 MB; above this we suggest WeTransfer. */
  maxEmailMb: 20,
};

export interface Faculty {
  id: string;
  name: string;
  /** Panel colour for every panel of this faculty's stand. */
  color: string;
}

/**
 * Colours are placeholders (taken from the printed schedule).
 * Replace each faculty's `color` with its official colour.
 */
export const FACULTIES: Faculty[] = [
  { id: 'ekonomski', name: 'Ekonomski fakultet', color: '#a9d08e' },
  { id: 'kemijsko-tehnoloski', name: 'Kemijsko-tehnološki fakultet', color: '#a9d08e' },
  { id: 'katolicki-bogoslovni', name: 'Katolički bogoslovni fakultet', color: '#a9d08e' },
  { id: 'fgag', name: 'Fakultet građevinarstva, arhitekture i geodezije', color: '#a9d08e' },
  { id: 'kinezioloski', name: 'Kineziološki fakultet', color: '#8ea9db' },
  { id: 'fesb', name: 'Fakultet elektrotehnike, strojarstva i brodogradnje', color: '#8ea9db' },
  { id: 'pmf', name: 'Prirodoslovno-matematički fakultet', color: '#8ea9db' },
  { id: 'pravni', name: 'Pravni fakultet', color: '#8ea9db' },
  { id: 'umjetnicka-akademija', name: 'Umjetnička akademija', color: '#8ea9db' },
  { id: 'studiji-mora', name: 'Sveučilišni odjel za studije mora', color: '#8ea9db' },
  { id: 'zdravstvene-znanosti', name: 'Fakultet zdravstvenih znanosti', color: '#f4b084' },
  { id: 'filozofski', name: 'Filozofski fakultet', color: '#f4b084' },
  { id: 'forenzicke-znanosti', name: 'Fakultet za forenzičke znanosti', color: '#f4b084' },
  { id: 'pomorski', name: 'Pomorski fakultet', color: '#f4b084' },
  { id: 'agromediteranski', name: 'Agromediteranski fakultet', color: '#f2b8c6' },
  { id: 'medicinski', name: 'Medicinski fakultet', color: '#f2b8c6' },
  { id: 'hotelijerstvo-gastronomija', name: 'Sveučilišni studij Hotelijerstvo i gastronomija', color: '#f2b8c6' },
  { id: 'strucni-studiji', name: 'Sveučilišni odjel za stručne studije', color: '#f2b8c6' },
  { id: 'komunikacija-mediji', name: 'Sveučilišni studij Komunikacija i mediji', color: '#f2b8c6' },
];

export function facultyById(id: string | null | undefined): Faculty | undefined {
  return FACULTIES.find((f) => f.id === id);
}

/** Relative luminance (0 = black, 1 = white). */
export function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

/** Readable text colour on a given background. */
export function textOn(bg: string): string {
  return luminance(bg) > 0.35 ? '#0f172a' : '#ffffff';
}

/**
 * Draws the header boards 11 + 12 (one name across both, like the organiser's sketch).
 * `split` is where board 11 ends, as a fraction of the width.
 */
export function drawFascia(c: HTMLCanvasElement, f: Faculty | undefined, split: number) {
  const ctx = c.getContext('2d')!;
  const { width: w, height: h } = c;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = f?.color ?? '#e5e9ef';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.fillRect(Math.round(w * split) - 1, 0, 2, h);

  const text = (f?.name ?? 'Naziv sastavnice').toUpperCase();
  ctx.fillStyle = f ? textOn(f.color) : '#94a3b8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const font = (px: number) => `700 ${px}px Montserrat, Inter, sans-serif`;
  const fit = (s: string, max: number) => {
    ctx.font = font(100);
    return Math.min(max, (100 * w * 0.92) / ctx.measureText(s).width);
  };

  const one = fit(text, h * 0.42);
  if (one >= h * 0.3 || !text.includes(' ')) {
    ctx.font = font(one);
    ctx.fillText(text, w / 2, h / 2 + one * 0.04);
    return;
  }
  // Long names: two lines, split at the space closest to the middle.
  const words = text.split(' ');
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
    if (diff < bestDiff) [best, bestDiff] = [i, diff];
  }
  const lines = [words.slice(0, best).join(' '), words.slice(best).join(' ')];
  const size = Math.min(...lines.map((l) => fit(l, h * 0.34)));
  ctx.font = font(size);
  ctx.fillText(lines[0], w / 2, h / 2 - size * 0.55);
  ctx.fillText(lines[1], w / 2, h / 2 + size * 0.6);
}
