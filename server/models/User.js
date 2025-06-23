import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  date: Date,
  partyName: String,
  place: String,   // '1st', '2nd', etc.
  points: Number
}, { _id: false });

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },  // Firebase UID or custom
  name: { type: String, required: true },
  avatar: { type: String, default: "" },

  // 🔥 Profile Stats
  wins: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  songsGuessed: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  fastestGuess: { type: Number, default: null }, // in seconds

  // 🕹️ Match History
  matchHistory: [MatchSchema]

}, { timestamps: true });

export default mongoose.model("User", UserSchema);
