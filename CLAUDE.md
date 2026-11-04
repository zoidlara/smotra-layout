# Smotra layout editor

Static Vite + TypeScript site (Konva canvas) where University of Split faculties arrange images
and text on the walls of their stand (back 1–3, sides 4–8) and send a ZIP to the organiser. See README.md.

- Booth sizes, panel order, editable walls and print thresholds: `src/booth.ts`.
- Event details, faculty list, faculty colours and organiser email: `src/event.ts`.
  Faculty colours follow the organiser's science-field groups (CMYK given in `event.ts`).
- UI text is Croatian; code and comments are English.
- Check with `npx tsc --noEmit` and `npm run build`. Dev server: `npm run dev`.
- Hosted at github.com/zoidlara/smotra-layout; every push to `main` builds and publishes to
  GitHub Pages via `.github/workflows/deploy.yml` (https://zoidlara.github.io/smotra-layout/).
  An older copy exists at github.com/larazoid/smotra-layout and is not used.
