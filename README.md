# Guessync - Capstone Project

Guessync is a real-time multiplayer music guessing game. Players join rooms, listen to short audio clips from songs, and try to guess the correct track. The game uses Spotify playlists and YouTube audio, with string similarity checks and AI-assisted matching to validate guesses.

---

## Key Features

- Spotify playlist import by language or theme  
- YouTube-based audio playback (first 15 seconds)  
- Real-time multiplayer game rooms using Socket.IO  
- Fuzzy guess matching with Fuse.js and AI  
- Timers, hints (blurred cover, movie name), point system  
- Leaderboard, profile stats, and match history  
- Responsive UI with Tailwind CSS  
- Google login authentication  

---

## Tech Stack

- **Frontend**: React, Tailwind CSS  
- **Backend**: Node.js, Express  
- **Database**: MongoDB  
- **APIs**: Spotify, YouTube  
- **Real-time**: Socket.IO  
- **Matching**: Fuse.js, string similarity  
- **Auth**: Google OAuth  

---

## Timeline

| Date       | Task                                      |
|------------|-------------------------------------------|
| Apr 1–3    | Repo setup, README, wireframe UI pages    |
| Apr 4–6    | Landing, navbar, how-to-play page         |
| Apr 7–10   | Join/Create room logic, room codes        |
| Apr 11–15  | Game room, visualizer, album art blur     |
| Apr 16–18  | Spotify + YouTube API integration         |
| Apr 19–22  | AI guessing, timers, game logic           |
| Apr 23–25  | Leaderboard, profile, match history       |
| Apr 26–29  | Testing, UI/UX polish, mobile support     |
| Apr 30     | Final review and submission               |

<!-- This line is added to force a pull request. -->
