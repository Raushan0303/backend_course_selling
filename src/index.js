import express from 'express';
import bodyParser from 'body-parser';
import { connect } from './config/db.js';
import passport from 'passport';
import session from 'express-session';
import './config/passport-google.js';
import userRoutes from './routes/userRouter.js';
import courseRoute from './routes/courseRouter.js';
import { Secret_key } from './config/config.js';
import http from "http";
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { ExpressPeerServer } from 'peer';
import roomRoutes from './routes/roomRoutes.js';
import cors from 'cors';

// Use CORS


const app = express();
const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));
app.use("/peerjs", peerServer);

app.get('/', (req, res) => {
    return res.sendFile(path.resolve('./public/index.html')); // Correct path resolution
});

app.use(session({
    secret: Secret_key,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', userRoutes);
app.use('/api/v1', courseRoute);
app.use('/api/v1', roomRoutes);

const io = new Server(server);
io.on("connection", (socket) => {
    socket.on("join-room", (roomId, id, myname) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", id, myname);

        socket.on("messagesend", (message) => {
            io.to(roomId).emit("createMessage", message);
        });

        socket.on("tellName", (myname) => {
            socket.to(roomId).broadcast.emit("AddName", myname);
        });

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", id);
        });
    });
});

server.listen(3000, async () => {
    console.log(`Server is running on port 3000`);
    await connect();
    console.log('MongoDB connected');
});
