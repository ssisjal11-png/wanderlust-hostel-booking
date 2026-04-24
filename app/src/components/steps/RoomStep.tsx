import { useState } from 'react';
import { Check, Users, Wifi, Wind, Lock, Tv, Bath, Refrigerator, Sun, Shield } from 'lucide-react';
import type { Room } from '@/types/booking';
import { rooms } from '@/data/bookingData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const amenityIconMap: Record<string, React.ElementType> = {
  'AC': Wind,
  'Wi-Fi': Wifi,
  'Premium Wi-Fi': Wifi,
  'Lockers': Lock,
  'TV': Tv,
  'Smart TV': Tv,
  'Private Bath': Bath,
  'Ensuite Bath': Bath,
  'Mini Fridge': Refrigerator,
  'Balcony': Sun,
  'Safe': Shield,
  'Reading Light': Sun,
  'Curtains': Sun,
  'Hair Dryer': Wind,
  'Mirror': Sun,
  'Desk': Sun,
  'Wardrobe': Lock,
  'Kitchenette': Refrigerator
};

interface RoomStepProps {
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  onNext: () => void;
  onBack: () => void;
}

export function RoomStep({ selectedRoom, onSelectRoom, onNext, onBack }: RoomStepProps) {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-foreground mb-2">
          Select Your Room
        </h2>
        <p className="text-muted-foreground">
          Browse our comfortable rooms and find the perfect space for your stay
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rooms.map((room, index) => {
          const isSelected = selectedRoom?.id === room.id;
          const isHovered = hoveredRoom === room.id;

          return (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room)}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              className={cn(
                "relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300",
                "border-2 bg-card shadow-card",
                isSelected 
                  ? "border-primary shadow-soft" 
                  : "border-transparent hover:border-primary/30 hover:shadow-soft"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Room Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500",
                    isHovered && "scale-110"
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Selection Badge */}
                <div className={cn(
                  "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isSelected 
                    ? "bg-primary" 
                    : "bg-white/90 backdrop-blur-sm"
                )}>
                  {isSelected && <Check className="w-5 h-5 text-primary-foreground" />}
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                    ${room.pricePerNight}
                    <span className="text-xs font-normal ml-1">/night</span>
                  </Badge>
                </div>

                {/* Capacity Badge */}
                <div className="absolute bottom-4 right-4">
                  <Badge variant="secondary" className="gap-1">
                    <Users className="w-3 h-3" />
                    {room.capacity}
                  </Badge>
                </div>
              </div>

              {/* Room Details */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {room.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {room.description}
                    </p>
                  </div>
                </div>

                {/* Beds Info */}
                <p className="text-sm text-foreground/70 mb-3">
                  <span className="font-medium">Beds:</span> {room.beds}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                  {room.amenities.slice(0, 5).map((amenity) => {
                    const AmenityIcon = amenityIconMap[amenity] || Sun;
                    return (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-xs text-foreground/70"
                      >
                        <AmenityIcon className="w-3 h-3" />
                        {amenity}
                      </span>
                    );
                  })}
                  {room.amenities.length > 5 && (
                    <span className="inline-flex items-center px-2 py-1 bg-secondary rounded-md text-xs text-foreground/70">
                      +{room.amenities.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          size="lg"
        >
          Back to Package
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedRoom}
          size="lg"
          className="px-8"
        >
          Continue to Dates
        </Button>
      </div>
    </div>
  );
}
