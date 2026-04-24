import { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  Check,
  Users,
  BedDouble
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import type { RoomFormData } from '@/types/admin';
import { AVAILABLE_AMENITIES } from '@/types/admin';

interface RoomManagerProps {
  rooms: RoomFormData[];
  isEditing: boolean;
  selectedRoom: RoomFormData | null;
  showDeleteConfirm: string | null;
  onCreate: (room: RoomFormData) => void;
  onUpdate: (id: string, room: Partial<RoomFormData>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (room: RoomFormData) => void;
  onStartEdit: (room: RoomFormData) => void;
  onStartCreate: () => void;
  onCancelEdit: () => void;
  onSetDeleteConfirm: (id: string | null) => void;
}

const emptyRoom: RoomFormData = {
  name: '',
  description: '',
  pricePerNight: 0,
  capacity: 2,
  beds: '',
  amenities: [],
  image: '',
  images: [],
  available: true,
  active: true,
};

export function RoomManager({
  rooms,
  isEditing,
  selectedRoom,
  showDeleteConfirm,
  onCreate,
  onUpdate,
  onDelete,
  onDuplicate,
  onStartEdit,
  onStartCreate,
  onCancelEdit,
  onSetDeleteConfirm,
}: RoomManagerProps) {
  const [formData, setFormData] = useState<RoomFormData>(emptyRoom);

  const handleStartEdit = (room: RoomFormData) => {
    setFormData({ ...room });
    onStartEdit(room);
  };

  const handleStartCreate = () => {
    setFormData(emptyRoom);
    onStartCreate();
  };

  const handleSave = () => {
    if (selectedRoom) {
      onUpdate(selectedRoom.id!, formData);
    } else {
      onCreate(formData);
    }
    setFormData(emptyRoom);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const activeRooms = rooms.filter(r => r.active);
  const inactiveRooms = rooms.filter(r => !r.active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Room Management</h2>
          <p className="text-muted-foreground">
            Manage your room types, pricing, and availability
          </p>
        </div>
        <Button onClick={handleStartCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Active Rooms */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Active Rooms ({activeRooms.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden group">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={room.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{room.name}</h4>
                      <p className="text-sm text-white/80">
                        {room.available ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        ${room.pricePerNight}
                      </p>
                      <p className="text-xs text-white/70">per night</p>
                    </div>
                  </div>
                </div>
                {/* Actions Overlay */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => handleStartEdit(room)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => onDuplicate(room)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onSetDeleteConfirm(room.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {room.description}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{room.capacity} guests</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <BedDouble className="w-4 h-4 text-muted-foreground" />
                    <span>{room.beds}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {room.amenities.slice(0, 4).map((amenity, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {room.amenities.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.amenities.length - 4}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Inactive Rooms */}
      {inactiveRooms.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Inactive Rooms ({inactiveRooms.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-60">
            {inactiveRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={room.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{room.name}</h4>
                        <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                          Inactive
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(room)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSetDeleteConfirm(room.id!)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && onCancelEdit()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRoom ? 'Edit Room' : 'Create New Room'}
            </DialogTitle>
            <DialogDescription>
              Configure your room details, pricing, and amenities.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Image Preview */}
            {formData.image && (
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={formData.image}
                  alt="Room preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Room Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Deluxe Double Room"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the room..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Price/Night *</Label>
                  <Input
                    type="number"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Beds</Label>
                  <Input
                    value={formData.beds}
                    onChange={(e) => setFormData(prev => ({ ...prev, beds: e.target.value }))}
                    placeholder="1 Queen Bed"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                    />
                    <span className="text-sm">{formData.active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Availability */}
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.available}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
              />
              <div>
                <Label className="cursor-pointer">Currently Available</Label>
                <p className="text-xs text-muted-foreground">
                  Toggle off to mark room as temporarily unavailable
                </p>
              </div>
            </div>

            <Separator />

            {/* Amenities */}
            <div className="space-y-4">
              <Label>Amenities</Label>
              <div className="grid grid-cols-3 gap-3">
                {AVAILABLE_AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label
                      htmlFor={`amenity-${amenity}`}
                      className="text-sm cursor-pointer"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.name || !formData.description || formData.pricePerNight <= 0}
            >
              <Check className="w-4 h-4 mr-2" />
              {selectedRoom ? 'Save Changes' : 'Create Room'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => onSetDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onSetDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => showDeleteConfirm && onDelete(showDeleteConfirm)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
