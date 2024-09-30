import express from 'express';
import { joinMeeting, joinOldMeeting, joinRoom } from '../controllers/room-controller.js';

const router = express.Router();

// Route to create a new meeting (host)
router.get('/join', joinMeeting);

// Route to join an existing meeting
router.get('/join-old-meeting', joinOldMeeting);

// Route to load the room
router.get('/join/:rooms', joinRoom);

export default router;
