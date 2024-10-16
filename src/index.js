import express from 'express';
import bodyParser from 'body-parser';
import { connect } from './config/db.js';
import passport from 'passport';
import session from 'express-session';
import './config/passport-google.js';
import userRoutes from './routes/userRouter.js';
import courseRoute from './routes/courseRouter.js';
import roomRoutes from './routes/roomRoutes.js';
import instructorRoutes from "./routes/instructorRoutes.js"; 
import notebookRoutes from "./routes/notebookRoutes.js";
import noteSectionRoutes from "./routes/sectionRoutes.js"
import { Secret_key } from './config/config.js';
import http from "http";
import { Server } from 'socket.io';
import path from 'path';
import cors from 'cors';
import mediasoup from 'mediasoup';
import { PeerServer } from 'peer';
import dotenv from 'dotenv';
import progressRoutes from './routes/progressRouter.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Update CORS configuration
app.use(cors({
    origin: "*", // Allow any domain
    credentials: true 
}));

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"], 
        credentials: true 
    }
});

// Setup PeerJS server
const peerServer = PeerServer({ port: 3002, path: '/peerjs' });
console.log('PeerJS server running on port 3002');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));

// Session configuration
app.use(session({
    secret: Secret_key,
    resave: false,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Route registration
app.use('/api/v1', userRoutes);
app.use('/api/v1', courseRoute);
app.use('/api/v1', roomRoutes);
app.use('/api/v1', progressRoutes);
app.use('/api/v1',notebookRoutes);
app.use('/api/v1',noteSectionRoutes);
app.use("/", instructorRoutes);

// 404 route handler
app.get('*', (req, res) => {
    res.status(404).send('Not found'); 
});

// Mediasoup setup
let worker;
let router;

const initMediasoup = async () => {
    worker = await mediasoup.createWorker();
    worker.on('died', () => {
        console.error('mediasoup worker died');
        process.exit(1);
    });

    router = await worker.createRouter({
        mediaCodecs: [
            {
                kind: 'audio',
                mimeType: 'audio/opus',
                clockRate: 48000,
                channels: 2,
            },
            {
                kind: 'video',
                mimeType: 'video/VP8',
                clockRate: 90000,
                parameters: {},
            },
        ],
    });
};

// Initialize mediasoup
initMediasoup().catch(err => console.error('Mediasoup initialization error:', err));

// Socket.IO Setup for real-time communication
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("join-room", (roomId, userId, username) => {
        console.log(`User ${username} (${userId}) joining room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);

        socket.on("disconnect", () => {
            console.log(`User ${username} (${userId}) disconnected from room ${roomId}`);
            socket.to(roomId).emit("user-disconnected", userId);
        });

        socket.on("send-message", (roomId, message) => {
            console.log(`Message received in room ${roomId}:`, message);
            io.to(roomId).emit("create-message", message);
        });
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
    try {
        console.log(`Server running on port ${PORT}`);
        await connect();
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
}).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please choose a different port or close the application using this port.`);
    } else {
        console.error('An error occurred while starting the server:', error);
    }
    process.exit(1);
});