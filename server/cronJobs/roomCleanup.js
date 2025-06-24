// server/cronJobs/roomCleanup.js

import cron from "node-cron";
import Room from "../models/Room.js";

export const scheduleRoomCleanup = () => {
  cron.schedule("* * * * *", async () => {
    const twentyMinsAgo = new Date(Date.now() - 20 * 60 * 1000);

    try {
      const result = await Room.deleteMany({ createdAt: { $lt: twentyMinsAgo } });

      if (result.deletedCount > 0) {
        console.log(`Deleted ${result.deletedCount} expired room at ${new Date().toLocaleTimeString()}`);
      }
    } catch (err) {
      console.error("Error during room cleanup:", err.message);
    }
  });
};
