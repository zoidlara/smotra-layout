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
