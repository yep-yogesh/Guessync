import express from 'express';
import { createRoom, joinRoom,updateRoom} from '../controllers/roomController.js';
import { verifyFirebaseToken } from '../config/firebase.js';

const router = express.Router();

router.post('/create', verifyFirebaseToken, createRoom);
router.post('/join', verifyFirebaseToken, joinRoom);
router.put('/update/:code', verifyFirebaseToken, updateRoom);

export default router;
