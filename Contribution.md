text
# 🎶 Contributing to Guessync  

Hello and welcome! 👋  

Thank you for your interest in **Guessync**, our real-time multiplayer music guessing game. We’re thrilled you’re here and excited to collaborate with you. Whether it’s fixing a typo, improving documentation, resolving bugs, or building new features, every contribution matters.  

If you enjoy the project, consider giving us a ⭐ on GitHub — it truly helps!  

---

## 🛠️ Getting Started  

### 1. Fork & Clone  
Fork the repository on GitHub, then clone your copy:  
```git clone https://github.com/<your-username>/Guessync.git``` 
   
   ```cd Guessync```

### 2. Create a Branch  
Always create a new branch for your work (please avoid committing directly to `main`):  
```git checkout -b feature/my-awesome-idea```

### 3. Install Dependencies  
Guessync has both a frontend (React) and backend (Express). Install dependencies in each:  
```cd server && npm install```

```cd ../client && npm install```


### 4. Set Up Environment  
Copy the example environment files:  
`cp server/.env.example server/.env`

`cp client/.env.example client/.env`


Provide the required API keys (MongoDB, Firebase, Spotify, YouTube, Gemini/OpenAI, depending on your work).  

⚠️ Never commit `.env` files — they must remain private.  

### 5. Run the Application  
Use two terminals to run the backend and frontend: 
 
Backend (http://localhost:5000):
`cd server &&
npm run dev`

Frontend (http://localhost:5173):
`cd client &&
npm run dev`


##  Code Style  

Consistency keeps our codebase enjoyable to work with.  

**Frontend (React + Tailwind)**  
- Prefer functional components and React hooks  
- Keep components small and reusable  
- Use Tailwind utility classes (avoid inline styles)  

**Backend (Node + Express + MongoDB)**  
- Store route logic in `server/routes/`  
- Use `async/await` (no callbacks)  
- Handle real-time features in `sockets/`  

**General Guidelines**  
- Comment on complex logic where helpful  
- Follow the existing folder structure  
- Optimize for readability — write code for your *future self*  

---

## 🐛 Issues & 🔀 Pull Requests  

**Before opening an issue:**  
- Search to see if it already exists  
- Be clear about what happened vs. what you expected  
- Screenshots and logs are highly appreciated  

**Pull Requests (PRs):**  
- Branch names: `feature/...`, `fix/...`, or `docs/...`  
- Keep PRs small and focused  
- Include screenshots or GIFs when changing UI  
- Link related issues (`Fixes #123`)  

---

## ✍️ Commit Messages  

Clear, descriptive commit messages help collaboration:  
- `feat: add leaderboard animations`  
- `fix: crash when joining private room`  
- `docs: update setup instructions`  

---

## 🚀 Quick Test Drive  

1. Run backend → `npm run dev`  
2. Run frontend → `npm run dev`  



---

## Guidelines  

- Be kind and respectful — we’re all here to learn and build together.  
- First-time contributor can ask there questions and doubts to collaborators.
- A safe and learning environment is what we want to make.

