import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import Song from "../models/Song.js";
import connectDB from "../config/db.js";

dotenv.config();
await connectDB();

const API_KEY = process.env.YOUTUBE_API_KEY;

const searchYouTubeVideoId = async (query) => {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
    query
  )}&key=${API_KEY}`;

  const res = await axios.get(url);
  return res.data.items?.[0]?.id?.videoId || null;
};

try {
  const songs = await Song.find({ videoId: { $exists: false } });

  for (const song of songs) {
    const searchQuery = `${song.song} ${song.movie} song`;
    console.log(`🔍 Searching for: ${searchQuery}`);

    const videoId = await searchYouTubeVideoId(searchQuery);

    if (videoId) {
      song.videoId = videoId;
      await song.save();
      console.log(`Updated: ${song.song} → ${videoId}`);
    } else {
      console.warn(`No video found for: ${searchQuery}`);
    }
  }

  console.log("YouTube videoId update done.");
  process.exit(0);
} catch (err) {
  console.error(" Error fetching YouTube IDs:", err.message);
  process.exit(1);
}
