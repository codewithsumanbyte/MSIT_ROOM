import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RoomContext = createContext();

export const useRoom = () => {
    return useContext(RoomContext);
};

export const RoomProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [roomCode, setRoomCode] = useState(null);
    const [userId, setUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [files, setFiles] = useState([]);
    const [users, setUsers] = useState([]); // Simplified count or list
    const navigate = useNavigate();

    // Initialize user ID only once
    useEffect(() => {
        let storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            storedUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('userId', storedUserId);
        }
        setUserId(storedUserId);
    }, []);

    // Initialize socket
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on('file_uploaded', (file) => {
            setFiles((prev) => [...prev, file]);
            toast.success(`File ${file.originalName} shared!`);
        });

        socket.on('user_joined', ({ userId: joinedUserId }) => {
            toast(`${joinedUserId === userId ? 'You' : 'A user'} joined the room`, { icon: '👋' });
        });

        return () => {
            socket.off('connect');
            socket.off('receive_message');
            socket.off('file_uploaded');
            socket.off('user_joined');
        };
    }, [socket, userId]);

    const createRoom = (duration = 30) => {
        if (!socket) return;
        socket.emit('create_room', { duration }, (response) => {
            if (response.success) {
                setRoomCode(response.roomCode);
                joinRoom(response.roomCode);
            } else {
                toast.error('Failed to create room');
            }
        });
    };

    const joinRoom = (code) => {
        if (!socket || !userId) return;
        socket.emit('join_room', { roomCode: code, userId }, (response) => {
            if (response.success) {
                setRoomCode(code);
                setMessages(response.messages || []);
                setFiles(response.files || []);
                navigate(`/room/${code}`);
                toast.success('Joined room successfully!');
            } else {
                toast.error(response.error || 'Failed to join room');
            }
        });
    };

    const sendMessage = (text) => {
        if (!socket || !roomCode) return;
        socket.emit('send_message', { roomCode, message: text, userId });
    };

    const uploadFile = async (file) => {
        if (!roomCode || !userId) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('roomCode', roomCode);
        formData.append('userId', userId);

        try {
            const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
            const response = await fetch(`${SERVER_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            // Success handled by socket event 'file_uploaded'
        } catch (error) {
            console.error(error);
            toast.error('File upload failed');
        }
    };

    const value = {
        socket,
        roomCode,
        userId,
        messages,
        files,
        createRoom,
        joinRoom,
        sendMessage,
        uploadFile
    };

    return (
        <RoomContext.Provider value={value}>
            {children}
        </RoomContext.Provider>
    );
};
