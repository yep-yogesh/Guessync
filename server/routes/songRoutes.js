import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

router.get("/by-index", async (req, res) => {
  const roomCode = req.query.roomCode;
  const index = parseInt(req.query.index);

  console.log("GET /by-index", roomCode, index);

  try {
    const room = await Room.findOne({ code: roomCode });
    if (!room) {
      console.log("Room not found");
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.playlist || !room.playlist[index]) {
      console.log("Song not found at index:", index, "in room:", roomCode);
      return res.status(404).json({ message: "Song not found" });
    }
    res.json({ song: room.playlist[index] });
  } catch (err) {
    console.error("Error fetching song by index:", err);
    res.status(500).json({ message: "Error fetching song by index" });
  }
});

export default router;
