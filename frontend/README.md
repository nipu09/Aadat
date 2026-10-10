# AAdat: habit tracker (React + Vite + Tailwind, frontend only)

    npm install
    npm run dev

## Structure
    src/
      api.js            ← the ONLY file that talks to a server (currently a localStorage stub)
      utils.js          ← date helpers + status constants (0 not done, 1 half, 2 done)
      App.jsx           ← session check → Login or Tracker
      pages/            Login.jsx, Tracker.jsx
      components/       Heatmap.jsx (year + months views), Stage.jsx (bottom GIF strip)
      index.css         ← Tailwind v4 + retro theme tokens
    public/gifs/        ← animations

## Connecting your backend
Replace the body of each function in `src/api.js` with a `fetch()` call (the suggested
route is written above every function). Copy `.env.example` to `.env` and set `VITE_API_URL`,
or uncomment the dev proxy in `vite.config.js`. Nothing else in the app needs to change.

Notes: the stub login accepts any email/password. Streak is computed on the client from
the current year's entries, so it resets across 1 Jan; have your API return it if that matters.
