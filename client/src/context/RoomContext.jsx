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
    const [users, setUsers] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0); // Simple 0-100 for now, or could map by file
    const [isUploading, setIsUploading] = useState(false);
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
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://msit-room-api.onrender.com';

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

        socket.on('room_users_update', (updatedUsers) => {
            setUsers(updatedUsers);
        });

        socket.on('content_pruned', ({ messages: newMessages, files: newFiles }) => {
            setMessages(newMessages);
            setFiles(newFiles);
            toast('Old messages and files were automatically cleaned up.', { icon: '🧹' });
        });

        return () => {
            socket.off('connect');
            socket.off('receive_message');
            socket.off('file_uploaded');
            socket.off('user_joined');
            socket.off('room_users_update');
            socket.off('content_pruned');
        };
    }, [socket, userId]);

    const createRoom = (duration = 30, isPermanent = false, customCode = null) => {
        if (!socket) return;
        socket.emit('create_room', { duration, isPermanent, roomCode: customCode }, (response) => {
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
                setUsers(response.users || []);
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

    const uploadFile = (file) => {
        if (!roomCode || !userId) return;

        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('roomCode', roomCode);
            formData.append('userId', userId);

            const xhr = new XMLHttpRequest();
            const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

            xhr.open('POST', `${SERVER_URL}/upload`, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percentComplete);
                    setIsUploading(true);
                }
            };

            xhr.onload = () => {
                setIsUploading(false);
                setUploadProgress(0);
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    // Socket event will handle file addition
                    resolve(response);
                } else {
                    reject(new Error('Upload failed'));
                    toast.error('Upload failed');
                }
            };

            xhr.onerror = () => {
                setIsUploading(false);
                setUploadProgress(0);
                reject(new Error('Upload failed'));
                toast.error('Upload failed');
            };

            xhr.send(formData);
        });
    };

    const value = {
        socket,
        roomCode,
        userId,
        messages,
        files,
        users,
        uploadProgress,
        isUploading,
        createRoom,
        joinRoom,
        sendMessage,
        uploadFile,
        setMessages,
        setFiles
    };

    return (
        <RoomContext.Provider value={value}>
            {children}
        </RoomContext.Provider>
    );
};
