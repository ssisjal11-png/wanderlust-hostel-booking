// Admin types for dashboard management

export interface AdminSettings {
  // Basic Info
  hostelName: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  favicon: string;
  
  // Colors & Branding
  primaryColor: string;
  accentColor: string;
  darkMode: boolean;
  currency: string;
  timezone: string;
  
  // Stay Controls
  minStayNights: number;
  maxStayNights: number;
  checkInTime: string;
  checkOutTime: string;
  
  // Guest Controls
  minGuests: number;
  maxGuests: number;
  maxGuestsPerRoom: number;
  allowChildren: boolean;
  allowPets: boolean;
  petFee: number;
  
  // Policies
  cancellationPolicy: string;
  termsAndConditions: string;
  privacyPolicy: string;
  houseRules: string;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  customHeaderScript: string;
  customFooterScript: string;
  
  // Notifications
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  bookingConfirmationTemplate: string;
  bookingReminderTemplate: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'superadmin' | 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive' | 'suspended';
  phone: string;
  department: string;
  permissions: AdminPermissions;
  lastLogin: string;
  createdAt: string;
  twoFactorEnabled: boolean;
}

export interface AdminPermissions {
  dashboard: boolean;
  packages: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  rooms: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  bookings: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    confirm: boolean;
    cancel: boolean;
  };
  calendar: {
    view: boolean;
    edit: boolean;
  };
  settings: {
    view: boolean;
    edit: boolean;
  };
  admins: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  reports: boolean;
}

export interface PackageFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  icon: string;
  popular: boolean;
  active: boolean;
  minNights?: number;
  maxNights?: number;
}

export interface RoomFormData {
  id?: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  beds: string;
  amenities: string[];
  image: string;
  images: string[];
  available: boolean;
  active: boolean;
  roomNumber?: string;
  floor?: string;
  size?: string;
  view?: string;
}

export interface BookingEvent {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  color: string;
  notes?: string;
  createdAt: string;
}

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  checkedInBookings: number;
  checkedOutBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  occupancyRate: number;
  popularPackage: string;
  popularRoom: string;
}

export interface RecentBooking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  packageName: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export type AdminTab = 
  | 'dashboard' 
  | 'packages' 
  | 'rooms' 
  | 'bookings' 
  | 'calendar'
  | 'admins'
  | 'profile'
  | 'settings' 
  | 'preview';

export const AVAILABLE_ICONS = [
  { value: 'Backpack', label: 'Backpack' },
  { value: 'BedDouble', label: 'Bed Double' },
  { value: 'Crown', label: 'Crown' },
  { value: 'Users', label: 'Users' },
  { value: 'Star', label: 'Star' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Gem', label: 'Gem' },
  { value: 'Sparkles', label: 'Sparkles' },
  { value: 'Zap', label: 'Zap' },
  { value: 'Sun', label: 'Sun' },
  { value: 'Moon', label: 'Moon' },
  { value: 'Coffee', label: 'Coffee' },
  { value: 'Wifi', label: 'WiFi' },
  { value: 'Tv', label: 'TV' },
  { value: 'Car', label: 'Car' },
  { value: 'Umbrella', label: 'Umbrella' },
];

export const AVAILABLE_AMENITIES = [
  'AC',
  'Wi-Fi',
  'Premium Wi-Fi',
  'TV',
  'Smart TV',
  'Netflix',
  'Private Bath',
  'Ensuite Bath',
  'Mini Fridge',
  'Microwave',
  'Coffee Maker',
  'Balcony',
  'Terrace',
  'Safe',
  'Lockers',
  'Reading Light',
  'Blackout Curtains',
  'Hair Dryer',
  'Iron',
  'Mirror',
  'Desk',
  'Work Desk',
  'Wardrobe',
  'Closet',
  'Kitchenette',
  'Full Kitchen',
  'Breakfast',
  'Room Service',
  'Gym Access',
  'Pool Access',
  'Spa Access',
  'Parking',
  'Free Parking',
  'Laundry',
  'Dry Cleaning',
  'Airport Shuttle',
  'City View',
  'Garden View',
  'Ocean View',
  'Mountain View',
];

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'IDR', label: 'Indonesian Rupiah (Rp)', symbol: 'Rp' },
  { value: 'SGD', label: 'Singapore Dollar (S$)', symbol: 'S$' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
  { value: 'CNY', label: 'Chinese Yuan (¥)', symbol: '¥' },
  { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
  { value: 'THB', label: 'Thai Baht (฿)', symbol: '฿' },
  { value: 'MYR', label: 'Malaysian Ringgit (RM)', symbol: 'RM' },
  { value: 'PHP', label: 'Philippine Peso (₱)', symbol: '₱' },
  { value: 'VND', label: 'Vietnamese Dong (₫)', symbol: '₫' },
];

export const ADMIN_ROLES = [
  { value: 'superadmin', label: 'Super Admin', description: 'Full access to all features' },
  { value: 'admin', label: 'Admin', description: 'Can manage most features except other admins' },
  { value: 'manager', label: 'Manager', description: 'Can manage bookings, packages, and rooms' },
  { value: 'staff', label: 'Staff', description: 'View-only access with limited editing' },
];

export const DEPARTMENTS = [
  { value: 'management', label: 'Management' },
  { value: 'frontdesk', label: 'Front Desk' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'accounting', label: 'Accounting' },
];
