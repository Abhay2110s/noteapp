# noteapp

This workspace now contains a React + Tailwind frontend that matches the backend auth and notes API.

## Run the stack

Backend:
- `cd backend`
- `npm run dev`

Frontend (Vite dev server):
- `cd frontend`
- `npm run dev`

Production-style integration:
- `cd frontend`
- `npm run build`
- `cd ../backend`
- `npm run start`

The backend serves the built frontend from `frontend/dist` when present, so the React app can be reached from the same origin as the API.
