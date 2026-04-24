import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Users,
  DollarSign, 
  Phone, 
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  MessageSquare,
  Trash2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import type { RecentBooking } from '@/types/admin';
import { cn } from '@/lib/utils';

interface BookingsManagerProps {
  bookings: RecentBooking[];
  onUpdateStatus: (id: string, status: RecentBooking['status']) => void;
  onAddNote: (id: string, note: string) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock; variant: 'outline' | 'default' | 'secondary' }> = {
  pending: { 
    label: 'Pending', 
    color: 'bg-amber-500', 
    icon: Clock,
    variant: 'outline'
  },
  confirmed: { 
    label: 'Confirmed', 
    color: 'bg-green-500', 
    icon: CheckCircle,
    variant: 'default'
  },
  'checked-in': { 
    label: 'Checked In', 
    color: 'bg-blue-500', 
    icon: CheckCircle,
    variant: 'default'
  },
  'checked-out': { 
    label: 'Checked Out', 
    color: 'bg-gray-500', 
    icon: CheckCircle,
    variant: 'secondary'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-500', 
    icon: XCircle,
    variant: 'secondary'
  },
};

export function BookingsManager({ 
  bookings, 
  onUpdateStatus, 
  onAddNote,
  onDelete 
}: BookingsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<RecentBooking | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteText, setNoteText] = useState('');

  const filteredBookings = bookings.filter(booking => 
    booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingBookings = filteredBookings.filter(b => b.status === 'pending');
  const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed');
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled');

  const handleViewDetail = (booking: RecentBooking) => {
    setSelectedBooking(booking);
    setNoteText(booking.notes || '');
    setShowDetailDialog(true);
  };

  const handleSaveNote = () => {
    if (selectedBooking) {
      onAddNote(selectedBooking.id, noteText);
      setSelectedBooking({ ...selectedBooking, notes: noteText });
    }
  };

  const handleDelete = () => {
    if (selectedBooking) {
      onDelete(selectedBooking.id);
      setShowDeleteDialog(false);
      setShowDetailDialog(false);
      setSelectedBooking(null);
    }
  };

  const BookingCard = ({ booking }: { booking: RecentBooking }) => {
    const status = statusConfig[booking.status];
    const StatusIcon = status.icon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={cn(status.color, 'text-white')}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{booking.id}</span>
              </div>
              <h4 className="font-semibold">{booking.guestName}</h4>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {booking.guestEmail}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {booking.guestPhone}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  {booking.checkInDate} - {booking.checkOutDate}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  {booking.guestCount} guests
                </span>
                <span className="flex items-center gap-1 text-sm font-medium">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  ${booking.totalAmount}
                </span>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">{booking.packageName}</span>
                <span className="mx-2">•</span>
                <span className="text-muted-foreground">{booking.roomName}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewDetail(booking)}>
                    View Details
                  </DropdownMenuItem>
                  {booking.status !== 'confirmed' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(booking.id, 'confirmed')}>
                      Mark as Confirmed
                    </DropdownMenuItem>
                  )}
                  {booking.status !== 'cancelled' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(booking.id, 'cancelled')}>
                      Mark as Cancelled
                    </DropdownMenuItem>
                  )}
                  {booking.status !== 'pending' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(booking.id, 'pending')}>
                      Mark as Pending
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Bookings Management</h2>
          <p className="text-muted-foreground">
            View and manage all reservations
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingBookings.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">{confirmedBookings.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">{cancelledBookings.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({filteredBookings.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({confirmedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {filteredBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No bookings found
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
          {pendingBookings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No pending bookings
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4 mt-4">
          {confirmedBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
          {confirmedBookings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No confirmed bookings
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4 mt-4">
          {cancelledBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
          {cancelledBookings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No cancelled bookings
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Booking Details
                  <Badge className={statusConfig[selectedBooking.status].color}>
                    {statusConfig[selectedBooking.status].label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Booking ID: {selectedBooking.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Guest Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Name</p>
                    <p className="font-medium">{selectedBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Count</p>
                    <p className="font-medium">{selectedBooking.guestCount} guests</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedBooking.guestEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedBooking.guestPhone}</p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Package</p>
                    <p className="font-medium">{selectedBooking.packageName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room</p>
                    <p className="font-medium">{selectedBooking.roomName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium">{selectedBooking.checkInDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium">{selectedBooking.checkOutDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">${selectedBooking.totalAmount}</p>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Notes
                  </Label>
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add notes about this booking..."
                    rows={3}
                  />
                  <Button variant="outline" size="sm" onClick={handleSaveNote}>
                    Save Note
                  </Button>
                </div>
              </div>

              <DialogFooter className="gap-2">
                {selectedBooking.status !== 'confirmed' && (
                  <Button 
                    variant="outline"
                    onClick={() => onUpdateStatus(selectedBooking.id, 'confirmed')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm
                  </Button>
                )}
                {selectedBooking.status !== 'cancelled' && (
                  <Button 
                    variant="outline"
                    onClick={() => onUpdateStatus(selectedBooking.id, 'cancelled')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
                <Button 
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
