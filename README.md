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


