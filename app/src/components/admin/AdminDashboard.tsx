import { Toaster, toast } from 'sonner';
import { AdminSidebar } from './AdminSidebar';
import { DashboardStats } from './DashboardStats';
import { PackageManager } from './PackageManager';
import { RoomManager } from './RoomManager';
import { BookingsManager } from './BookingsManager';
import { CalendarTimeline } from './CalendarTimeline';
import { AdminManager } from './AdminManager';
import { AdminProfile } from './AdminProfile';
import { SettingsManager } from './SettingsManager';
import { PreviewManager } from './PreviewManager';
import { Login } from './Login';
import { useAdmin } from '@/hooks/useAdmin';
import type { AdminTab } from '@/types/admin';
import { Loader2 } from 'lucide-react';

export function AdminDashboard() {
  const {
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
  } = useAdmin();

  const handleSave = () => {
    markAsSaved();
    toast.success('Changes saved successfully!');
  };

  const handleExport = () => {
    exportData();
    toast.success('Data exported successfully!');
  };

  const handleImport = (data: string) => {
    const success = importData(data);
    if (success) {
      toast.success('Data imported successfully!');
      return true;
    } else {
      toast.error('Failed to import data. Please check the file format.');
      return false;
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardStats stats={bookingStats} />;
      case 'packages':
        return (
          <PackageManager
            packages={packages}
            isEditing={isEditingPackage}
            selectedPackage={selectedPackage}
            showDeleteConfirm={showDeleteConfirm}
            onCreate={createPackage}
            onUpdate={updatePackage}
            onDelete={deletePackage}
            onDuplicate={duplicatePackage}
            onStartEdit={startEditPackage}
            onStartCreate={startCreatePackage}
            onCancelEdit={cancelEditPackage}
            onSetDeleteConfirm={setShowDeleteConfirm}
          />
        );
      case 'rooms':
        return (
          <RoomManager
            rooms={rooms}
            isEditing={isEditingRoom}
            selectedRoom={selectedRoom}
            showDeleteConfirm={showDeleteConfirm}
            onCreate={createRoom}
            onUpdate={updateRoom}
            onDelete={deleteRoom}
            onDuplicate={duplicateRoom}
            onStartEdit={startEditRoom}
            onStartCreate={startCreateRoom}
            onCancelEdit={cancelEditRoom}
            onSetDeleteConfirm={setShowDeleteConfirm}
          />
        );
      case 'bookings':
        return (
          <BookingsManager
            bookings={bookings}
            onUpdateStatus={updateBookingStatus}
            onAddNote={addBookingNote}
            onDelete={deleteBooking}
          />
        );
      case 'calendar':
        return (
          <CalendarTimeline
            rooms={rooms}
            events={bookingEvents}
            onUpdateEvent={updateBookingEvent}
            onDeleteEvent={deleteBookingEvent}
          />
        );
      case 'admins':
        return (
          <AdminManager
            admins={adminUsers}
            currentAdmin={currentAdmin!}
            isEditing={isEditingAdmin}
            selectedAdmin={selectedAdmin}
            showDeleteConfirm={showDeleteConfirm}
            onCreate={createAdmin}
            onUpdate={updateAdmin}
            onDelete={deleteAdmin}
            onStartEdit={startEditAdmin}
            onStartCreate={startCreateAdmin}
            onCancelEdit={cancelEditAdmin}
            onSetDeleteConfirm={setShowDeleteConfirm}
          />
        );
      case 'profile':
        return (
          <AdminProfile
            admin={currentAdmin!}
            onUpdate={updateCurrentAdmin}
            generate2FA={generate2FA}
            enable2FA={enable2FA}
            disable2FA={disable2FA}
          />
        );
      case 'settings':
        return (
          <SettingsManager
            settings={settings}
            onUpdate={updateSettings}
            onReset={resetSettings}
            onExport={handleExport}
            onImport={handleImport}
          />
        );
      case 'preview':
        return (
          <PreviewManager
            settings={settings}
            packages={packages}
            rooms={rooms}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !currentAdmin) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-background flex">
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
      
      <AdminSidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab as AdminTab)}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onLogout={logout}
      />

      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
