import { useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { PackageStep } from '@/components/steps/PackageStep';
import { RoomStep } from '@/components/steps/RoomStep';
import { DateStep } from '@/components/steps/DateStep';
import { SummaryStep } from '@/components/steps/SummaryStep';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useBooking } from '@/hooks/useBooking';
import type { BookingStep } from '@/types/booking';

// WhatsApp phone number (replace with actual hostel number)
const HOSTEL_WHATSAPP_NUMBER = '15551234567'; // Format: country code + number without +

function BookingForm() {
  const {
    currentStep,
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
  } = useBooking();

  const handleGoToStep = useCallback((step: BookingStep) => {
    goToStep(step);
  }, [goToStep]);

  const handleNextStep = useCallback(() => {
    if (canProceedToNext()) {
      nextStep();
    } else {
      toast.error('Please complete this step before continuing');
    }
  }, [canProceedToNext, nextStep]);

  const handleSendToWhatsApp = useCallback(() => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${HOSTEL_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast.success('Opening WhatsApp...', {
      description: 'Your reservation details have been prepared. Please send the message to confirm your booking.',
      duration: 5000
    });
  }, [generateWhatsAppMessage]);

  const renderStep = () => {
    switch (currentStep) {
      case 'package':
        return (
          <PackageStep
            selectedPackage={bookingData.selectedPackage}
            onSelectPackage={selectPackage}
            onNext={handleNextStep}
          />
        );
      case 'rooms':
        return (
          <RoomStep
            selectedRoom={bookingData.selectedRoom}
            onSelectRoom={selectRoom}
            onNext={handleNextStep}
            onBack={prevStep}
          />
        );
      case 'date':
        return (
          <DateStep
            checkInDate={bookingData.checkInDate}
            checkOutDate={bookingData.checkOutDate}
            guestCount={bookingData.guestCount}
            onSetDates={setDates}
            onSetGuestCount={setGuestCount}
            onNext={handleNextStep}
            onBack={prevStep}
            roomPricePerNight={bookingData.selectedRoom?.pricePerNight || 0}
          />
        );
      case 'summary':
        return (
          <SummaryStep
            bookingData={bookingData}
            onSetGuestInfo={setGuestInfo}
            onGoToStep={handleGoToStep}
            onSubmit={handleSendToWhatsApp}
            calculateTotalPrice={calculateTotalPrice}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <Sidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleGoToStep}
      />

      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">W</span>
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">
                  Wanderlust Hostel
                </h1>
                <p className="text-xs text-muted-foreground">Reservation Booking</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl shadow-soft p-6 lg:p-10 min-h-[600px]">
            {renderStep()}
          </div>

          <footer className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Wanderlust Hostel & Suites. All rights reserved.</p>
            <p className="mt-1">Secure booking powered by WhatsApp Business</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif'
          }
        }}
      />
      <Routes>
        <Route path="/" element={<BookingForm />} />
        {/* Hidden Admin Route */}
        <Route path="/management-portal-secure-2024" element={<AdminDashboard />} />
        {/* Redirect any unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
