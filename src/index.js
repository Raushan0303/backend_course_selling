import express from 'express';
import bodyParser from 'body-parser';
import { connect } from './config/db.js';
import passport from 'passport';
import session from 'express-session';
import './config/passport-google.js';
import userRoutes from './routes/userRouter.js';
import courseRoute from './routes/courseRouter.js';
import roomRoutes from './routes/roomRoutes.js';
import { Secret_key } from './config/config.js';
import http from "http";
import { Server } from 'socket.io';
import path from 'path';
import cors from 'cors';
import mediasoup from 'mediasoup';
import { PeerServer } from 'peer';
import dotenv from 'dotenv';
import progressRoutes from './routes/progressRouter.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(cors({
    origin: 'http://localhost:3000', // or your frontend URL
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
const peerServer = PeerServer({
    port: 3002, // The port for PeerJS server
    path: '/peerjs',
});

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
    console.log('Client connected:', socket.id);

    // Event for joining a room
    socket.on("join-room", async (roomId, userId, name) => {
        if (!roomId) {
            console.error("Room ID is undefined");
            return; // Exit if roomId is invalid
        }

        socket.join(roomId);
        console.log(`User ${userId} joined room: ${roomId}`);

        // Emit to other clients in the room
        socket.to(roomId).emit("user-connected", userId, name);

        // Send router RTP capabilities to the client
        socket.emit('router-capabilities', router.rtpCapabilities);

        // Create a transport for the client
        socket.on('create-transport', async (callback) => {
            const transport = await router.createWebRtcTransport({
                listenIps: [{ ip: '127.0.0.1', announcedIp: null }],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true,
            });

            transport.on('dtlsstatechange', (dtlsState) => {
                if (dtlsState === 'closed') {
                    transport.close();
                }
            });

            callback({
                id: transport.id,
                iceParameters: transport.iceParameters,
                iceCandidates: transport.iceCandidates,
                dtlsParameters: transport.dtlsParameters,
            });
        });

        // Receive track and stream it to other participants
        socket.on('produce', async ({ transportId, kind, rtpParameters }, callback) => {
            const transport = router.getTransportById(transportId);
            const producer = await transport.produce({ kind, rtpParameters });
            callback({ id: producer.id });

            // Notify other clients in the room about the new producer
            socket.to(roomId).emit('new-producer', { producerId: producer.id, kind });
        });

        // Consume media from another participant
        socket.on('consume', async ({ producerId, rtpCapabilities }, callback) => {
            if (router.canConsume({ producerId, rtpCapabilities })) {
                const transport = await router.createWebRtcTransport({
                    listenIps: [{ ip: '127.0.0.1', announcedIp: null }],
                    enableUdp: true,
                    enableTcp: true,
                    preferUdp: true,
                });

                const consumer = await transport.consume({ producerId, rtpCapabilities });

                callback({
                    id: consumer.id,
                    producerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                });

                // Notify the client about the new consumer
                socket.emit('new-consumer', { consumerId: consumer.id, producerId });
            } else {
                callback({ error: 'Cannot consume' });
            }
        });

        // Message broadcast in room
        socket.on("messagesend", (message) => {
            io.to(roomId).emit("createMessage", message);
        });

        // Name broadcast in room
        socket.on("tellName", (name) => {
            socket.to(roomId).emit("AddName", name);
        });

        // User disconnection
        socket.on("disconnect", () => {
            socket.to(roomId).emit("user-disconnected", userId);
        });
    });
});

// Use PORT from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server and connect to MongoDB
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
