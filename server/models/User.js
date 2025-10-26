import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  partyName: String,
  place: String,  
  points: Number
}, { _id: false });

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, default: "" },
  wins: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  songsGuessed: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  fastestGuess: { type: Number, default: 0 }, // in seconds (average)
  totalScore: { type: Number, default: 0 },
  
  matchHistory: [MatchSchema],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for faster queries
UserSchema.index({ uid: 1 });
UserSchema.index({ wins: -1 });

export default mongoose.model("User", UserSchema);