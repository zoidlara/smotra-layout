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

/** Science-field groups from the organiser (CMYK for print, sRGB for the screen). */
export const GROUPS = {
  drustvene: { name: 'Društvene i humanističke znanosti', cmyk: 'C0 M85 Y100 K0', color: '#ff541e' },
  tehnicke: { name: 'Tehničke znanosti', cmyk: 'C95 M65 Y0 K0', color: '#0061af' },
  prirodne: { name: 'Prirodne i biotehničke znanosti', cmyk: 'C70 M33 Y7 K0', color: '#4c90c2' },
  biomedicina: { name: 'Biomedicina i zdravstvo', cmyk: 'C30 M4 Y0 K5', color: '#a4cde7' },
  interdisciplinarne: { name: 'Interdisciplinarne znanosti', cmyk: 'C25 M25 Y40 K0', color: '#c4b79a' },
  // The organiser writes "C0 M0 Y77 K0", but their swatch is the brand pink (R255 G105 B172).
  umjetnost: { name: 'Umjetničko područje', cmyk: 'C0 M77 Y0 K0', color: '#ff69ac' },
} as const;

export type GroupId = keyof typeof GROUPS;

export interface Faculty {
  id: string;
  name: string;
  group: GroupId;
  /** Panel colour for every panel of this faculty's stand (the group colour). */
  color: string;
}

const F = (id: string, name: string, group: GroupId): Faculty => ({ id, name, group, color: GROUPS[group].color });

/** Ids stay the same so saved layouts keep their faculty. */
export const FACULTIES: Faculty[] = [
  F('ekonomski', 'Ekonomski fakultet', 'drustvene'),
  F('filozofski', 'Filozofski fakultet', 'drustvene'),
  F('katolicki-bogoslovni', 'Katolički bogoslovni fakultet', 'drustvene'),
  F('kinezioloski', 'Kineziološki fakultet', 'drustvene'),
  F('pravni', 'Pravni fakultet', 'drustvene'),
  F('hotelijerstvo-gastronomija', 'Sveučilišni studij Hotelijerstvo i gastronomija', 'drustvene'),
  F('komunikacija-mediji', 'Sveučilišni studij Komunikacija i mediji', 'drustvene'),
  F('fesb', 'Fakultet elektrotehnike, strojarstva i brodogradnje', 'tehnicke'),
  F('fgag', 'Fakultet građevinarstva, arhitekture i geodezije', 'tehnicke'),
  F('pomorski', 'Pomorski fakultet', 'tehnicke'),
  F('agromediteranski', 'Agromediteranski fakultet', 'prirodne'),
  F('studiji-mora', 'Sveučilišni odjel za studije mora', 'prirodne'),
  F('pmf', 'Prirodoslovno-matematički fakultet', 'prirodne'),
  F('kemijsko-tehnoloski', 'Kemijsko-tehnološki fakultet', 'prirodne'),
  F('medicinski', 'Medicinski fakultet', 'biomedicina'),
  F('zdravstvene-znanosti', 'Fakultet zdravstvenih znanosti', 'biomedicina'),
  F('strucni-studiji', 'Sveučilišni odjel za stručne studije', 'interdisciplinarne'),
  F('forenzicke-znanosti', 'Fakultet za forenzičke znanosti', 'interdisciplinarne'),
  F('umjetnicka-akademija', 'Umjetnička akademija', 'umjetnost'),
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
