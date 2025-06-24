import express from 'express';
import { createOrUpdateUser, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.post("/sync", createOrUpdateUser);
router.get("/profile/:uid", getUserProfile);

export default router;
