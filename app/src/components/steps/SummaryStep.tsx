import { useState } from 'react';
import { 
  User, Mail, Phone, MessageSquare, 
  Calendar, Users, BedDouble, Package, 
  Check, Edit2, Send, ArrowLeft, MessageCircle
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { BookingData, BookingStep } from '@/types/booking';
import { cn } from '@/lib/utils';

interface SummaryStepProps {
  bookingData: BookingData;
  onSetGuestInfo: (info: Partial<BookingData['guestInfo']>) => void;
  onGoToStep: (step: BookingStep) => void;
  onSubmit: () => void;
  calculateTotalPrice: () => number;
}

export function SummaryStep({ 
  bookingData, 
  onSetGuestInfo, 
  onGoToStep, 
  onSubmit,
  calculateTotalPrice 
}: SummaryStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { 
    selectedPackage, 
    selectedRoom, 
    checkInDate, 
    checkOutDate, 
    guestCount,
    guestInfo 
  } = bookingData;

  const nights = checkInDate && checkOutDate 
    ? differenceInDays(checkOutDate, checkInDate) 
    : 0;

  const totalPrice = calculateTotalPrice();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!guestInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!guestInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!guestInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      onSubmit();
    }
  };

  const DetailRow = ({ 
    icon: Icon, 
    label, 
    value, 
    step 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string; 
    step: BookingStep;
  }) => (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onGoToStep(step)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit2 className="w-3 h-3 mr-1" />
        Edit
      </Button>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-foreground mb-2">
          Review Your Booking
        </h2>
        <p className="text-muted-foreground">
          Please review your reservation details and complete your information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <DetailRow
                icon={Package}
                label="Package"
                value={selectedPackage?.name || ''}
                step="package"
              />
              <Separator />
              <DetailRow
                icon={BedDouble}
                label="Room"
                value={selectedRoom?.name || ''}
                step="rooms"
              />
              <Separator />
              <DetailRow
                icon={Calendar}
                label="Dates"
                value={`${checkInDate ? format(checkInDate, 'MMM dd') : ''} - ${checkOutDate ? format(checkOutDate, 'MMM dd, yyyy') : ''} (${nights} nights)`}
                step="date"
              />
              <Separator />
              <DetailRow
                icon={Users}
                label="Guests"
                value={`${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}`}
                step="date"
              />
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg">Price Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Room rate ({nights} nights)
                  </span>
                  <span className="text-foreground">
                    ${selectedRoom?.pricePerNight} × {nights} = ${(selectedRoom?.pricePerNight || 0) * nights}
                  </span>
                </div>
                {guestCount > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="text-foreground">× {guestCount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="text-foreground">Included</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Total Amount</span>
                  <span className="font-display text-3xl font-bold text-primary">
                    ${totalPrice}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guest Information Form */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg">Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={guestInfo.fullName}
                  onChange={(e) => onSetGuestInfo({ fullName: e.target.value })}
                  className={cn(errors.fullName && "border-destructive")}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={guestInfo.email}
                  onChange={(e) => onSetGuestInfo({ email: e.target.value })}
                  className={cn(errors.email && "border-destructive")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={guestInfo.phone}
                  onChange={(e) => onSetGuestInfo({ phone: e.target.value })}
                  className={cn(errors.phone && "border-destructive")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requests" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  Special Requests (Optional)
                </Label>
                <Textarea
                  id="requests"
                  placeholder="Any special requests or notes for your stay..."
                  value={guestInfo.specialRequests}
                  onChange={(e) => onSetGuestInfo({ specialRequests: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Section */}
      <div className="mt-8">
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Send via WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    Your reservation will be sent directly to our team
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onGoToStep('date')}
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Opening WhatsApp...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reservation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
