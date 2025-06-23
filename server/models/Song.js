import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  song: String,
  movie: String,
  composer: String,
  cover: String,
  videoId: String // will be filled after YouTube step
});

export default mongoose.model("Song", songSchema);
