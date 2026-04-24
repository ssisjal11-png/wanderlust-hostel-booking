import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  BedDouble,
  Users,
  DollarSign,
  Phone,
  Mail,
  XCircle,
  Filter
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BookingEvent, RoomFormData } from '@/types/admin';
import { cn } from '@/lib/utils';

interface CalendarTimelineProps {
  rooms: RoomFormData[];
  events: BookingEvent[];
  onUpdateEvent: (id: string, event: Partial<BookingEvent>) => void;
  onDeleteEvent: (id: string) => void;
}

type ViewMode = 'week' | 'month';

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  'checked-in': '#3b82f6',
  'checked-out': '#6b7280',
  cancelled: '#ef4444',
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'checked-in': 'Checked In',
  'checked-out': 'Checked Out',
  cancelled: 'Cancelled',
};

export function CalendarTimeline({ 
  rooms, 
  events, 
  onUpdateEvent, 
  onDeleteEvent 
}: CalendarTimelineProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  const activeRooms = rooms.filter(r => r.active);

  const filteredEvents = useMemo(() => {
    if (selectedRoom === 'all') return events;
    return events.filter(e => e.roomId === selectedRoom);
  }, [events, selectedRoom]);

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'week') {
      setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysForView = () => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  const days = getDaysForView();

  const getEventsForRoomAndDate = (roomId: string, date: Date) => {
    return filteredEvents.filter(event => {
      const checkIn = new Date(event.checkInDate);
      const checkOut = new Date(event.checkOutDate);
      return event.roomId === roomId && date >= checkIn && date < checkOut;
    });
  };

  const handleEventClick = (event: BookingEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleStatusChange = (status: BookingEvent['status']) => {
    if (selectedEvent) {
      onUpdateEvent(selectedEvent.id, { status, color: statusColors[status] });
      setSelectedEvent({ ...selectedEvent, status, color: statusColors[status] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Calendar Timeline</h2>
          <p className="text-muted-foreground">
            View and manage room availability and reservations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <div className="text-lg font-semibold min-w-[200px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {activeRooms.map(room => (
                <SelectItem key={room.id} value={room.id!}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 ml-auto">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-muted-foreground">
                {statusLabels[status as keyof typeof statusLabels]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Days Header */}
            <div className="grid" style={{ gridTemplateColumns: `150px repeat(${days.length}, 1fr)` }}>
              <div className="p-3 border-b border-r bg-muted font-medium text-sm">
                Room / Date
              </div>
              {days.map((day, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-3 border-b text-center text-sm",
                    isSameDay(day, new Date()) && "bg-primary/5"
                  )}
                >
                  <div className="font-medium">{format(day, 'EEE')}</div>
                  <div className={cn(
                    "text-muted-foreground",
                    isSameDay(day, new Date()) && "text-primary font-bold"
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Room Rows */}
            {(selectedRoom === 'all' ? activeRooms : activeRooms.filter(r => r.id === selectedRoom)).map(room => (
              <div 
                key={room.id} 
                className="grid" 
                style={{ gridTemplateColumns: `150px repeat(${days.length}, 1fr)` }}
              >
                <div className="p-3 border-b border-r bg-muted/50">
                  <div className="font-medium text-sm">{room.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ${room.pricePerNight}/night
                  </div>
                </div>
                {days.map((day, dayIndex) => {
                  const dayEvents = getEventsForRoomAndDate(room.id!, day);
                  return (
                    <div 
                      key={dayIndex} 
                      className={cn(
                        "p-1 border-b border-r min-h-[80px] relative",
                        isSameDay(day, new Date()) && "bg-primary/5"
                      )}
                    >
                      {dayEvents.map(event => {
                        const isFirstDay = isSameDay(day, new Date(event.checkInDate));
                        if (!isFirstDay) return null;
                        return (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className="absolute top-1 left-1 right-1 p-2 rounded text-xs cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                            style={{ 
                              backgroundColor: event.color,
                              color: 'white',
                              minHeight: '60px',
                              zIndex: 10
                            }}
                          >
                            <div className="font-medium truncate">{event.guestName}</div>
                            <div className="opacity-90 truncate">{event.guestCount} guests</div>
                            <div className="opacity-75">${event.totalAmount}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{filteredEvents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Occupied Rooms</p>
            <p className="text-2xl font-bold">
              {new Set(filteredEvents.map(e => e.roomId)).size}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-500">
              {filteredEvents.filter(e => e.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-bold text-green-500">
              {filteredEvents.filter(e => e.status === 'confirmed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Booking Details
                  <Badge 
                    style={{ 
                      backgroundColor: selectedEvent.color,
                      color: 'white'
                    }}
                  >
                    {statusLabels[selectedEvent.status]}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Booking ID: {selectedEvent.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Name</p>
                    <p className="font-medium">{selectedEvent.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Count</p>
                    <p className="font-medium flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedEvent.guestCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedEvent.guestEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {selectedEvent.guestPhone}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{selectedEvent.roomName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {format(new Date(selectedEvent.checkInDate), 'MMM dd')} - {format(new Date(selectedEvent.checkOutDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="font-bold">${selectedEvent.totalAmount}</span>
                  </div>
                </div>

                {selectedEvent.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{selectedEvent.notes}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statusLabels).map(([status, label]) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedEvent.status === status ? 'default' : 'outline'}
                        onClick={() => handleStatusChange(status as BookingEvent['status'])}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                  Close
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    onDeleteEvent(selectedEvent.id);
                    setShowEventDialog(false);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
