# VoxAudit Intelligence — Clickable Prototype

Phase 1 design prototype (Sprint 1 of 4). All data is **fictional sample data**; this repo is separate from production.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # type-check + static build in dist/
```

Stack: React 18, TypeScript, Tailwind 3, React Router 6 (hash routing so it runs on any static host), lucide-react icons, `@google/model-viewer` for the 3D mascot (lazy-loaded).

## Sprint 1 scope (done)

| Area | Where |
|---|---|
| Design tokens (color roles, light/dark canvas, status, type, spacing) | `src/index.css`, `tailwind.config.js` |
| Component library + cross-cutting states | `src/components/ui.tsx` |
| Design system reference (live contrast ratios) | in-app: sidebar → **Design system** |
| App shell: role-aware sidebar (248 → 72 px), top bar, client switcher, mobile bottom nav + drawer | `src/components/AppShell.tsx`, `src/lib/nav.ts` |
| Auth: sign in, sign up, reset, SSO, invite, invite expired, error | `src/pages/Auth.tsx` (`#/signin`, `#/signup`, `#/reset`, `#/sso`, `#/invite/abc`, `#/invite/expired`) |
| Workspace dashboard: empty, partial (stage status, failed source), populated | `src/pages/Dashboard.tsx` |
| English / Arabic (RTL) toggle | `src/lib/i18n.ts` |
| Placeholders for screens in Sprints 2–4, showing each screen's integrity rule | `src/pages/Planned.tsx` |

Use **Prototype controls** in the top bar to switch role, dashboard state, language and canvas theme. On the sign-in screen, the password `wrong` shows the error state.

## Rules the code enforces

- **Navigation by role, not CSS.** `navFor(role)` builds the sidebar from the access matrix in `src/lib/nav.ts`; deep-linking to a screen the role cannot see shows *permission denied*.
- **Every score has a coverage meter**; low-evidence modules withhold the score.
- **Evidence labels** (Measured / Connected / Estimated / AI interpretation / Unavailable / Not applicable) on every KPI, finding and chart. Unavailable values show a reason and are never drawn as zero.
- **No fake percentages** in progress: stage status only.
- **Charts:** client in brand blue, competitors neutral, estimates hatched; no chart with fewer than two data points.
- **Mascot** only on sign-in and empty/onboarding states — never in reports or PDFs.
- **Sample data banner** on every screen.
- URL shape: `/w/{workspace}/c/{client}/…`. Switching client navigates, which clears context.

## Notes for review

- `#0094ea` (brand blue) is 3.3:1 on white, below WCAG AA for text. Fills and focus rings keep the brand value; text and button backgrounds use `--primary-strong` `#006fb0` (5.4:1). Same approach for magenta → `--ai` `#b02d95`.
- Score bands (0–49 Critical, 50–69 Needs work, 70–84 Solid, 85–100 Strong) are a **proposal** pending the scoring methodology.
- **Arabic copy is a draft** and needs native review (Phase 1 risk "Arabic quality").
- The supplied logo has white text, so it is used on dark surfaces only. A light-background version is still needed.
- The 3D mascot (`public/brand/ryan-vox.glb`) was reduced from 16.5 MB / 284k vertices to 2.4 MB / 50k vertices (gltf-transform: simplify + quantize). The original texture is kept.
- Not wired to any backend; sign-in is simulated and state lives in `localStorage`.
