const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');
const roomStore = require('./roomStore');
const upload = require('./fileUpload');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*", // For dev, allow all. Restrict in prod.
        methods: ["GET", "POST"]
    }
});

// File Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
    const { roomCode, userId } = req.body;
    if (!req.file || !roomCode) {
        return res.status(400).json({ error: "Missing file or room code" });
    }

    const fileData = {
        id: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        url: `/uploads/${req.file.filename}`,
        uploadedBy: userId,
        createdAt: new Date().toISOString()
    };

    const savedFile = roomStore.addFile(roomCode, fileData);

    // Broadcast file uploaded event
    io.to(roomCode).emit('file_uploaded', savedFile);

    res.json({ success: true, file: fileData });
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('create_room', (data, callback) => {
        let cb = callback;
        let dur = 30; // Default 30 min

        if (typeof data === 'function') {
            cb = data;
        } else if (data && typeof data === 'object') {
            dur = data.duration || 30;
        }

        const newRoom = roomStore.createRoom(dur);
        if (cb) cb({ success: true, roomCode: newRoom.code });
    });

    socket.on('join_room', ({ roomCode, userId }, callback) => {
        const room = roomStore.getRoom(roomCode);
        if (room) {
            socket.join(roomCode);
            roomStore.addUser(roomCode, userId, socket.id);

            // Send current state
            callback({
                success: true,
                messages: room.messages,
                files: room.files
            });

            // Notify others
            socket.to(roomCode).emit('user_joined', { userId });
        } else {
            callback({ success: false, error: "Room not found" });
        }
    });

    socket.on('send_message', ({ roomCode, message, userId }) => {
        const room = roomStore.getRoom(roomCode);
        if (room) {
            const msgData = {
                id: Date.now().toString(), // Simple ID
                text: message,
                userId,
                timestamp: new Date().toISOString()
            };
            roomStore.addMessage(roomCode, msgData);
            io.to(roomCode).emit('receive_message', msgData);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Handle cleanup if needed
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
