const express = require('express');
const router = express.Router();
const prisma = require('../db');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Generate 2FA Secret and QR Code
router.post('/generate', authenticateToken, async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({
            name: `Wanderlust Hostel Admin (${req.user.email})`
        });

        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

        res.json({
            secret: secret.base32,
            qrCode: qrCodeUrl
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate 2FA secret' });
    }
});

// Enable 2FA
router.post('/enable', authenticateToken, async (req, res) => {
    try {
        const { secret, token } = req.body;

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            await prisma.adminUser.update({
                where: { id: req.user.id },
                data: {
                    twoFactorEnabled: true,
                    twoFactorSecret: secret
                }
            });
            res.json({ success: true, message: '2FA enabled successfully' });
        } else {
            res.status(400).json({ error: 'Invalid verification code' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to enable 2FA' });
    }
});

// Disable 2FA
router.post('/disable', authenticateToken, async (req, res) => {
    try {
        const { token } = req.body;
        const admin = await prisma.adminUser.findUnique({
            where: { id: req.user.id }
        });

        const verified = speakeasy.totp.verify({
            secret: admin.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            await prisma.adminUser.update({
                where: { id: req.user.id },
                data: {
                    twoFactorEnabled: false,
                    twoFactorSecret: null
                }
            });
            res.json({ success: true, message: '2FA disabled successfully' });
        } else {
            res.status(400).json({ error: 'Invalid verification code' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to disable 2FA' });
    }
});

// Verify 2FA during Login (Step 2)
router.post('/verify-login', async (req, res) => {
    try {
        const { userId, token } = req.body;

        const admin = await prisma.adminUser.findUnique({
            where: { id: userId }
        });

        if (!admin || !admin.twoFactorEnabled) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const verified = speakeasy.totp.verify({
            secret: admin.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            const authToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, {
                expiresIn: '24h'
            });

            const { password: _, twoFactorSecret: __, ...adminData } = admin;

            res.json({
                token: authToken,
                user: adminData
            });
        } else {
            res.status(401).json({ error: 'Invalid 2FA code' });
        }
    } catch (error) {
        res.status(500).json({ error: '2FA verification failed' });
    }
});

module.exports = router;
