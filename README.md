# AAdat

Habit tracker. React + Vite + Tailwind frontend, Express 5 + MongoDB backend.

## Run locally

```bash
# backend
cd backend && cp .env.example .env     # then fill in MONGODB_URI and JWT_SECRET
npm install && npm run dev             # verification codes are printed in this console

# frontend (new terminal)
cd frontend && cp .env.example .env
npm install && npm run dev             # http://localhost:3000
```

## Backend layout

```
src/
  server.js            boot: connect DB, listen, graceful shutdown
  app.js               express app: security headers, CORS, rate limit, routes, errors
  config/              env.js (validated config), db.js
  routes/              URL -> middleware -> controller
  controllers/         thin: read request, call a service, send response
  services/            business rules (auth, otp, email, habits, entries)
  validators/          zod schemas for request input
  middleware/          requireLogin, validate, rateLimiters, errorHandler
  models/              mongoose schemas (User, Otp, Habit, Entry)
  templates/           email HTML/text
  utils/               AppError, date helpers, token/cookie helpers
```

## Email verification flow

1. `POST /api/auth/signup`  -> account created *unverified*, 6-digit code emailed (no login yet)
2. `POST /api/auth/verify-email {email, otp}` -> verifies, sets the login cookie
3. `POST /api/auth/resend-otp {email}` -> new code (60s cooldown)
4. `POST /api/auth/login` on an unverified account -> 403 `EMAIL_NOT_VERIFIED` + a fresh code

Codes: random, HMAC-hashed in the DB, expire in 10 min, 5 attempts max, single use.

## Before deploying

- [ ] Rotate `JWT_SECRET` and your DB password if the old `.env` was ever shared or committed
- [ ] Set `NODE_ENV=production`, `CLIENT_URL` (your frontend URL), real `SMTP_*` + `EMAIL_FROM`
- [ ] Run `npm run migrate:verify-existing` once (backend) so existing users aren't locked out
- [ ] Frontend: set `VITE_API_URL` to the API URL at build time
- [ ] Put frontend and API on the same site (e.g. `app.example.com` + `api.example.com`) so cookies work;
      only use `COOKIE_SAMESITE=none` if they must be on different sites
- [ ] Health check path for your host: `GET /health`

## Free hosting (Vercel + Render + MongoDB Atlas)

1. Atlas M0 cluster -> DB user + Network Access `0.0.0.0/0` -> copy URI (add `/aadat` as DB name)
2. Render Web Service: root `backend`, build `npm install`, start `npm start`, health `/health`,
   env vars from `backend/.env.example` with `NODE_ENV=production` and real SMTP + a NEW `JWT_SECRET`
3. Put your Render URL into `frontend/vercel.json`, then deploy `frontend` on Vercel
   (leave `VITE_API_URL` unset so /api is proxied same-origin and cookies work)
4. Set `CLIENT_URL` on Render to the Vercel URL and redeploy
5. Optional: UptimeRobot pinging `/health` every 5 min to avoid free-tier sleep
