# AAdat (आदत)

> Small days, stacked up.

AAdat is a minimal habit tracker with a retro pixel-art look. Create the habits you care about, mark each day as done, half done, or not done, and watch your year fill up as a colorful heatmap.

 [**Live demo**](https://vercel.app)

<!-- Add a screenshot or GIF here once you have one:
![AAdat screenshot](docs/screenshot.png)
-->

---

## Features

**Track habits your way**
- Create as many habits as you want (up to 40 characters each).
- Delete a habit at any time. A confirmation asks first, because its history goes with it.
- Switch between habits from the sidebar.

**Three-state daily check-in**
- Mark today as **Done**, **Half done**, or **Not done** with one tap.
- Half done keeps a partial day from feeling like a failure.

**Heatmap of your whole year**
- A GitHub-style year grid shows every day at a glance.
- A **Months** view splits the year into 12 small calendars.
- Tap any past day to cycle through its states, so you can fix a day you forgot to log.
- Future days are locked, and today is outlined so you can find it fast.
- Browse previous and next years with the arrows.

**Stats**
- Total done days and half days for the selected year.
- Current day streak (shown for the current year).

**Accounts**
- Sign up with name, email, and password, then log back in anytime.
- Friendly form validation (valid email, minimum password length) with clear error messages.
- Show / hide password toggle.

**Polished feel**
- Retro theme: chunky borders, hard shadows, and a warm color palette.
- A pixel-art animation strip at the bottom of the page rotates through little scenes.
- Optimistic updates: squares respond instantly while saving happens in the background.
- Error banners when something fails to load or save, instead of silent failures.
- Responsive layout for desktop and mobile.
- Accessibility basics: labeled buttons, `aria-` attributes, and reduced-motion support (animations are hidden for people who prefer less motion).

---

## Tech stack

| Part | Tools |
|------|-------|
| Front end | React 19, Vite, Tailwind CSS v4 |
| Back end | Node.js, Express _(in progress)_ |
| Database | _To be decided_ |

---

## Project status

- [x] Front end (login, tracker, heatmap, stats, animations)
- [x] Back end API (habits, entries, auth)
- [x] Connect front end to the API
- [x] Deploy

Right now the front end runs on a `localStorage` stub, so the app works in your browser without a server. The login accepts any email and password until the real backend is connected.

---

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) (current LTS version recommended)
- npm (comes with Node)

### Run the front end

```bash
cd aadat
npm install
npm run dev
```

Then open the local URL that Vite prints (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

---

## Project structure

```
aadat/
├── public/gifs/          # pixel-art animations
├── src/
│   ├── api.js            # the only file that talks to a server
│   ├── utils.js          # date helpers and status constants
│   ├── App.jsx           # checks the session, shows Login or Tracker
│   ├── pages/
│   │   ├── Login.jsx     # sign in / sign up
│   │   └── Tracker.jsx   # habits, stats, heatmap
│   ├── components/
│   │   ├── Heatmap.jsx   # year and months views
│   │   └── Stage.jsx     # animated footer scenes
│   └── index.css         # Tailwind and theme tokens
├── .env.example
└── vite.config.js
```

---

## Connecting a backend

All server communication lives in `src/api.js`. Each function has the suggested API route written above it, so swapping the `localStorage` stub for real `fetch()` calls does not require touching any other file.

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to your backend address (for example `http://localhost:4000`).
3. Or use the dev proxy in `vite.config.js` by uncommenting it.

Status values used throughout the app:

| Value | Meaning |
|-------|---------|
| `0` | Not done (no entry stored) |
| `1` | Half done |
| `2` | Done |

---

## Roadmap

- [ ] Real backend with user accounts and persistent storage
- [ ] Server-calculated streaks that continue across years
- [ ] Habit reminders
- [ ] Edit / rename habits
- [ ] Dark mode
- [ ] Export your data

---

## Contributing

This is a personal learning project, but suggestions and bug reports are welcome. Feel free to open an issue.

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, copy, modify, and share it, as long as the copyright notice and license text stay with it.

---

Made by NMD.
