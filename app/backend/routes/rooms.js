const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            where: { active: true }
        });

        const parsedRooms = rooms.map(room => ({
            ...room,
            amenities: JSON.parse(room.amenities)
        }));

        res.json(parsedRooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// GET query rooms (for filtering if needed) or single room
router.get('/:id', async (req, res) => {
    try {
        const room = await prisma.room.findUnique({
            where: { id: req.params.id }
        });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({
            ...room,
            amenities: JSON.parse(room.amenities)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room' });
    }
});

// CREATE room
router.post('/', async (req, res) => {
    try {
        const { amenities, ...data } = req.body;
        const room = await prisma.room.create({
            data: {
                ...data,
                amenities: JSON.stringify(amenities)
            }
        });
        res.json({
            ...room,
            amenities: JSON.parse(room.amenities)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create room' });
    }
});

// UPDATE room
router.put('/:id', async (req, res) => {
    try {
        const { amenities, ...data } = req.body;
        const updateData = { ...data };

        if (amenities) {
            updateData.amenities = JSON.stringify(amenities);
        }

        const room = await prisma.room.update({
            where: { id: req.params.id },
            data: updateData
        });

        res.json({
            ...room,
            amenities: JSON.parse(room.amenities)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update room' });
    }
});

// DELETE room (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        await prisma.room.update({
            where: { id: req.params.id },
            data: { active: false }
        });
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete room' });
    }
});

module.exports = router;
