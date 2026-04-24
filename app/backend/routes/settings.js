const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET settings
router.get('/', async (req, res) => {
    try {
        const settings = await prisma.adminSettings.findUnique({
            where: { id: 1 }
        });

        if (!settings) {
            return res.status(404).json({ error: 'Settings not found' });
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// UPDATE settings
router.put('/', async (req, res) => {
    try {
        const settings = await prisma.adminSettings.update({
            where: { id: 1 },
            data: req.body
        });

        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

module.exports = router;
