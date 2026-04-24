const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');
const packagesRoutes = require('./routes/packages');
const roomsRoutes = require('./routes/rooms');
const bookingsRoutes = require('./routes/bookings');
const dashboardRoutes = require('./routes/dashboard');
const twoFactorRoutes = require('./routes/2fa');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/2fa', twoFactorRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Dormitory Reservation System API is running');
});

// Vercel export
module.exports = app;

// Start server if not running on Vercel
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
