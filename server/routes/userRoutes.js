import express from 'express';
import { 
  createOrUpdateUser, 
  getUserProfile,
  saveMatchResult,
  updateSongsGuessed,
  updateAverageGuessTime
} from '../controllers/userController.js';
import { verifyFirebaseToken } from '../config/firebase.js';

const router = express.Router();

router.post("/sync", createOrUpdateUser);
router.get("/profile/:uid", getUserProfile);

// NEW ENDPOINTS
router.post("/match-result", saveMatchResult);
router.post("/update-songs-guessed", updateSongsGuessed);
router.post("/update-guess-time", updateAverageGuessTime);

export default router;