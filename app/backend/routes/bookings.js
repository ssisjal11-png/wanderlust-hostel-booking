const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all bookings (with filtering)
router.get('/', async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                package: true,
                room: true
            }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// CREATE booking
router.post('/', async (req, res) => {
    try {
        const booking = await prisma.booking.create({
            data: req.body
        });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// UPDATE booking status
router.put('/:id', async (req, res) => {
    try {
        const booking = await prisma.booking.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

module.exports = router;
