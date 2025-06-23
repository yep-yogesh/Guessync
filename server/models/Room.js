import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  hostUID: { type: String, required: true },

  hintVotes: {
    movie: { type: [String], default: [] },
    composer: { type: [String], default: [] },
    cover: { type: [String], default: [] },
    ai: { type: [String], default: [] } 
  },

  hintUsed: {
    movie: { type: Boolean, default: false },
    composer: { type: Boolean, default: false },
    cover: { type: Boolean, default: false },
    ai: { type: Boolean, default: false } // ✅ Prevent reuse
  },

  players: [
    {
      uid: String,
      name: String,
      avatar: String,
      score: { type: Number, default: 0 },
    }
  ],

  settings: {
    rounds: Number,
    duration: Number,
    language: String,
  },

  playlist: [
    {
      song: String,
      movie: String,
      composer: String,
      cover: String,
      videoId: String
    }
  ],

  currentRound: { type: Number, default: 1 },
  currentSongIndex: { type: Number, default: 0 },

  guesses: [
    {
      uid: String,
      text: String,
      correct: Boolean
    }
  ],

  guessedCorrectlyThisRound: { type: [String], default: [] }, // ✅ NEW FIELD
  rules: { type: String, default: "" },
  isActive: { type: Boolean, default: false }

}, { timestamps: true });

export default mongoose.model("Room", RoomSchema);
