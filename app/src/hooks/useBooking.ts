import { useState, useCallback } from 'react';
import type { BookingData, BookingStep, Package, Room } from '@/types/booking';

const initialBookingData: BookingData = {
  selectedPackage: null,
  selectedRoom: null,
  checkInDate: null,
  checkOutDate: null,
  guestCount: 1,
  guestInfo: {
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  }
};

const steps: BookingStep[] = ['package', 'rooms', 'date', 'summary'];

export function useBooking() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('package');
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [completedSteps, setCompletedSteps] = useState<Set<BookingStep>>(new Set());

  const currentStepIndex = steps.indexOf(currentStep);

  const goToStep = useCallback((step: BookingStep) => {
    const targetIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStep);
    
    // Only allow going to completed steps or the next available step
    if (targetIndex <= currentIndex || completedSteps.has(steps[targetIndex - 1])) {
      setCurrentStep(step);
    }
  }, [currentStep, completedSteps]);

  const nextStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  const selectPackage = useCallback((pkg: Package) => {
    setBookingData(prev => ({ ...prev, selectedPackage: pkg }));
  }, []);

  const selectRoom = useCallback((room: Room) => {
    setBookingData(prev => ({ ...prev, selectedRoom: room }));
  }, []);

  const setDates = useCallback((checkIn: Date | null, checkOut: Date | null) => {
    setBookingData(prev => ({ ...prev, checkInDate: checkIn, checkOutDate: checkOut }));
  }, []);

  const setGuestCount = useCallback((count: number) => {
    setBookingData(prev => ({ ...prev, guestCount: count }));
  }, []);

  const setGuestInfo = useCallback((info: Partial<BookingData['guestInfo']>) => {
    setBookingData(prev => ({ 
      ...prev, 
      guestInfo: { ...prev.guestInfo, ...info } 
    }));
  }, []);

  const canProceedToNext = useCallback(() => {
    switch (currentStep) {
      case 'package':
        return bookingData.selectedPackage !== null;
      case 'rooms':
        return bookingData.selectedRoom !== null;
      case 'date':
        return bookingData.checkInDate !== null && bookingData.checkOutDate !== null;
      case 'summary':
        return (
          bookingData.guestInfo.fullName.trim() !== '' &&
          bookingData.guestInfo.email.trim() !== '' &&
          bookingData.guestInfo.phone.trim() !== ''
        );
      default:
        return false;
    }
  }, [currentStep, bookingData]);

  const calculateTotalPrice = useCallback(() => {
    if (!bookingData.selectedRoom || !bookingData.checkInDate || !bookingData.checkOutDate) {
      return 0;
    }
    const nights = Math.ceil(
      (bookingData.checkOutDate.getTime() - bookingData.checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return bookingData.selectedRoom.pricePerNight * nights * bookingData.guestCount;
  }, [bookingData]);

  const generateWhatsAppMessage = useCallback(() => {
    const { selectedPackage, selectedRoom, checkInDate, checkOutDate, guestCount, guestInfo } = bookingData;
    const totalPrice = calculateTotalPrice();
    
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });

    return `🏨 *New Hostel Reservation Request*

*Guest Information:*
👤 Name: ${guestInfo.fullName}
📧 Email: ${guestInfo.email}
📱 Phone: ${guestInfo.phone}

*Booking Details:*
📦 Package: ${selectedPackage?.name}
🛏️ Room: ${selectedRoom?.name}
👥 Guests: ${guestCount}
📅 Check-in: ${checkInDate ? formatDate(checkInDate) : 'N/A'}
📅 Check-out: ${checkOutDate ? formatDate(checkOutDate) : 'N/A'}
💰 Total: $${totalPrice}

${guestInfo.specialRequests ? `*Special Requests:*\n${guestInfo.specialRequests}` : ''}

Please confirm this reservation. Thank you!`;
  }, [bookingData, calculateTotalPrice]);

  const resetBooking = useCallback(() => {
    setBookingData(initialBookingData);
    setCurrentStep('package');
    setCompletedSteps(new Set());
  }, []);

  return {
    currentStep,
    currentStepIndex,
    bookingData,
    completedSteps,
    goToStep,
    nextStep,
    prevStep,
    selectPackage,
    selectRoom,
    setDates,
    setGuestCount,
    setGuestInfo,
    canProceedToNext,
    calculateTotalPrice,
    generateWhatsAppMessage,
    resetBooking
  };
}
