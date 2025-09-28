<p align="center">
  <img src="./client/src/assets/guessync.gif" alt="Guessync Demo" width="1000" />
</p>

<h1 align="center">
  <a href="https://guessync.netlify.app/" style="color: yellow; text-decoration: none;">
    Guessync
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
- Fuse.js (fuzzy search)  
- Socket.IO Client  

### Backend
- Node.js + Express.js  
- MongoDB (Mongoose)  
- Firebase Admin SDK (auth verification)  
- Socket.IO Server  
- Cron jobs for room cleanup  
- Rate limiting with **express-rate-limit**  
- Spotify API + YouTube API  
- OpenAI API (AI hint generation)  
- Vitest (testing)  
- Bruno (API testing)  
- Docker  

---

## Deployment

- **Frontend:** [Guessync on Netlify](https://guessync.netlify.app/)  
- **Backend:** [Render](https://guessync.onrender.com/)  
- **Database:** MongoDB Atlas  
