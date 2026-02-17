const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class RoomStore {
    constructor() {
        this.rooms = new Map(); // code -> Room stored in memory
        this.ROOM_EXPIRY = 30 * 60 * 1000; // 30 minutes
    }

    createRoom(duration = 30) {
        const code = this._generateRoomCode();
        // duration is in minutes, convert to ms
        const expiryTime = duration * 60 * 1000;

        const room = {
            code,
            createdAt: Date.now(),
            expiresAt: Date.now() + expiryTime,
            users: new Map(), // socketId -> User
            files: [],
            messages: [],
            timer: null
        };

        this.rooms.set(code, room);
        this._startExpiryTimer(code, expiryTime);

        return room;
    }

    getRoom(code) {
        return this.rooms.get(code);
    }

    // joinRoom removed, use addUser instead

    leaveRoom(code, socketId) {
        const room = this.rooms.get(code);
        if (!room) return;

        if (room.users) {
            room.users.delete(socketId);
        }
    }

    // Correcting join/leave to use Map for users
    addUser(code, userId, socketId) {
        const room = this.rooms.get(code);
        if (!room) return null;

        if (!room.users) room.users = new Map();
        room.users.set(socketId, { id: userId, socketId });
        this._resetExpiryTimer(code);
        return room;
    }

    removeUser(code, socketId) {
        const room = this.rooms.get(code);
        if (!room) return;

        if (room.users) {
            room.users.delete(socketId);
        }
    }

    addMessage(code, message) {
        const room = this.rooms.get(code);
        if (!room) return;

        const msg = {
            ...message,
            timestamp: Date.now(),
            expiresAt: room.expiresAt
        };
        room.messages.push(msg);
        this._resetExpiryTimer(code);
        return msg;
    }

    addFile(code, fileData) {
        const room = this.rooms.get(code);
        if (!room) return;

        // Add expiry to file data
        const file = {
            ...fileData,
            timestamp: Date.now(),
            expiresAt: room.expiresAt
        };
        room.files.push(file);
        this._resetExpiryTimer(code);
        return file;
    }

    _generateRoomCode() {
        // Generate 6-digit alphanumeric code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        // Ensure uniqueness
        if (this.rooms.has(result)) return this._generateRoomCode();
        return result;
    }

    _startExpiryTimer(code) {
        const room = this.rooms.get(code);
        if (!room) return;

        if (room.timer) clearTimeout(room.timer);

        const remainingTime = room.expiresAt - Date.now();
        if (remainingTime <= 0) {
            this.deleteRoom(code);
            return;
        }

        room.timer = setTimeout(() => {
            this.deleteRoom(code);
        }, remainingTime);
    }

    _resetExpiryTimer(code) {
        this._startExpiryTimer(code);
    }

    deleteRoom(code) {
        const room = this.rooms.get(code);
        if (room) {
            if (room.timer) clearTimeout(room.timer);

            // Cleanup files
            if (room.files && room.files.length > 0) {
                room.files.forEach(file => {
                    // Each file has a local path if we saved it that way. 
                    // In fileUpload.js we saved only filename and constructed url.
                    // We can reconstruct path from filename.
                    const filePath = path.join(__dirname, '../uploads', file.id);
                    fs.unlink(filePath, (err) => {
                        if (err) console.error(`Failed to delete file ${filePath}:`, err);
                    });
                });
            }

            this.rooms.delete(code);
            console.log(`Room ${code} expired and deleted.`);
        }
    }
}

module.exports = new RoomStore();
