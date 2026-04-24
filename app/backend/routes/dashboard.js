const express = require('express');
const router = express.Router();
const prisma = require('../db');

router.get('/stats', async (req, res) => {
    try {
        const [
            totalBookings,
            pendingBookings,
            confirmedBookings,
            checkedInBookings,
            checkedOutBookings,
            cancelledBookings,
            revenue
        ] = await Promise.all([
            prisma.booking.count(),
            prisma.booking.count({ where: { status: 'pending' } }),
            prisma.booking.count({ where: { status: 'confirmed' } }),
            prisma.booking.count({ where: { status: 'checked-in' } }),
            prisma.booking.count({ where: { status: 'checked-out' } }),
            prisma.booking.count({ where: { status: 'cancelled' } }),
            prisma.booking.aggregate({
                _sum: { totalAmount: true },
                where: { status: { not: 'cancelled' } }
            })
        ]);

        // Calculate occupancy rate (simplified)
        // In a real app this would be more complex based on date ranges
        const totalRooms = await prisma.room.count({ where: { active: true } });
        const occupancyRate = totalRooms > 0 ? (checkedInBookings / totalRooms) * 100 : 0;

        res.json({
            totalBookings,
            pendingBookings,
            confirmedBookings,
            checkedInBookings,
            checkedOutBookings,
            cancelledBookings,
            totalRevenue: revenue._sum.totalAmount || 0,
            averageBookingValue: totalBookings > 0 ? (revenue._sum.totalAmount || 0) / totalBookings : 0,
            occupancyRate,
            popularPackage: 'Comfort Stay', // Placeholder, requires complex query
            popularRoom: 'Private Double Room' // Placeholder
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

router.get('/recent', async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                package: true,
                room: true
            }
        });

        // Transform to match dashboard expected format
        const transformedBookings = bookings.map(b => ({
            id: b.id,
            guestName: b.guestName,
            guestEmail: b.guestEmail,
            guestPhone: b.guestPhone,
            packageName: b.package?.name,
            roomName: b.room?.name,
            checkInDate: b.checkInDate,
            checkOutDate: b.checkOutDate,
            guestCount: b.guestCount,
            totalAmount: b.totalAmount,
            status: b.status,
            createdAt: b.createdAt,
            notes: b.notes
        }));

        res.json(transformedBookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent bookings' });
    }
});

module.exports = router;
