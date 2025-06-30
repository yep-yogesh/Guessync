# Guessync

**Guessync** is a full-stack real-time multiplayer music guessing game. Players join rooms, listen to short audio snippets, and compete to guess the correct song titles. The platform supports AI-generated hints, fuzzy matching for guesses, and leaderboard scoring.

## Features

- Spotify playlist integration for song sourcing
- YouTube audio streaming for playback
- AI-powered hint generation via OpenAI
- Real-time guessing and chat via Socket.IO
- Typo-tolerant answer matching using Fuse.js
- Secure user authentication with Firebase
- Fast and modern frontend with React + Vite
- Hosted frontend on Netlify and backend on Render

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Vite
- Firebase Authentication
- Fuse.js (fuzzy search)
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Firebase Admin SDK (token verification)
- Socket.IO Server
- Cron jobs for room cleanup
- Rate limiting (express-rate-limit)
- YouTube & Spotify API Integration
- OpenAI API (hint generation)
- Vitest
- Bruno  
- Docker

### Deployment
- Frontend: [Guessync](https://guessync.netlify.app/)(Netlify)
- Backend: [Render](https://guessync.onrender.com/)
- Database: MongoDB Atlas


