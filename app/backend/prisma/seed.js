const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    console.log('Start seeding ...');

    // Seed Admin Settings
    const settings = await prisma.adminSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            hostelName: 'Wanderlust Hostel',
            tagline: 'Your Home Away From Home',
            description: 'Experience comfort and community at Wanderlust Hostel. We offer affordable accommodation for travelers from around the world.',
            whatsappNumber: '15551234567',
            email: 'booking@wanderlust.com',
            phone: '+1 (555) 123-4567',
            address: '123 Traveler Street, Adventure City, AC 12345',
            primaryColor: '#d97706',
            accentColor: '#059669',
            darkMode: false,
            currency: 'USD',
            timezone: 'America/New_York',
            minStayNights: 1,
            maxStayNights: 30,
            checkInTime: '14:00',
            checkOutTime: '11:00',
            minGuests: 1,
            maxGuests: 10,
            maxGuestsPerRoom: 6,
            allowChildren: true,
            allowPets: false,
            petFee: 25,
            cancellationPolicy: 'Free cancellation up to 24 hours before check-in. Cancellations made less than 24 hours before check-in will be charged the first night. No-shows will be charged the full amount.',
            termsAndConditions: 'By making a reservation, you agree to our terms and conditions. Check-in time is 2:00 PM and check-out time is 11:00 AM. Guests must provide valid identification at check-in.',
            privacyPolicy: 'We respect your privacy and protect your personal information. Your data is only used for booking purposes and will never be shared with third parties without your consent.',
            houseRules: 'Quiet hours from 10:00 PM to 7:00 AM. No smoking inside the building. Please respect other guests and keep common areas clean.',
            emailNotifications: true,
            whatsappNotifications: true
        },
    });

    // Seed Packages
    const packages = [
        {
            id: 'backpacker',
            name: 'Backpacker Basic',
            description: 'Perfect for solo travelers on a budget. Includes bed in a shared dormitory.',
            price: 15,
            duration: 'per night',
            features: JSON.stringify([
                'Shared dormitory (4-6 beds)',
                'Free Wi-Fi',
                'Shared bathroom',
                'Lockers included',
                'Common kitchen access',
                'Free city map'
            ]),
            icon: 'Backpack',
            popular: false,
            active: true
        },
        {
            id: 'comfort',
            name: 'Comfort Stay',
            description: 'Ideal for travelers seeking more privacy and comfort during their stay.',
            price: 35,
            duration: 'per night',
            features: JSON.stringify([
                'Private room with shared bath',
                'Free Wi-Fi & Netflix',
                'Air conditioning',
                'Daily housekeeping',
                'Breakfast included',
                'Late checkout available'
            ]),
            icon: 'BedDouble',
            popular: true,
            active: true
        },
        {
            id: 'premium',
            name: 'Premium Experience',
            description: 'The ultimate hostel experience with premium amenities and services.',
            price: 65,
            duration: 'per night',
            features: JSON.stringify([
                'Ensuite private room',
                'Premium Wi-Fi & Smart TV',
                'Mini fridge & safe',
                'Complimentary breakfast',
                'Airport pickup included',
                'Priority booking for tours'
            ]),
            icon: 'Crown',
            popular: false,
            active: true
        },
        {
            id: 'group',
            name: 'Group Adventure',
            description: 'Special package for groups of 4 or more. Great for friends traveling together.',
            price: 45,
            duration: 'per person/night',
            features: JSON.stringify([
                'Private group room',
                'Dedicated bathroom',
                'Group dining area',
                'Free group activities',
                'Discounted tours',
                'Welcome drink included'
            ]),
            icon: 'Users',
            popular: false,
            active: true
        }
    ];

    for (const pkg of packages) {
        await prisma.package.upsert({
            where: { id: pkg.id },
            update: {},
            create: pkg
        });
    }

    // Seed Rooms
    const rooms = [
        {
            id: 'dorm-4',
            name: '4-Bed Mixed Dorm',
            description: 'Cozy dormitory with 4 bunk beds, perfect for meeting fellow travelers.',
            pricePerNight: 15,
            capacity: 4,
            beds: '4 Bunk Beds',
            amenities: JSON.stringify(['AC', 'Wi-Fi', 'Lockers', 'Reading Light', 'Curtains']),
            image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
            available: true,
            active: true
        },
        {
            id: 'dorm-6',
            name: '6-Bed Female Dorm',
            description: 'Female-only dormitory with 6 comfortable bunk beds.',
            pricePerNight: 14,
            capacity: 6,
            beds: '6 Bunk Beds',
            amenities: JSON.stringify(['AC', 'Wi-Fi', 'Lockers', 'Hair Dryer', 'Mirror']),
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
            available: true,
            active: true
        },
        {
            id: 'private-twin',
            name: 'Private Twin Room',
            description: 'Private room with two single beds, ideal for friends traveling together.',
            pricePerNight: 35,
            capacity: 2,
            beds: '2 Single Beds',
            amenities: JSON.stringify(['AC', 'Wi-Fi', 'TV', 'Desk', 'Wardrobe']),
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
            available: true,
            active: true
        },
        {
            id: 'private-double',
            name: 'Double Room with Bath',
            description: 'Comfortable double bed with private bathroom.',
            pricePerNight: 45,
            capacity: 2,
            beds: '1 Queen Bed',
            amenities: JSON.stringify(['AC', 'Wi-Fi', 'TV', 'Private Bath', 'Mini Fridge']),
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
            available: true,
            active: true
        },
        {
            id: 'family-room',
            name: 'Family Room',
            description: 'Spacious room perfect for families with children.',
            pricePerNight: 75,
            capacity: 4,
            beds: '1 Queen + 2 Single',
            amenities: JSON.stringify(['AC', 'Wi-Fi', 'TV', 'Private Bath', 'Kitchenette']),
            image: 'https://images.unsplash.com/photo-1598928506311-c55ez59c4ede?w=400&h=300&fit=crop',
            available: true,
            active: true
        },
        {
            id: 'deluxe-suite',
            name: 'Deluxe Suite',
            description: 'Premium suite with all amenities for a luxurious stay.',
            pricePerNight: 85,
            capacity: 2,
            beds: '1 King Bed',
            amenities: JSON.stringify(['AC', 'Premium Wi-Fi', 'Smart TV', 'Ensuite Bath', 'Balcony', 'Safe']),
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
            available: true,
            active: true
        }
    ];

    for (const room of rooms) {
        await prisma.room.upsert({
            where: { id: room.id },
            update: {},
            create: room
        });
    }

    // Seed Admin User
    // Default password: password123
    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.adminUser.upsert({
        where: { email: 'admin@wanderlust.com' },
        update: {},
        create: {
            id: 'admin_1',
            name: 'Super Admin',
            email: 'admin@wanderlust.com',
            password: hashedPassword,
            role: 'superadmin',
            status: 'active',
            department: 'management',
            twoFactorEnabled: false
        }
    });

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
