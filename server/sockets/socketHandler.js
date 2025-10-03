import Room from "../models/Room.js";
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

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", async ({ roomCode, user }) => {
      try {
        await socket.join(roomCode);
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

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const startRound = async (roomCode, io) => {
  try {
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
      io.to(roomCode).emit("game-over", {
        leaderboard: room.players.sort((a, b) => b.score - a.score),
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
