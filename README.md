# Raspored štanda (Smotra Sveučilišta u Splitu)

A small web app where each faculty of the University of Split lays out the walls of its
stand (back wall 2–4, and optionally the inner side walls 7, 8, 1 and 5, 6) and sends the result to the organiser as one ZIP file.

- The faculty is chosen from a dropdown. That sets the colour of every panel (1–8) and the
  name on the header boards (11 + 12); exhibitors can't change either.
- All three walls are edited in 2D, unfolded side by side. Panels left empty are printed in
  the faculty colour only.
- Everything is measured in millimetres, so the app can warn when an image is too low-resolution
  for its printed size.
- "Ostali materijali" takes any files the faculty wants on the stand without saying where.
- "Pošalji organizatoru" downloads the ZIP and opens a pre-filled email (mail app, Gmail or
  Outlook). The site has no server, so the user attaches the ZIP themselves; browsers that can
  share files also offer to attach it directly.
- Work is autosaved in the visitor's browser (IndexedDB). Nothing is uploaded anywhere.

## What the organiser receives

`smotra-<ustanova>.zip` contains:

| Path | What |
| --- | --- |
| `sazetak.txt` | Human-readable list of every element per panel, with positions in mm |
| `raspored.json` | The same data for tools, plus the editor state |
| `datoteke/` | Original files of images placed on the wall, untouched |
| `materijali/` | "Ostali materijali": files with no set place |
| `pregled/` | Preview PNGs of the whole stand and each panel (not for print) |

Open a ZIP with **Učitaj ZIP** to see the layout in the editor.

**Primjer** (toolbar, and a link on the welcome screen) opens `public/primjeri/soss-2025.zip`:
the stand of Sveučilišni odjel za stručne studije from Smotra 2025, converted from their
print PDF (panels 7, 8, 1–5; panel 6 left in the faculty colour). It goes through the same
import as **Učitaj ZIP**, so it asks before replacing existing work.

## Stand dimensions

Stand 3 × 2 m, numbered as on the organiser's sketch. The editor uses the visible panel sizes;
the print files (forex fills) are a little larger because their edges go into the profile.

| Panel | Where | Visible (mm) | Print fill (mm) |
| --- | --- | --- | --- |
| 1–6 | 1 left wall back, 2–4 back wall, 5–6 right wall | 950 × 2350 | 962 × 2355 |
| 7–8 | left wall by the counter | 455 × 2350 | 467 × 2355 |
| 9 / 10 | counter front / side (organiser) | 950 × 855 | 962 × 855 / 467 × 855 |
| 11 / 12 | header boards (organiser) | 1940 / 950 × 330 | 1952 / 962 × 335 |

The counter stands in front of panel 7 and hides its lower 855 mm; the editor warns about
content placed there. `sazetak.txt` and `raspored.json` list both sizes for every panel.

## Changing the stand

Sizes, panel order, which walls are editable and print thresholds live in `src/booth.ts`.
Event details and the faculty list live in `src/event.ts`.

## Running and deploying

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

`dist/` is a plain static site (relative paths), so it can be uploaded to Netlify,
GitHub Pages or any web host.
