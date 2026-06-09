const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const syllabusStore = require('../syllabusStore');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'msitadmin';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';



// Admin Login
router.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ success: true, token });
    }
    res.status(401).json({ success: false, error: 'Invalid password' });
});

// Auth Middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Failed to authenticate' });
        next();
    });
};



// Public: Get all custom subjects
router.get('/subjects', (req, res) => {
    res.json(syllabusStore.getAll());
});

// Admin: Add custom subject
router.post('/subjects', authenticate, (req, res) => {
    const { branch, semester, subjectId, name, credits, resources } = req.body;
    if (!branch || !semester || !subjectId || !name || !credits) {
        return res.status(400).json({ error: 'Missing required subject details' });
    }

    const newSubject = {
        branch,
        semester: Number(semester),
        id: subjectId,
        name,
        credits: Number(credits),
        resources: resources || []
    };

    if (syllabusStore.add(newSubject)) {
        res.json({ success: true, subject: newSubject });
    } else {
        res.status(500).json({ error: 'Failed to save subject' });
    }
});

// Admin: Delete custom subject
router.delete('/subjects/:id', authenticate, (req, res) => {
    if (syllabusStore.delete(req.params.id)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Failed to delete subject' });
    }
});

module.exports = router;
