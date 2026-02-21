const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');
const roomStore = require('./roomStore');
const upload = require('./fileUpload');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Add debug logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Admin & Resource Routes
app.use('/api/admin', adminRoutes);

// Root route / Health check
app.get('/', (req, res) => {
    res.json({
        status: "active",
        message: "MSIT_ROOM Server is running",
        version: "1.0.0"
    });
});

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
        let ownerId = null;
        let isPermanent = false;
        let customCode = null;

        if (typeof data === 'function') {
            cb = data;
        } else if (data && typeof data === 'object') {
            dur = data.duration || 30;
            ownerId = data.userId;
            isPermanent = data.isPermanent || false;
            customCode = data.roomCode || null;
        }

        const room = roomStore.createRoom(dur, customCode, ownerId, isPermanent);
        if (cb) cb({ success: true, roomCode: room.code, isOwner: true });
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
                files: room.files,
                users: roomStore.getUsers(roomCode),
                isOwner: room.ownerId === userId // Check ownership
            });

            // Notify others
            socket.to(roomCode).emit('user_joined', { userId });
            io.to(roomCode).emit('room_users_update', roomStore.getUsers(roomCode));
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
                timestamp: Date.now()
            };
            roomStore.addMessage(roomCode, msgData);
            io.to(roomCode).emit('receive_message', msgData);
        }
    });

    socket.on('clear_room', ({ roomCode }) => {
        const success = roomStore.clearFiles(roomCode);
        if (success) {
            io.to(roomCode).emit('files_cleared');

            // Optional: System message
            const room = roomStore.getRoom(roomCode);
            if (room) {
                const msgData = {
                    id: Date.now().toString(),
                    text: '🧹 All files were cleared from the room.',
                    userId: 'SYSTEM',
                    timestamp: Date.now()
                };
                roomStore.addMessage(roomCode, msgData);
                io.to(roomCode).emit('receive_message', msgData);
            }
        }
    });

    socket.on('disconnecting', () => {
        // socket.rooms is a Set containing the socket ID and rooms
        const rooms = Array.from(socket.rooms);
        // We know room codes are 6 chars usually, or custom strings. 
        // Filter out socket.id (which is one of the rooms)
        rooms.forEach((roomCode) => {
            if (roomCode !== socket.id) {
                roomStore.removeUser(roomCode, socket.id);
                // Emit update to that room
                io.to(roomCode).emit('room_users_update', roomStore.getUsers(roomCode));
                console.log(`User ${socket.id} left room ${roomCode}`);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});



// Cleanup interval for permanent rooms to notify clients when content expires
setInterval(() => {
    roomStore.rooms.forEach((room, code) => {
        if (room.isPermanent) {
            const pruned = roomStore.pruneExpiredContent(code);
            if (pruned) {
                // Notify clients in the room to refresh their content
                io.to(code).emit('content_pruned', {
                    messages: room.messages,
                    files: room.files
                });
            }
        }
    });
}, 30000); // Check every 30 seconds

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
