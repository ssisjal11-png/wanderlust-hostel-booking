import type { Package, Room } from '@/types/booking';

export const packages: Package[] = [
  {
    id: 'backpacker',
    name: 'Backpacker Basic',
    description: 'Perfect for solo travelers on a budget. Includes bed in a shared dormitory.',
    price: 15,
    duration: 'per night',
    features: [
      'Shared dormitory (4-6 beds)',
      'Free Wi-Fi',
      'Shared bathroom',
      'Lockers included',
      'Common kitchen access',
      'Free city map'
    ],
    icon: 'Backpack'
  },
  {
    id: 'comfort',
    name: 'Comfort Stay',
    description: 'Ideal for travelers seeking more privacy and comfort during their stay.',
    price: 35,
    duration: 'per night',
    features: [
      'Private room with shared bath',
      'Free Wi-Fi & Netflix',
      'Air conditioning',
      'Daily housekeeping',
      'Breakfast included',
      'Late checkout available'
    ],
    icon: 'BedDouble',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Experience',
    description: 'The ultimate hostel experience with premium amenities and services.',
    price: 65,
    duration: 'per night',
    features: [
      'Ensuite private room',
      'Premium Wi-Fi & Smart TV',
      'Mini fridge & safe',
      'Complimentary breakfast',
      'Airport pickup included',
      'Priority booking for tours'
    ],
    icon: 'Crown'
  },
  {
    id: 'group',
    name: 'Group Adventure',
    description: 'Special package for groups of 4 or more. Great for friends traveling together.',
    price: 45,
    duration: 'per person/night',
    features: [
      'Private group room',
      'Dedicated bathroom',
      'Group dining area',
      'Free group activities',
      'Discounted tours',
      'Welcome drink included'
    ],
    icon: 'Users'
  }
];

export const rooms: Room[] = [
  {
    id: 'dorm-4',
    name: '4-Bed Mixed Dorm',
    description: 'Cozy dormitory with 4 bunk beds, perfect for meeting fellow travelers.',
    pricePerNight: 15,
    capacity: 4,
    beds: '4 Bunk Beds',
    amenities: ['AC', 'Wi-Fi', 'Lockers', 'Reading Light', 'Curtains'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
    available: true
  },
  {
    id: 'dorm-6',
    name: '6-Bed Female Dorm',
    description: 'Female-only dormitory with 6 comfortable bunk beds.',
    pricePerNight: 14,
    capacity: 6,
    beds: '6 Bunk Beds',
    amenities: ['AC', 'Wi-Fi', 'Lockers', 'Hair Dryer', 'Mirror'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
    available: true
  },
  {
    id: 'private-twin',
    name: 'Private Twin Room',
    description: 'Private room with two single beds, ideal for friends traveling together.',
    pricePerNight: 35,
    capacity: 2,
    beds: '2 Single Beds',
    amenities: ['AC', 'Wi-Fi', 'TV', 'Desk', 'Wardrobe'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
    available: true
  },
  {
    id: 'private-double',
    name: 'Double Room with Bath',
    description: 'Comfortable double bed with private bathroom.',
    pricePerNight: 45,
    capacity: 2,
    beds: '1 Queen Bed',
    amenities: ['AC', 'Wi-Fi', 'TV', 'Private Bath', 'Mini Fridge'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
    available: true
  },
  {
    id: 'family-room',
    name: 'Family Room',
    description: 'Spacious room perfect for families with children.',
    pricePerNight: 75,
    capacity: 4,
    beds: '1 Queen + 2 Single',
    amenities: ['AC', 'Wi-Fi', 'TV', 'Private Bath', 'Kitchenette'],
    image: 'https://images.unsplash.com/photo-1598928506311-c55ez59c4ede?w=400&h=300&fit=crop',
    available: true
  },
  {
    id: 'deluxe-suite',
    name: 'Deluxe Suite',
    description: 'Premium suite with all amenities for a luxurious stay.',
    pricePerNight: 85,
    capacity: 2,
    beds: '1 King Bed',
    amenities: ['AC', 'Premium Wi-Fi', 'Smart TV', 'Ensuite Bath', 'Balcony', 'Safe'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
    available: true
  }
];

export const stepConfig = [
  {
    id: 'package' as const,
    label: 'Select Package',
    description: 'Choose your stay package',
    icon: 'Package'
  },
  {
    id: 'rooms' as const,
    label: 'Choose Room',
    description: 'Pick your perfect room',
    icon: 'Bed'
  },
  {
    id: 'date' as const,
    label: 'Set Dates',
    description: 'When will you stay?',
    icon: 'Calendar'
  },
  {
    id: 'summary' as const,
    label: 'Review & Book',
    description: 'Confirm your reservation',
    icon: 'CheckCircle'
  }
];
