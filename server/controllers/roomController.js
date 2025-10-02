import Room from "../models/Room.js";
import Song from "../models/Song.js";
import { generateRoomCode } from "../utils/generateCode.js";
import { getSpotifyAccessToken } from "../utils/getSpotifyAccessToken.js";
import { getSongsFromSpotifyPlaylist } from "../utils/fillPlaylistFromSpotify.js";

export const createRoom = async (req, res) => {
  const {
    uid,
    name,
    avatar,
    useSpotify,
    playlistId,
    code,
    rounds,
    duration,
    languages,
    rules
  } = req.body;

  console.log("Creating room with code:", code);
  console.log("Host:", uid, name);

  try {
    let playlist = [];

    if (useSpotify && playlistId) {
      const accessToken = await getSpotifyAccessToken();
      playlist = await getSongsFromSpotifyPlaylist(playlistId, accessToken,rounds);
    } else {
      playlist = await Song.aggregate([{ $sample: { size: 10 } }]);
    }

    const newRoom = new Room({
      code,
      hostUID: uid,
      players: [{ uid, name, avatar }],
settings: {
  rounds,
  duration,
  language: req.body.language || "tamil",
},

      playlist,
      rules
    });
    
    console.log("Attempting to save new room...");
    await newRoom.save();
    console.log("Room saved to MongoDB successfully!");
    res.status(201).json({ message: "Room created", code });
  } catch (err) {
    console.error("Room create error:", err);
    res.status(500).json({ message: "Error creating room" });
  }
};

export const joinRoom = async (req, res) => {
  const { code, uid, name, avatar } = req.body;

  console.log("Join request for room code:", code);
  console.log("Joining user:", uid, name);

  try {
    const room = await Room.findOne({ code });
    if (!room) {
      console.warn("Room not found");
      return res.status(404).json({ message: "Room not found" });
    }

    const alreadyInRoom = room.players.find((p) => p.uid === uid);
    if (alreadyInRoom) {
      console.warn("⚠️ Already in room");
      return res.status(400).json({ message: "Already joined" });
    }

    room.players.push({ uid, name, avatar });
    await room.save();

    
    const io = req.app.get('socketio');
    if (io) {
      io.to(code).emit("player-joined-room", {
        message: `${name} has joined the room.`,
        player: { uid, name, avatar },
      });
    }
    console.log("Player added to room and saved.");
    res.json({ message: "Joined room", room });
  } catch (err) {
    console.error("Join Room error:", err);
    res.status(500).json({ message: "Error joining room" });
  }
};

export const updateRoom = async (req, res) => {
  const { code } = req.params;
  const { rounds, duration, language, rules } = req.body;

  console.log("Updating room:", code);

  try {
    const room = await Room.findOne({ code });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (rounds !== undefined) room.settings.rounds = rounds;
    if (duration !== undefined) room.settings.duration = duration;
    if (language !== undefined) room.settings.language = language;
    if (rules !== undefined) room.rules = rules;

    await room.save();
    console.log("Room updated successfully");

    res.status(200).json({ message: "Room updated", room });
  } catch (err) {
    console.error("Room update error:", err);
    res.status(500).json({ message: "Error updating room" });
  }
};
