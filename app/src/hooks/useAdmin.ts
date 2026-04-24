import { useState, useCallback, useEffect } from 'react';
import type { 
  AdminSettings, 
  PackageFormData, 
  RoomFormData, 
  BookingStats, 
  RecentBooking,
  AdminUser,
  BookingEvent,
  AdminTab
} from '@/types/admin';
import { 
  defaultSettings, 
  mockBookingStats, 
  mockRecentBookings, 
  mockBookingEvents
} from '@/data/adminData';
import { packages as initialPackages, rooms as initialRooms } from '@/data/bookingData';
import type { Package, Room } from '@/types/booking';

// Helper to convert Package to PackageFormData
const packageToFormData = (pkg: Package): PackageFormData => ({
  id: pkg.id,
  name: pkg.name,
  description: pkg.description,
  price: pkg.price,
  duration: pkg.duration,
  features: pkg.features,
  icon: pkg.icon,
  popular: pkg.popular || false,
  active: true,
});

// Helper to convert Room to RoomFormData
const roomToFormData = (room: Room): RoomFormData => ({
  id: room.id,
  name: room.name,
  description: room.description,
  pricePerNight: room.pricePerNight,
  capacity: room.capacity,
  beds: room.beds,
  amenities: room.amenities,
  image: room.image,
  images: [room.image],
  available: room.available,
  active: true,
});

export function useAdmin() {
  // Current tab
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');

  // Current admin user (logged in)
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Settings
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);

  // Packages
  const [packages, setPackages] = useState<PackageFormData[]>(
    initialPackages.map(packageToFormData)
  );

  // Rooms
  const [rooms, setRooms] = useState<RoomFormData[]>(
    initialRooms.map(roomToFormData)
  );

  // Bookings
  const [bookings, setBookings] = useState<RecentBooking[]>(mockRecentBookings);
  const [bookingStats] = useState<BookingStats>(mockBookingStats);
  const [bookingEvents, setBookingEvents] = useState<BookingEvent[]>(mockBookingEvents);

  // Admin Users
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);

  // UI State
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageFormData | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomFormData | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('hostelSettings');
    const savedPackages = localStorage.getItem('hostelPackages');
    const savedRooms = localStorage.getItem('hostelRooms');
    const savedBookings = localStorage.getItem('hostelBookings');
    const savedBookingEvents = localStorage.getItem('hostelBookingEvents');
    const savedAdminUsers = localStorage.getItem('hostelAdminUsers');
    const savedCurrentAdmin = localStorage.getItem('hostelCurrentAdmin');

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    if (savedPackages) {
      try {
        setPackages(JSON.parse(savedPackages));
      } catch (e) {
        console.error('Failed to load packages:', e);
      }
    }
    if (savedRooms) {
      try {
        setRooms(JSON.parse(savedRooms));
      } catch (e) {
        console.error('Failed to load rooms:', e);
      }
    }
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        console.error('Failed to load bookings:', e);
      }
    }
    if (savedBookingEvents) {
      try {
        setBookingEvents(JSON.parse(savedBookingEvents));
      } catch (e) {
        console.error('Failed to load booking events:', e);
      }
    }
    if (savedAdminUsers) {
      try {
        setAdminUsers(JSON.parse(savedAdminUsers));
      } catch (e) {
        console.error('Failed to load admin users:', e);
      }
    }
    if (savedCurrentAdmin) {
      try {
        setCurrentAdmin(JSON.parse(savedCurrentAdmin));
      } catch (e) {
        console.error('Failed to load current admin:', e);
      }
    }

    // Check real auth
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const userData = await response.json();
          setCurrentAdmin(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('hostelSettings', JSON.stringify(settings));
    setHasUnsavedChanges(true);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('hostelPackages', JSON.stringify(packages));
    setHasUnsavedChanges(true);
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('hostelRooms', JSON.stringify(rooms));
    setHasUnsavedChanges(true);
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('hostelBookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('hostelBookingEvents', JSON.stringify(bookingEvents));
  }, [bookingEvents]);

  useEffect(() => {
    localStorage.setItem('hostelAdminUsers', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem('hostelCurrentAdmin', JSON.stringify(currentAdmin));
  }, [currentAdmin]);

  // Settings actions
  const updateSettings = useCallback((newSettings: Partial<AdminSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  // Package actions
  const createPackage = useCallback((pkg: PackageFormData) => {
    const newPackage = {
      ...pkg,
      id: `pkg_${Date.now()}`,
    };
    setPackages(prev => [...prev, newPackage]);
    setIsEditingPackage(false);
    setSelectedPackage(null);
  }, []);

  const updatePackage = useCallback((id: string, pkg: Partial<PackageFormData>) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, ...pkg } : p));
    setIsEditingPackage(false);
    setSelectedPackage(null);
  }, []);

  const deletePackage = useCallback((id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
  }, []);

  const duplicatePackage = useCallback((pkg: PackageFormData) => {
    const newPackage = {
      ...pkg,
      id: `pkg_${Date.now()}`,
      name: `${pkg.name} (Copy)`,
      popular: false,
    };
    setPackages(prev => [...prev, newPackage]);
  }, []);

  const startEditPackage = useCallback((pkg: PackageFormData) => {
    setSelectedPackage(pkg);
    setIsEditingPackage(true);
  }, []);

  const startCreatePackage = useCallback(() => {
    setSelectedPackage(null);
    setIsEditingPackage(true);
  }, []);

  const cancelEditPackage = useCallback(() => {
    setIsEditingPackage(false);
    setSelectedPackage(null);
  }, []);

  // Room actions
  const createRoom = useCallback((room: RoomFormData) => {
    const newRoom = {
      ...room,
      id: `room_${Date.now()}`,
    };
    setRooms(prev => [...prev, newRoom]);
    setIsEditingRoom(false);
    setSelectedRoom(null);
  }, []);

  const updateRoom = useCallback((id: string, room: Partial<RoomFormData>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...room } : r));
    setIsEditingRoom(false);
    setSelectedRoom(null);
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    setShowDeleteConfirm(null);
  }, []);

  const duplicateRoom = useCallback((room: RoomFormData) => {
    const newRoom = {
      ...room,
      id: `room_${Date.now()}`,
      name: `${room.name} (Copy)`,
    };
    setRooms(prev => [...prev, newRoom]);
  }, []);

  const startEditRoom = useCallback((room: RoomFormData) => {
    setSelectedRoom(room);
    setIsEditingRoom(true);
  }, []);

  const startCreateRoom = useCallback(() => {
    setSelectedRoom(null);
    setIsEditingRoom(true);
  }, []);

  const cancelEditRoom = useCallback(() => {
    setIsEditingRoom(false);
    setSelectedRoom(null);
  }, []);

  // Booking actions
  const updateBookingStatus = useCallback((id: string, status: RecentBooking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setBookingEvents(prev => prev.map(e => e.id === id ? { ...e, status: status as BookingEvent['status'] } : e));
  }, []);

  const addBookingNote = useCallback((id: string, note: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, notes: note } : b));
    setBookingEvents(prev => prev.map(e => e.id === id ? { ...e, notes: note } : e));
  }, []);

  const deleteBooking = useCallback((id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    setBookingEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  // Calendar/Booking Event actions
  const createBookingEvent = useCallback((event: Omit<BookingEvent, 'id' | 'createdAt'>) => {
    const newEvent: BookingEvent = {
      ...event,
      id: `EVT_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookingEvents(prev => [...prev, newEvent]);
  }, []);

  const updateBookingEvent = useCallback((id: string, event: Partial<BookingEvent>) => {
    setBookingEvents(prev => prev.map(e => e.id === id ? { ...e, ...event } : e));
  }, []);

  const deleteBookingEvent = useCallback((id: string) => {
    setBookingEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  // Admin User actions
  const createAdmin = useCallback((admin: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newAdmin: AdminUser = {
      ...admin,
      id: `admin_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLogin: '-',
    };
    setAdminUsers(prev => [...prev, newAdmin]);
    setIsEditingAdmin(false);
    setSelectedAdmin(null);
  }, []);

  const updateAdmin = useCallback((id: string, admin: Partial<AdminUser>) => {
    setAdminUsers(prev => prev.map(a => a.id === id ? { ...a, ...admin } : a));
    // Also update current admin if it's the same user
    if (currentAdmin.id === id) {
      setCurrentAdmin(prev => ({ ...prev, ...admin }));
    }
    setIsEditingAdmin(false);
    setSelectedAdmin(null);
  }, []);

  const deleteAdmin = useCallback((id: string) => {
    setAdminUsers(prev => prev.filter(a => a.id !== id));
    setShowDeleteConfirm(null);
  }, []);

  const updateCurrentAdmin = useCallback((admin: Partial<AdminUser>) => {
    if (!currentAdmin) return;
    setCurrentAdmin(prev => (prev ? { ...prev, ...admin } as AdminUser : null));
    // Also update in admin users list
    setAdminUsers(prev => prev.map(a => a.id === currentAdmin.id ? { ...a, ...admin } as AdminUser : a));
  }, [currentAdmin]);

  const startEditAdmin = useCallback((admin: AdminUser) => {
    setSelectedAdmin(admin);
    setIsEditingAdmin(true);
  }, []);

  const startCreateAdmin = useCallback(() => {
    setSelectedAdmin(null);
    setIsEditingAdmin(true);
  }, []);

  const cancelEditAdmin = useCallback(() => {
    setIsEditingAdmin(false);
    setSelectedAdmin(null);
  }, []);

  // Export/Import
  const exportData = useCallback(() => {
    const data = {
      settings,
      packages,
      rooms,
      bookings,
      bookingEvents,
      adminUsers,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hostel-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [settings, packages, rooms, bookings, bookingEvents, adminUsers]);

  const importData = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) setSettings(data.settings);
      if (data.packages) setPackages(data.packages);
      if (data.rooms) setRooms(data.rooms);
      if (data.bookings) setBookings(data.bookings);
      if (data.bookingEvents) setBookingEvents(data.bookingEvents);
      if (data.adminUsers) setAdminUsers(data.adminUsers);
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }, []);

  // Mark changes as saved
  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const login = useCallback((user: AdminUser) => {
    setCurrentAdmin(user);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setCurrentAdmin(null);
    setIsAuthenticated(false);
  }, []);

  // 2FA Actions
  const generate2FA = useCallback(async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/2fa/generate', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }, []);

  const enable2FA = useCallback(async (secret: string, token: string) => {
    const authToken = localStorage.getItem('token');
    const response = await fetch('/api/2fa/enable', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ secret, token })
    });
    const result = await response.json();
    if (response.ok) {
      setCurrentAdmin(prev => (prev ? { ...prev, twoFactorEnabled: true } as AdminUser : null));
    }
    return result;
  }, []);

  const disable2FA = useCallback(async (token: string) => {
    const authToken = localStorage.getItem('token');
    const response = await fetch('/api/2fa/disable', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    const result = await response.json();
    if (response.ok) {
      setCurrentAdmin(prev => (prev ? { ...prev, twoFactorEnabled: false } as AdminUser : null));
    }
    return result;
  }, []);

  return {
    // State
    currentTab,
    currentAdmin,
    isAuthenticated,
    isLoading,
    settings,
    packages,
    rooms,
    bookings,
    bookingEvents,
    bookingStats,
    adminUsers,
    isEditingPackage,
    isEditingRoom,
    isEditingAdmin,
    selectedPackage,
    selectedRoom,
    selectedAdmin,
    showDeleteConfirm,
    hasUnsavedChanges,

    // Actions
    setCurrentTab,
    setShowDeleteConfirm,
    login,
    logout,
    generate2FA,
    enable2FA,
    disable2FA,

    // Settings
    updateSettings,
    resetSettings,

    // Packages
    createPackage,
    updatePackage,
    deletePackage,
    duplicatePackage,
    startEditPackage,
    startCreatePackage,
    cancelEditPackage,

    // Rooms
    createRoom,
    updateRoom,
    deleteRoom,
    duplicateRoom,
    startEditRoom,
    startCreateRoom,
    cancelEditRoom,

    // Bookings
    updateBookingStatus,
    addBookingNote,
    deleteBooking,

    // Calendar/Events
    createBookingEvent,
    updateBookingEvent,
    deleteBookingEvent,

    // Admin Users
    createAdmin,
    updateAdmin,
    deleteAdmin,
    updateCurrentAdmin,
    startEditAdmin,
    startCreateAdmin,
    cancelEditAdmin,

    // Export/Import
    exportData,
    importData,
    markAsSaved,
  };
}
