import { useState } from 'react';
import { Calendar as CalendarIcon, Minus, Plus, Info } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DateStepProps {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  guestCount: number;
  onSetDates: (checkIn: Date | null, checkOut: Date | null) => void;
  onSetGuestCount: (count: number) => void;
  onNext: () => void;
  onBack: () => void;
  roomPricePerNight: number;
}

export function DateStep({ 
  checkInDate, 
  checkOutDate, 
  guestCount,
  onSetDates, 
  onSetGuestCount,
  onNext, 
  onBack,
  roomPricePerNight
}: DateStepProps) {
  const [ selectingCheckOut, setSelectingCheckOut ] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!selectingCheckOut) {
      onSetDates(date, null);
      setSelectingCheckOut(true);
    } else {
      if (checkInDate && date > checkInDate) {
        onSetDates(checkInDate, date);
        setSelectingCheckOut(false);
      } else {
        onSetDates(date, null);
      }
    }
  };

  const nights = checkInDate && checkOutDate 
    ? differenceInDays(checkOutDate, checkInDate) 
    : 0;
  
  const totalPrice = nights * roomPricePerNight * guestCount;

  const disabledDays = {
    before: new Date()
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-foreground mb-2">
          Select Your Dates
        </h2>
        <p className="text-muted-foreground">
          Choose your check-in and check-out dates for your stay
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 bg-primary/5 border-b">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  {selectingCheckOut 
                    ? 'Now select your check-out date' 
                    : 'First, select your check-in date'}
                </p>
              </div>
              <div className="p-4">
                <Calendar
                  mode="single"
                  selected={selectingCheckOut ? checkOutDate || undefined : checkInDate || undefined}
                  onSelect={handleSelect}
                  disabled={disabledDays}
                  numberOfMonths={1}
                  className="mx-auto"
                  modifiers={{
                    selected: [checkInDate, checkOutDate].filter(Boolean) as Date[],
                    range: checkInDate && checkOutDate ? { from: checkInDate, to: checkOutDate } : undefined
                  }}
                  modifiersStyles={{
                    selected: { backgroundColor: 'hsl(25 75% 47%)', color: 'white' },
                    range: { backgroundColor: 'hsl(25 75% 47% / 0.1)' }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selection Summary */}
        <div className="space-y-6">
          {/* Date Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={cn(
              "transition-all duration-300",
              checkInDate ? "border-primary/50" : ""
            )}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Check-in
                </p>
                <p className="font-display text-xl font-semibold text-foreground">
                  {checkInDate ? format(checkInDate, 'MMM dd') : '--'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {checkInDate ? format(checkInDate, 'yyyy') : 'Select date'}
                </p>
              </CardContent>
            </Card>
            <Card className={cn(
              "transition-all duration-300",
              checkOutDate ? "border-primary/50" : ""
            )}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Check-out
                </p>
                <p className="font-display text-xl font-semibold text-foreground">
                  {checkOutDate ? format(checkOutDate, 'MMM dd') : '--'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {checkOutDate ? format(checkOutDate, 'yyyy') : 'Select date'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Guest Count */}
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                Number of Guests
              </p>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onSetGuestCount(Math.max(1, guestCount - 1))}
                  disabled={guestCount <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-foreground">
                    {guestCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {guestCount === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onSetGuestCount(Math.min(10, guestCount + 1))}
                  disabled={guestCount >= 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Price Summary */}
          {checkInDate && checkOutDate && nights > 0 && (
            <Card className="bg-primary/5 border-primary/20 animate-scale-in">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${roomPricePerNight} × {nights} nights
                    </span>
                    <span className="text-foreground">
                      ${roomPricePerNight * nights}
                    </span>
                  </div>
                  {guestCount > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        × {guestCount} guests
                      </span>
                      <span className="text-foreground">
                        ×{guestCount}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-primary/20 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="font-display text-2xl font-bold text-primary">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Note */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Free cancellation up to 24 hours before check-in. 
              Taxes and fees will be calculated at checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          size="lg"
        >
          Back to Rooms
        </Button>
        <Button
          onClick={onNext}
          disabled={!checkInDate || !checkOutDate}
          size="lg"
          className="px-8"
        >
          Review Booking
        </Button>
      </div>
    </div>
  );
}
