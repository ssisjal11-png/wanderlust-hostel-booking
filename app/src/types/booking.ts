export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  beds: string;
  amenities: string[];
  image: string;
  available: boolean;
}

export interface BookingData {
  selectedPackage: Package | null;
  selectedRoom: Room | null;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  guestCount: number;
  guestInfo: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests: string;
  };
}

export type BookingStep = 'package' | 'rooms' | 'date' | 'summary';

export interface StepConfig {
  id: BookingStep;
  label: string;
  description: string;
  icon: string;
}
