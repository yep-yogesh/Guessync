<p align="center">
  <img src="./client/src/assets/guessync.gif" alt="Guessync Demo" width="1000" />
</p>

<h1 align="center">
  <a href="https://guessync.netlify.app/">
    <img src="./client/public/wordmark.png" alt="Guessync" height="80" />
  </a>
</h1>

<p align="center"><b>A full-stack real-time multiplayer music guessing game</b><br/>
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

[... existing local development instructions remain here ...]

---

## Architecture Overview (placeholder)

> This section provides a high-level view of system components and data flow. Contributors can replace placeholders with finalized diagrams and extend sections as the project evolves.

### High-level System Diagram (Mermaid)
```mermaid
flowchart LR
  subgraph Client [Client (React + Vite)]
    UI[Game UI]
    AuthC[Firebase Auth (client)]
    SockC[Socket.IO Client]
  end

  subgraph Server [Server (Node + Express)]
    API[REST API]
    SockS[Socket.IO Server]
    AuthS[Firebase Admin]
  end

  subgraph Data[Data Layer]
    DB[(MongoDB)]
    Spotify[(Spotify API)]
    YouTube[(YouTube API)]
    Gemini[(Gemini API)]
  end

  UI -->|HTTP| API
  UI <-->|WS| SockS
  AuthC -->|ID Token| API
  API --> AuthS
  API <-->|queries| DB
  API --> Spotify
  API --> YouTube
  API --> Gemini
```

### Realtime Events Sequence (Mermaid)
```mermaid
sequenceDiagram
  participant C as Client
  participant S as Server
  participant DB as MongoDB

  C->>S: socket.connect()
  S-->>C: connected (room/user context)
  C->>S: guess:submit { roomId, text }
  S->>DB: validate & record attempt
  S-->>C: guess:result { correct, scoreDelta }
  S-->>C: leaderboard:update
```

---

## REST API (skeleton)

> Replace examples with real request/response bodies. Document auth (Firebase ID token) requirements per route.

### Auth
- POST /api/auth/login
  - Desc: Exchange Firebase ID token for backend session (if applicable)
  - Auth: Firebase ID token in Authorization: Bearer <token>
  - 200: { user, token? }

### Rooms
- POST /api/room/create
  - Desc: Create a new room
  - Auth: Required
  - Body: { name?, maxPlayers?, playlistSource? }
  - 201: { roomId, code, hostId }

- POST /api/room/join
  - Desc: Join a room by code
  - Auth: Required
  - Body: { code }
  - 200: { room, player }

- POST /api/room/start
  - Desc: Start the game (host-only)
  - Auth: Required
  - Body: { roomId }
  - 200: { status: "started" }

### Game
- GET /api/game/state?roomId=
  - Desc: Current round, players, and scoreboard
  - Auth: Required
  - 200: { room, round, players, leaderboard }

- POST /api/game/skip
  - Desc: Skip current song (host-only or vote-based)
  - Auth: Required
  - Body: { roomId }
  - 200: { status: "skipped" }

### Media/Integrations
- GET /api/media/track?roomId=
  - Desc: Returns the current track metadata (no spoilers)
  - Auth: Required
  - 200: { titleHint, artistHint, previewUrl? }

- POST /api/hints
  - Desc: Request an AI hint for current track
  - Auth: Required
  - Body: { roomId, type }
  - 200: { hint }

---

## Data Models (skeleton)

> Define with Mongoose schemas. Keep in sync with actual code.

```ts
// User
{
  _id: ObjectId,
  uid: string, // Firebase UID
  displayName: string,
  photoURL?: string,
  createdAt: Date,
}

// Room
{
  _id: ObjectId,
  code: string,
  name: string,
  hostId: ObjectId,
  status: 'lobby' | 'in-progress' | 'finished',
  maxPlayers: number,
  createdAt: Date,
}

// Player
{
  _id: ObjectId,
  userId: ObjectId,
  roomId: ObjectId,
  score: number,
  connected: boolean,
}

// Round
{
  _id: ObjectId,
  roomId: ObjectId,
  trackId: string,        // Spotify/YouTube identifier
  startedAt: Date,
  endedAt?: Date,
  answers: [{ userId: ObjectId, text: string, correct: boolean, ts: Date }],
}
```

---

## Socket.IO Events (skeleton)

> Prefix with room context. Document server emits and client emits separately.

### Client -> Server
- room:join { roomId }
- room:leave { roomId }
- guess:submit { roomId, text }
- chat:send { roomId, message }
- game:start { roomId }
- game:skip { roomId }

### Server -> Client
- room:joined { room, player }
- room:left { roomId }
- guess:result { correct, scoreDelta, answer }
- leaderboard:update { players }
- round:started { round }
- round:ended { round, answer }
- chat:message { from, message, ts }
- error { code, message }

---

## Rate Limits & Troubleshooting
- /api/room/create and /api/auth/login are limited to 5 requests/min (see server/server.js with express-rate-limit).  
  Wait a minute or increase limits for local dev only.
- Firebase “invalid credential” or “private key” errors:  
  Ensure FIREBASE_PRIVATE_KEY uses escaped newlines and is wrapped in quotes:
  "-----BEGIN PRIVATE KEY-----\n...lines...\n-----END PRIVATE KEY-----\n"  
  Make sure Client VITE_FIREBASE_* matches the same Firebase project.
- MongoDB connection errors:  
  For Atlas, whitelist your IP or set “Allow access from anywhere”.  
  Verify MONGO_URI is correct and the cluster is running.
- Vite port already in use:  
  Run a different port: `npm run dev -- --port 5174`
- Socket connection issues:  
  Backend must be running on http://localhost:5000.  
  Ensure your frontend’s socket base URL matches backend.

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

> Contributors are encouraged to expand the Architecture, API, Models, and Events sections with concrete details as code evolves. Keep examples up to date and add links to source files.

1) Fork the repo  
2) Create a feature branch  
3) Commit with clear messages  
4) Open a PR with a brief description and screenshots if relevant  

Thanks for contributing!
