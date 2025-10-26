import Room from "../models/Room.js";
import User from "../models/User.js";
import Fuse from "fuse.js";
import { getAIHint } from "../utils/getAIHint.js";

const activeTimers = new Map();

const fuzzyMatch = (actual, guess) => {
  const fuse = new Fuse([{ name: actual }], {
    keys: ["name"],
    includeScore: true,
    threshold: 0.4,
  });
  return fuse.search(guess).length > 0 && fuse.search(guess)[0].score <= 0.4;
};

const getPlacementText = (place) => {
  const j = place % 10;
  const k = place % 100;
  if (j === 1 && k !== 11) return `${place}ST`;
  if (j === 2 && k !== 12) return `${place}ND`;
  if (j === 3 && k !== 13) return `${place}RD`;
  return `${place}TH`;
};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", async ({ roomCode, user }) => {
      try {
        roomCode = String(roomCode);
        console.log(`${socket.id} joined room ${roomCode}`);

        let room = await Room.findOne({ code: roomCode });
        if (!room) {
          socket.emit("room-not-found");
          return;
        }

        const alreadyJoined = room.players.find((p) => p.uid === user.uid);
        if (!alreadyJoined) {
          room.players.push({ ...user, score: 0 });
          await room.save();
          console.log(`+ ${user.name} added to room ${roomCode}`);
        }

        await socket.join(roomCode);

        process.nextTick(() => {
          io.to(roomCode).emit("room-updated", {
            players: room.players,
            hintsUsed: room.hintUsed || {},
          });
        });        
      } catch (err) {
        console.error("Join-room error:", err);
      }
    });

    socket.on("start-game", async ({ roomCode }) => {
      try {
        roomCode = String(roomCode);
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        room.isActive = true;
        room.currentRound = 1;
        room.currentSongIndex = 0;
        room.guesses = [];
        room.guessedCorrectlyThisRound = [];
        room.hintVotes = { movie: [], composer: [], cover: [], ai: [] };
        room.hintUsed = { movie: false, composer: false, cover: false, ai: false };
        await room.save();

        io.to(roomCode).emit("move-to-game-room");

        setTimeout(() => startRound(roomCode, io), 3000);
      } catch (err) {
        console.error("Start-game error:", err);
      }
    });

    socket.on("submit-guess", async ({ roomCode, user, text }) => {
      try {
        roomCode = String(roomCode);

        const room = await Room.findOne({ code: roomCode });
        if (!room || !room.isActive) return;

        const song = room.playlist[room.currentSongIndex];
        const correct = fuzzyMatch(song.song.trim().toLowerCase(), text.trim().toLowerCase());

        room.guesses.push({ uid: user.uid, text, correct });
        const player = room.players.find((p) => p.uid === user.uid);

        if (correct && player) {
          player.score += 10;
          if (!room.guessedCorrectlyThisRound.includes(user.uid)) {
            room.guessedCorrectlyThisRound.push(user.uid);
          }
          await room.save();
          io.to(roomCode).emit("correct-guess", { user, score: player.score });

          if (room.guessedCorrectlyThisRound.length === room.players.length) {
            endRound(roomCode, io);
          }
        } else {
          await room.save();
          io.to(roomCode).emit("new-guess", { user, text });
        }
      } catch (err) {
        console.error("Submit-guess error:", err);
      }
    });

    socket.on("vote-hint", async ({ roomCode, uid, hintType }) => {
      try {
        roomCode = String(roomCode);
        const room = await Room.findOne({ code: roomCode });
        if (!room || !room.isActive) return;

        room.hintVotes ??= { movie: [], composer: [], cover: [], ai: [] };
        room.hintUsed ??= { movie: false, composer: false, cover: false, ai: false };

        if (room.hintUsed[hintType] || room.hintVotes[hintType].includes(uid)) return;

        room.hintVotes[hintType].push(uid);
        await room.save();

        const totalPlayers = room.players.length;
        const votes = room.hintVotes[hintType].length;

        io.to(roomCode).emit("hint-vote-count", { hintType, votes, totalPlayers });

        if (votes >= Math.ceil(totalPlayers / 2)) {
          room.hintUsed[hintType] = true;
          await room.save();

          if (hintType === "ai") {
            const aiHint = await getAIHint(room.playlist[room.currentSongIndex]?.song);
            io.to(roomCode).emit("reveal-hint", { hintType: "ai", aiHint });
          } else {
            io.to(roomCode).emit("reveal-hint", { hintType });
          }
        }
      } catch (err) {
        console.error("Vote-hint error:", err);
      }
    });

    socket.on("update-songs-guessed", async ({ uid, count }) => {
      try {
        let user = await User.findOne({ uid });

        if (!user) {
          user = new User({ uid, name: "User", avatar: "/avatars/1.png" });
        }

        user.songsGuessed = (user.songsGuessed || 0) + Number(count);
        await user.save();

        socket.emit("songs-guessed-updated", {
          message: "Songs guessed updated",
          songsGuessed: user.songsGuessed
        });

        console.log(`Updated songs guessed for ${uid}: ${user.songsGuessed}`);
      } catch (error) {
        console.error("Error updating songs guessed:", error);
      }
    });

    socket.on("update-guess-time", async ({ uid, guessTime }) => {
      try {
        let user = await User.findOne({ uid });

        if (!user) {
          user = new User({ uid, name: "User", avatar: "/avatars/1.png" });
        }

        const currentAvg = user.fastestGuess || 0;
        const gamesCount = user.gamesPlayed || 1;
        user.fastestGuess = (currentAvg * (gamesCount - 1) + guessTime) / gamesCount;

        await user.save();

        socket.emit("guess-time-updated", {
          message: "Average guess time updated",
          fastestGuess: user.fastestGuess
        });

        console.log(`Updated guess time for ${uid}: ${user.fastestGuess}s`);
      } catch (error) {
        console.error("Error updating guess time:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const startRound = async (roomCode, io) => {
  try {
    roomCode = String(roomCode);
    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    room.guessedCorrectlyThisRound = [];
    await room.save();

    const song = room.playlist[room.currentSongIndex];
    io.to(roomCode).emit("start-round", {
      round: room.currentRound,
      song,
      duration: room.settings.duration,
      players: room.players,
    });

    activeTimers.set(
      roomCode,
      setTimeout(() => endRound(roomCode, io), room.settings.duration * 1000)
    );
  } catch (err) {
    console.error("Start-round error:", err);
  }
};

const endRound = async (roomCode, io) => {
  try {
    roomCode = String(roomCode);
    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    clearTimeout(activeTimers.get(roomCode));
    activeTimers.delete(roomCode);

    io.to(roomCode).emit("round-ended");
    io.to(roomCode).emit("loading-next-round");

    const nextSongIndex = room.currentSongIndex + 1;
    if (
      nextSongIndex < room.playlist.length &&
      room.currentRound < room.settings.rounds
    ) {
      const nextSong = room.playlist[nextSongIndex];
      io.to(roomCode).emit("preload-next-song", {
        song: nextSong,
        duration: room.settings.duration,
      });
    }

    activeTimers.set(
      roomCode,
      setTimeout(() => nextRound(roomCode, io), 5000)
    );
  } catch (err) {
    console.error("End-round error:", err);
  }
};

const nextRound = async (roomCode, io) => {
  try {
    roomCode = String(roomCode);
    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    room.currentSongIndex += 1;
    room.currentRound += 1;
    room.guesses = [];
    room.guessedCorrectlyThisRound = [];
    room.hintVotes = { movie: [], composer: [], cover: [], ai: [] };
    room.hintUsed = { movie: false, composer: false, cover: false, ai: false };

    if (room.currentSongIndex >= room.playlist.length || room.currentRound > room.settings.rounds) {
      await room.save();
      
      // Game is over - save match results to database
      const sortedPlayers = room.players.sort((a, b) => b.score - a.score);

      // Save match results for each player
      for (let index = 0; index < sortedPlayers.length; index++) {
        const player = sortedPlayers[index];
        const place = getPlacementText(index + 1);

        try {
          let user = await User.findOne({ uid: player.uid });

          if (!user) {
            user = new User({ 
              uid: player.uid, 
              name: player.name, 
              avatar: player.avatar || "/avatars/1.png" 
            });
          }

          user.matchHistory.push({
            date: new Date(),
            partyName: roomCode,
            place: place,
            points: player.score
          });

          user.gamesPlayed = (user.gamesPlayed || 0) + 1;
          user.totalScore = (user.totalScore || 0) + player.score;

          if (place === "1ST") {
            user.wins = (user.wins || 0) + 1;
            user.streak = (user.streak || 0) + 1;
          } else {
            user.streak = 0;
          }

          if (user.streak > (user.bestStreak || 0)) {
            user.bestStreak = user.streak;
          }

          await user.save();
          console.log(`Saved match result for ${player.name} (${place})`);
        } catch (error) {
          console.error(`Error saving match for ${player.name}:`, error);
        }
      }

      io.to(roomCode).emit("game-over", {
        leaderboard: sortedPlayers,
      });
      return;
    }

    await room.save();
    startRound(roomCode, io);
  } catch (err) {
    console.error("Next-round error:", err);
  }
};

export default socketHandler;