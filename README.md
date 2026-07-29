# Note App

A full-stack notes app: React 19 + Vite + Tailwind on the frontend, Express 5 + MongoDB (Mongoose) on the backend, with cookie-based JWT auth. Structured as two independent apps so each deploys to its **own Vercel project**.

```
noteapp/
├── backend/    → deploy as Vercel Project #1 (Node serverless functions)
└── frontend/   → deploy as Vercel Project #2 (static Vite build)
```

## What was fixed for production deployment

- **Crash on every request (the main bug):** `app.options('*', cors(...))` in `backend/src/app.js` crashed on load under Express 5 — `path-to-regexp` v8 (used internally by Express 5's router) no longer accepts a bare `'*'` wildcard and throws `Missing parameter name at index 1: *` as soon as the file is required. Since Vercel's serverless function requires this file on every cold start, **every single request was failing**. Removed the line entirely — the `cors` middleware already answers OPTIONS preflight requests on its own.
- **Local dev server never started:** `server.js` only called `app.listen(...)` when `NODE_ENV === 'production'`, so `npm run dev` locally did nothing. Fixed so it always connects to Mongo and starts listening (this file isn't used on Vercel at all — `api/index.js` is the serverless entry point there).
- **Fragile DB connection tracking:** `db.js` used a manual `isConnected` boolean, which can go stale when a serverless function is frozen/thawed between invocations. Switched to checking `mongoose.connection.readyState` directly, and the serverless handler now awaits the connection on every invocation (cheap no-op once connected).
- **Legacy `vercel.json`:** replaced the old `builds`/`routes` config with a modern `rewrites` rule, and added a matching `vercel.json` to the frontend for SPA-style routing.
- **CORS hardening:** origin is now configurable via a `CLIENT_URL` env var (comma-separated allow-list), falling back to reflecting the request origin if unset so it still works out of the box.
- **Misc:** removed a leftover, misspelled Netlify config (`netifly.toml`) from the frontend; fixed the Vite dev proxy pointing at the wrong port (3000 → 5000); added `.env.example` files to both apps; added `timestamps` to the Note model.

## 1. MongoDB Atlas

Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), add a database user, allow access from `0.0.0.0/0` (or Vercel's IPs), and copy the connection string.

## 2. Deploy the backend

1. Push this repo to GitHub.
2. In Vercel: **Add New Project** → import the repo → set **Root Directory** to `backend`.
3. Add environment variables (copy from `backend/.env.example`):
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — any long random string
   - `NODE_ENV` — `production`
   - `CLIENT_URL` — leave blank for now; you'll add it after step 3 once you know the frontend URL
4. Deploy. Visit `https://your-backend.vercel.app/` — you should see `{"message":"Note App Backend is running successfully!"}`.

## 3. Deploy the frontend

1. In Vercel: **Add New Project** → import the same repo again → set **Root Directory** to `frontend`.
2. Add environment variable:
   - `VITE_API_URL` — `https://your-backend.vercel.app` (the URL from step 2, no trailing slash)
3. Deploy.

## 4. Lock down CORS (recommended)

Go back to the **backend** project → Settings → Environment Variables → set `CLIENT_URL` to your frontend's URL (e.g. `https://your-frontend.vercel.app`) → redeploy the backend.

## Local development

```bash
# backend
cd backend
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev             # http://localhost:5000

# frontend (separate terminal)
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:5000
npm install
npm run dev              # http://localhost:5173
```
