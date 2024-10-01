import express from 'express';
import { createMeeting, joinExistingMeeting, joinRoom } from '../controllers/room-controller.js';

const router = express.Router();


router.post('/create-meeting/:name', createMeeting);


router.get('/join-meeting', joinExistingMeeting);


router.get('/room/:rooms', joinRoom);

export default router;
