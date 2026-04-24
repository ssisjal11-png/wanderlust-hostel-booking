const express = require('express');
const router = express.Router();
const prisma = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await prisma.adminUser.findUnique({
            where: { email }
        });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (admin.status !== 'active') {
            return res.status(403).json({ error: 'Account is not active' });
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await prisma.adminUser.update({
            where: { id: admin.id },
            data: { lastLogin: new Date() }
        });

        if (admin.twoFactorEnabled) {
            return res.json({
                require2FA: true,
                userId: admin.id
            });
        }

        const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, {
            expiresIn: '24h'
        });

        const { password: _, twoFactorSecret: __, ...adminData } = admin;

        res.json({
            token,
            user: adminData
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await prisma.adminUser.findUnique({
            where: { id: decoded.id }
        });

        if (!admin) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...adminData } = admin;
        res.json(adminData);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
