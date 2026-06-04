# Iron — Workout & Macro Tracker

RepCount-style lifting app with all premium features unlocked, plus a built-in macro tracker. Built for Vercel.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with a custom dark theme
- **Zustand** for state, persisted to `localStorage`
- **Recharts** for progress graphs
- **Lucide** icons, **Bricolage Grotesque** / **DM Sans** / **JetBrains Mono** typography

Zero backend by default — everything runs client-side and persists locally. This means it deploys to Vercel with no config and no database.

## Features

### Workout (RepCount free + premium)
- Active workout sessions with auto-incrementing sets
- Set types: normal, warmup, drop set, superset, failure
- Weight, reps, RPE per set
- Auto-starting rest timer (90s default, configurable)
- Custom exercises + 45-seed exercise library
- Workout templates (save mid-session, reuse later)
- Previous bests shown inline on each exercise
- Workout history with volume, sets, duration

### Progress (RepCount premium)
- Volume trend across all sessions
- Estimated 1RM curve per exercise (Epley formula)
- Weekly sets-per-muscle distribution
- Personal records leaderboard sorted by e1RM
- Lifetime totals

### Macros (the bonus)
- Daily kcal/protein/carbs/fat tracking against custom targets
- 28-food seed database (raw and per-serving items)
- Meal breakdown: breakfast / lunch / dinner / snack
- Custom foods with macros per 100g or per serving
- Live macro calculation as you type the amount
- Editable daily targets

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Deploy to Vercel

**Option 1 — CLI:**
```bash
npm i -g vercel
vercel
```

**Option 2 — GitHub:**
1. `git init && git add . && git commit -m "init"`
2. Push to a GitHub repo
3. On vercel.com → "Add New Project" → import the repo
4. Accept defaults (Next.js is auto-detected) → Deploy

No env vars, no database, no auth required for the local-first build.

## Upgrade path (multi-device sync)

When you outgrow localStorage:

1. **Vercel Postgres** for relational data (workouts, exercises, foods)
   - Replace `persist(...)` in `lib/store.ts` with API routes that read/write Postgres
2. **NextAuth.js** for auth (Google/Apple/email)
3. **Vercel KV** if you want fast key-value caching of computed stats

The store interface is already shaped around server-friendly CRUD operations — swap the persistence layer without changing component code.

## Project structure

```
app/
  page.tsx                     Dashboard
  workouts/
    active/page.tsx            Live workout session
    history/page.tsx           Past workouts
  progress/page.tsx            Charts, e1RM, PRs
  macros/page.tsx              Daily macro tracking
  exercises/page.tsx           Exercise + template library
components/
  nav.tsx                      Bottom navigation
  ui/primitives.tsx            Buttons, cards, inputs
lib/
  types.ts                     Domain types
  store.ts                     Zustand store + selectors
  utils.ts                     e1RM, volume, date helpers
  exercises.ts                 45-exercise seed
  foods.ts                     28-food seed
```

## What's intentionally cut from this MVP

- Camera-based AI rep counting (MyRepsCount's gimmick — needs MediaPipe + on-device pose detection)
- Apple Health / Google Fit sync (requires native or PWA-with-permissions)
- Multi-device cloud sync (requires backend — see upgrade path)
- Push notifications for rest timer (PWA + Notifications API; ~1 day work)
- Plate calculator (trivial addition; pure utility)
- Export to CSV (5 lines, add to Settings)

All scoped to land in a single weekend of follow-up work.
