/**
 * Booth geometry, colours and print thresholds.
 * All sizes are in millimetres. Change the numbers here if the stand changes.
 */

export type WallId = 'left' | 'back' | 'right';
export type WallKind = 'side' | 'back';

export interface WallSpec {
  id: WallId;
  kind: WallKind;
  title: string;
  subtitle: string;
  /** Exhibitors can place images and text here. Panels left empty just take the faculty colour. */
  editable: boolean;
  /** Panels as seen when standing in front of the wall, from left to right. */
  panels: { id: string; width: number }[];
}

/** Kinds of stand. Most exhibitors get the standard 3 × 2 m stand. */
export type StandId = 'standard' | 'bez-pulta' | 'jedna-ploca' | 'veliki-zid';

interface StandSpec {
  name: string;
  walls: WallSpec[];
  /** Header boards made by the organiser, left to right. Empty if the stand has none. */
  fascia: { id: string; width: number; height: number }[];
  counter: { front: string; side: string; width: number; height: number; depth: number } | null;
  /** The counter stands in front of this panel and hides its lower part (counter height). */
  hiddenByCounter: string | null;
}

/**
 * Standard stand 3 × 2 m, numbered as on the organiser's sketch (fills 1–6 are 950 mm, 7–8 are 455 mm):
 * left wall by the counter 7 + 8 + 1 (front → back), back wall 2 + 3 + 4, right wall 5 + 6
 * (back → front). All panels 2350 mm high.
 */
const STANDARD_WALLS: WallSpec[] = [
  {
    id: 'left',
    kind: 'side',
    title: 'BOČNI ZID',
    subtitle: 'lijevo, uz pult',
    editable: true,
    panels: [
      { id: '7', width: 455 },
      { id: '8', width: 455 },
      { id: '1', width: 950 },
    ],
  },
  {
    id: 'back',
    kind: 'back',
    title: 'STRAŽNJI ZID',
    subtitle: 'nasuprot posjetiteljima',
    editable: true,
    panels: [
      { id: '2', width: 950 },
      { id: '3', width: 950 },
      { id: '4', width: 950 },
    ],
  },
  {
    id: 'right',
    kind: 'side',
    title: 'BOČNI ZID',
    subtitle: 'desno',
    editable: true,
    panels: [
      { id: '5', width: 950 },
      { id: '6', width: 950 },
    ],
  },
];

const STANDARD_FASCIA = [
  { id: '11', width: 1940, height: 330 },
  { id: '12', width: 950, height: 330 },
];

const STANDS: Record<StandId, StandSpec> = {
  standard: {
    name: 'Štand 3 × 2 m',
    walls: STANDARD_WALLS,
    fascia: STANDARD_FASCIA,
    counter: { front: '9', side: '10', width: 950, height: 855, depth: 455 },
    hiddenByCounter: '7',
  },
  // Same three walls and header, but no counter in front (Radio Kampus).
  'bez-pulta': {
    name: 'Štand 3 × 2 m bez pulta',
    walls: STANDARD_WALLS.map((w) => (w.id === 'left' ? { ...w, subtitle: 'lijevo, uz ulaz' } : w)),
    fascia: STANDARD_FASCIA,
    counter: null,
    hiddenByCounter: null,
  },
  // A single free-standing panel 950 mm wide (Sveučilišna knjižnica).
  'jedna-ploca': {
    name: 'Jedna ploča 950 mm',
    walls: [{ id: 'back', kind: 'back', title: 'PLOČA', subtitle: 'samostojeća', editable: true, panels: [{ id: '1', width: 950 }] }],
    fascia: [],
    counter: null,
    hiddenByCounter: null,
  },
  // One long wall of eight 950 mm panels.
  'veliki-zid': {
    name: 'Veliki zid, 8 ploča po 950 mm',
    walls: [
      {
        id: 'back',
        kind: 'back',
        title: 'VELIKI ZID',
        subtitle: '8 ploča po 950 mm',
        editable: true,
        panels: ['1', '2', '3', '4', '5', '6', '7', '8'].map((id) => ({ id, width: 950 })),
      },
    ],
    fascia: [],
    counter: null,
    hiddenByCounter: null,
  },
};

const STAND_KEY = 'smotra-stand';

function isStandId(v: unknown): v is StandId {
  return typeof v === 'string' && v in STANDS;
}

function readStoredStand(): StandId {
  try {
    const v = localStorage.getItem(STAND_KEY);
    return isStandId(v) ? v : 'standard';
  } catch {
    return 'standard';
  }
}

/** Remembers which stand to lay out on the next page load. Returns false if storage is blocked. */
export function storeStand(id: StandId): boolean {
  try {
    localStorage.setItem(STAND_KEY, id);
    return localStorage.getItem(STAND_KEY) === id;
  } catch {
    return false;
  }
}

/** The stand this page is laid out for (chosen from the exhibitor on load). */
export const STAND_ID: StandId = readStoredStand();
const STAND = STANDS[STAND_ID];

export function standName(id: StandId): string {
  return STANDS[id].name;
}

export const BOOTH = {
  wallHeight: 2350,
  /** Aluminium profile between neighbouring panels. Drawn only, never printed. */
  postWidth: 20,
  walls: STAND.walls,
  /** Parts made by the organiser. Shown greyed out for context only. */
  organizer: {
    fascia: STAND.fascia,
    counter: STAND.counter,
  },
  hiddenByCounter: STAND.hiddenByCounter,
  /**
   * Print sizes of the forex fills from the organiser (vice-rector's email, 3 Nov 2026).
   * Slightly larger than the visible panel: the extra edge goes into the aluminium profile.
   */
  printFill: {
    wide: { width: 962, height: 2355 },
    narrow: { width: 467, height: 2355 },
  },
};

/** Print size (forex fill) for a wall panel of the given visible width. */
export function printFill(visibleWidth: number) {
  return visibleWidth > 600 ? BOOTH.printFill.wide : BOOTH.printFill.narrow;
}

export const PRINT = {
  /** Effective resolution at final print size. */
  dpiGood: 120,
  dpiMin: 75,
  /** Text smaller than this is hard to read from a few metres away. */
  minTextMm: 20,
};

export const COLORS: Record<WallKind | 'organizer', string> = {
  back: '#2563eb',
  side: '#ea580c',
  organizer: '#94a3b8',
};

/** Canvas-only layout constants (mm, in the unfolded wall view). */
export const CANVAS = {
  wallGap: 320,
  bandY: -480,
  bandH: 230,
};

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PanelLayout extends Rect {
  id: string;
  wall: WallId;
  kind: WallKind;
}

export interface WallLayout extends Rect {
  id: WallId;
  kind: WallKind;
  title: string;
  subtitle: string;
  panels: PanelLayout[];
}

export interface Layout {
  walls: WallLayout[];
  panels: PanelLayout[];
  bounds: Rect;
  panel(id: string): PanelLayout | undefined;
}

export function wallSpec(id: WallId): WallSpec | undefined {
  return BOOTH.walls.find((w) => w.id === id);
}

/** Total length of a wall including the profiles between its panels. */
export function wallLength(spec: WallSpec): number {
  return spec.panels.reduce((n, p) => n + p.width, 0) + BOOTH.postWidth * (spec.panels.length - 1);
}

/** Lays out the editable walls side by side ("unfolded"), each as seen from inside the stand. */
export function computeLayout(): Layout {
  const walls: WallLayout[] = [];
  const panels: PanelLayout[] = [];
  let x = 0;
  for (const spec of BOOTH.walls.filter((w) => w.editable)) {
    const start = x;
    const own: PanelLayout[] = [];
    spec.panels.forEach((p, i) => {
      if (i > 0) x += BOOTH.postWidth;
      const panel: PanelLayout = { id: p.id, wall: spec.id, kind: spec.kind, x, y: 0, w: p.width, h: BOOTH.wallHeight };
      own.push(panel);
      panels.push(panel);
      x += p.width;
    });
    walls.push({ id: spec.id, kind: spec.kind, title: spec.title, subtitle: spec.subtitle, x: start, y: 0, w: x - start, h: BOOTH.wallHeight, panels: own });
    x += CANVAS.wallGap;
  }
  // Keep the back wall at x = 0, so layouts saved before the side walls became editable still line up.
  const shift = walls.find((w) => w.id === 'back')?.x ?? 0;
  for (const r of [...walls, ...panels]) r.x -= shift;
  const right = x - CANVAS.wallGap - shift + 80;
  const left = (walls[0]?.x ?? 0) - 290;
  const top = CANVAS.bandY - 60;
  const bottom = BOOTH.wallHeight + 160;
  return {
    walls,
    panels,
    bounds: { x: left, y: top, w: right - left, h: bottom - top },
    panel: (id) => panels.find((p) => p.id === id),
  };
}

export function wallName(kind: WallKind, wall: WallId): string {
  if (kind === 'back') return 'Stražnji zid';
  return wall === 'left' ? 'Bočni zid – lijevo' : 'Bočni zid – desno';
}

export function panelAt(layout: Layout, x: number, y: number): PanelLayout | undefined {
  return layout.panels.find((p) => x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h);
}

export function nearestPanel(layout: Layout, x: number, y: number): PanelLayout {
  let best = layout.panels[0];
  let bestD = Infinity;
  for (const p of layout.panels) {
    const dx = Math.max(p.x - x, 0, x - (p.x + p.w));
    const dy = Math.max(p.y - y, 0, y - (p.y + p.h));
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
}

export function intersect(a: Rect, b: Rect): Rect | null {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const r = Math.min(a.x + a.w, b.x + b.w);
  const btm = Math.min(a.y + a.h, b.y + b.h);
  return r > x && btm > y ? { x, y, w: r - x, h: btm - y } : null;
}

/** Panels a box overlaps, largest overlap first. */
export function panelsTouched(layout: Layout, box: Rect): { panel: PanelLayout; area: number }[] {
  const out: { panel: PanelLayout; area: number }[] = [];
  for (const p of layout.panels) {
    const i = intersect(p, box);
    if (i && i.w * i.h > 1) out.push({ panel: p, area: i.w * i.h });
  }
  return out.sort((a, b) => b.area - a.area);
}

/** The panel an element "belongs" to: the one holding its centre, else the one it overlaps most. */
export function primaryPanel(layout: Layout, box: Rect): PanelLayout {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return panelAt(layout, cx, cy) ?? panelsTouched(layout, box)[0]?.panel ?? nearestPanel(layout, cx, cy);
}
