const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const resourceStore = require('../resourceStore');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'msitadmin';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Multer storage for resources
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(__dirname, '../../uploads/resources');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and images are allowed.'));
        }
    }
});

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

// Public: Get all resources
router.get('/resources', (req, res) => {
    res.json(resourceStore.getAll());
});

// Admin: Upload resource
router.post('/upload', authenticate, upload.single('file'), (req, res) => {
    const { title, year, category } = req.body;

    if (!req.file || !title || !year || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const resource = {
        title,
        year,
        category,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: `/uploads/resources/${req.file.filename}`
    };

    if (resourceStore.add(resource)) {
        res.json({ success: true, resource });
    } else {
        res.status(500).json({ error: 'Failed to save resource metadata' });
    }
});

// Admin: Delete resource
router.delete('/resources/:id', authenticate, (req, res) => {
    if (resourceStore.delete(req.params.id)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Failed to delete resource' });
    }
});

module.exports = router;
