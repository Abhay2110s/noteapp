# Note App

A full-stack notes app: React 19 + Vite + Tailwind on the frontend, Express 5 + MongoDB (Mongoose) on the backend, with cookie-based JWT auth.

```
noteapp/
├── backend/    → deploy to Render (always-on Node server)
└── frontend/   → deploy to Netlify (static Vite build)
```

## Why Render + Netlify instead of Vercel

Vercel runs the backend as a **serverless function** — a fresh, short-lived instance that has to reconnect to MongoDB from scratch on nearly every request. Under Vercel's Hobby plan and a free MongoDB Atlas cluster, that reconnect was intermittently slow enough to exceed the function's time limit, causing the "request timed out" / 504 errors seen during testing.

Render runs the backend as a normal **long-lived Node process** (like `node server.js` on your own machine, just hosted). It connects to MongoDB **once** when it starts up and keeps that connection open for as long as the server runs — no repeated cold-start reconnects, no serverless time limit. This is a better architectural fit for this app.

## 1. MongoDB Atlas (same as before)

If you already have a cluster from the Vercel attempt, you can reuse it — just make sure:
- Network Access has `0.0.0.0/0` allowed (Active).
- You have your connection string (`MONGO_URI`) handy.

## 2. Deploy the backend to Render

1. Push this repo to GitHub (if not already done).
2. Go to render.com, sign up/log in, click New + -> Web Service.
3. Connect your GitHub repo. Set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free is fine to start.
4. Add environment variables (Environment tab):
   - `MONGO_URI` - your Atlas connection string
   - `JWT_SECRET` - any long random string
   - `NODE_ENV` - `production`
   - `CLIENT_URL` - leave blank for now, add it after deploying the frontend
5. Click Create Web Service. Render will build and start it - this takes a few minutes.
6. Once live, Render gives you a URL like `https://noteapp-backend.onrender.com`. Open it - you should see `{"message":"Note App Backend is running successfully!"}`.

Note on Render's free tier: free web services "spin down" after 15 minutes of no traffic and take 30-60 seconds to wake up on the next request. This is normal - the first request after idle time will be slow, then it's fast again.

## 3. Deploy the frontend to Netlify

1. Go to netlify.com, sign up/log in, click Add new site -> Import an existing project.
2. Connect the same GitHub repo.
3. Set:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist` (Netlify may auto-fill this from `netlify.toml`)
4. Add environment variable (Site configuration -> Environment variables):
   - `VITE_API_URL` - your Render backend URL from step 2 (e.g. `https://noteapp-backend.onrender.com`, no trailing slash)
5. Deploy. Netlify gives you a URL like `https://your-site-name.netlify.app`.

## 4. Lock down CORS

Go back to Render -> your backend service -> Environment -> set `CLIENT_URL` to your Netlify URL (e.g. `https://your-site-name.netlify.app`) -> save (Render auto-redeploys on env var change).

## 5. Test

Open your Netlify URL, register an account, log in, create/edit/delete a note. If the backend was idle, the first request may take up to a minute (free tier spin-up) - that's expected, not a bug.

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
