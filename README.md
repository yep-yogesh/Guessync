<p align="center">
  <img src="./client/src/assets/guessync.gif" alt="Guessync Demo" width="1000" />
</p>

<h1 align="center">
  <a href="https://guessync.netlify.app/">
    <img src="./client/public/wordmark.png" alt="Guessync" height="80" />
  </a>
</h1>

<p align="center">
  <b>A full-stack real-time multiplayer music guessing game</b> <br/>
  Compete with friends, guess songs, and use AI-powered hints!
</p>

---

## Features

- **Spotify playlist integration** for song sourcing  
- **YouTube audio streaming** for playback  
- **AI-powered hints** using OpenAI  
- **Real-time guessing & chat** via Socket.IO  
- **Typo-tolerant matching** with Fuse.js  
- **Secure authentication** (Firebase)  
- **Modern frontend** (React + Vite + Tailwind)  
- **Leaderboard scoring** in real time  
- **MongoDB Atlas** for scalable data storage  

---

## Tech Stack

### Frontend
- React + Vite  
- Tailwind CSS  
- Firebase Authentication  
- Socket.IO Client  

### Backend
- Node.js + Express.js  
- MongoDB (Mongoose)  
- Firebase Admin SDK (auth verification)  
- Socket.IO Server  
- Spotify API + YouTube API  
- Gemini API (AI hint generation)  
- Bruno (API testing)  

---

## Deployment

- **Frontend:** [Guessync on Netlify](https://guessync.netlify.app/)  
- **Backend:** [Guessync on Render](https://guessync.onrender.com/)  
- **Database:** MongoDB Atlas

---

## Local Development (Step-by-step)

Follow these steps to run both backend (Express) and frontend (Vite + React) locally.

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:5173

### 1) Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)
- A MongoDB database (Atlas or local)
- Firebase project (for Auth)
- Optional, but recommended:
  - Spotify API credentials (song sourcing)
  - YouTube API key (audio)
  - Gemini/OpenAI key (AI hints)

### 2) Clone and enter the project
```bash
git clone <your-fork-or-repo-url>
cd Guessync
```

### 3) Configure environment files

Use the provided examples to create your .env files.

- macOS/Linux:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

- Windows PowerShell:
```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Now fill the values:

Server (.env):
- MONGO_URI: Your MongoDB connection string (Atlas or local, e.g. mongodb://127.0.0.1:27017/guessync)
- PORT: 5000 (default)
- SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET: From Spotify Developer Dashboard
- YOUTUBE_API_KEY: From Google Cloud Console
- GEMINI_API_KEY: From Google AI Studio (optional if you won’t use AI hints)
- Firebase service account:
  - In Firebase console: Project settings → Service accounts → Generate new private key
  - Paste fields into .env. Important: keep FIREBASE_PRIVATE_KEY wrapped in quotes and with escaped newlines:
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your key...\n-----END PRIVATE KEY-----\n"

Client (.env):
- VITE_FIREBASE_*: From Firebase project settings → General → Your apps (Web app)

Tip: Never commit .env. It’s ignored by .gitignore already.

### 4) Install dependencies

From project root, install in both apps:

```bash
cd server && npm install
cd ../client && npm install
```

### 5) Run backend and frontend

Open two terminals:

- Terminal A (Backend):
```bash
cd server
npm run dev
# Expect: "Server running on port 5000"
```

- Terminal B (Frontend):
```bash
cd client
npm run dev
# Open the shown local URL, usually http://localhost:5173
```

### 6) Log in and try the app
- Use Email/Password or Google via Firebase
- Pick an avatar
- Create a room or join with a code
- Open a second browser window to simulate a friend joining

---

## Common Issues & Troubleshooting

- CORS error in browser console:
  - The backend only allows these origins by default:
    - http://localhost:5173
    - https://guessync.netlify.app
  - If your dev URL differs (e.g. 127.0.0.1:5173), add it in server/server.js (allowedOrigins array).

- Rate limiting (HTTP 429):
  - /api/room/create and /api/auth/login are limited to 5 requests/min (see server/server.js with express-rate-limit).
  - Wait a minute or increase limits for local dev only.

- Firebase “invalid credential” or “private key” errors:
  - Ensure FIREBASE_PRIVATE_KEY uses escaped newlines and is wrapped in quotes:
    "-----BEGIN PRIVATE KEY-----\n...lines...\n-----END PRIVATE KEY-----\n"
  - Make sure Client VITE_FIREBASE_* matches the same Firebase project.

- MongoDB connection errors:
  - For Atlas, whitelist your IP or set “Allow access from anywhere”.
  - Verify MONGO_URI is correct and the cluster is running.

- Vite port already in use:
  - Run a different port:
    npm run dev -- --port 5174

- Socket connection issues:
  - Backend must be running on http://localhost:5000.
  - Ensure your frontend’s socket base URL matches backend.

---

## Scripts

Backend (server/package.json):
- npm run dev → Nodemon on server.js

Frontend (client/package.json):
- npm run dev → Vite dev server
- npm run build → Production build

---

## Project Structure (high-level)

- server/ (Express, Socket.IO, MongoDB, Firebase Admin, routes, cron)
  - server.js (entry)
  - routes/, sockets/, config/, cronJobs/
  - .env.example
- client/ (React + Vite, Tailwind, Firebase Auth, Socket.IO client)
  - src/pages, src/components, src/assets
  - vite.config.js, tailwind config
  - .env.example

---

## Contributing

1) Fork the repo  
2) Create a feature branch  
3) Commit with clear messages  
4) Open a PR with a brief description and screenshots if relevant

Thanks for contributing!

## Contributors ✨

![Contributors Hall of Fame](https://github.aryansinghnegi.dev/?repo=yep-yogesh/Guessync)

