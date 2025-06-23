import express from 'express';
import { verifyFirebaseToken } from '../config/firebase.js';

const router = express.Router();

router.get('/me', verifyFirebaseToken, (req, res) => {
  res.json({ uid: req.uid });
});

export default router;
