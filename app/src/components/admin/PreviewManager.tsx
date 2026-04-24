import { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Tablet,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PackageFormData, RoomFormData, AdminSettings } from '@/types/admin';

interface PreviewManagerProps {
  settings: AdminSettings;
  packages: PackageFormData[];
  rooms: RoomFormData[];
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export function PreviewManager({ settings, packages, rooms }: PreviewManagerProps) {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  const deviceSizes = {
    desktop: { width: '100%', height: '800px' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '812px' },
  };

  const activePackages = packages.filter(p => p.active);
  const activeRooms = rooms.filter(r => r.active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Preview Booking Form</h2>
          <p className="text-muted-foreground">
            See how your booking form appears to customers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshPreview}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => window.open('/', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Live Site
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Packages</p>
            <p className="text-2xl font-bold">{activePackages.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Rooms</p>
            <p className="text-2xl font-bold">{activeRooms.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">WhatsApp Number</p>
            <p className="text-sm font-medium truncate">{settings.whatsappNumber || 'Not set'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Currency</p>
            <p className="text-2xl font-bold">{settings.currency}</p>
          </CardContent>
        </Card>
      </div>

      {/* Device Selector */}
      <div className="flex items-center justify-center gap-2 p-2 bg-muted rounded-lg">
        <Button
          variant={activeDevice === 'desktop' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveDevice('desktop')}
        >
          <Monitor className="w-4 h-4 mr-2" />
          Desktop
        </Button>
        <Button
          variant={activeDevice === 'tablet' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveDevice('tablet')}
        >
          <Tablet className="w-4 h-4 mr-2" />
          Tablet
        </Button>
        <Button
          variant={activeDevice === 'mobile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveDevice('mobile')}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Mobile
        </Button>
      </div>

      {/* Preview Frame */}
      <div className="flex justify-center">
        <div 
          className={cn(
            "border-4 border-slate-800 rounded-[2rem] overflow-hidden bg-white shadow-2xl transition-all duration-300",
            activeDevice === 'mobile' && "rounded-[3rem]"
          )}
          style={deviceSizes[activeDevice]}
        >
          <iframe
            key={previewKey}
            src="/"
            className="w-full h-full border-0"
            title="Booking Form Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>
            Overview of what's currently displayed on the booking form
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Packages */}
          <div>
            <h4 className="font-medium mb-3">Packages ({activePackages.length})</h4>
            <div className="flex flex-wrap gap-2">
              {activePackages.map(pkg => (
                <Badge 
                  key={pkg.id} 
                  variant={pkg.popular ? 'default' : 'secondary'}
                  className="text-sm py-1 px-3"
                >
                  {pkg.name}
                  <span className="ml-2 opacity-70">${pkg.price}</span>
                  {pkg.popular && <span className="ml-2">⭐</span>}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rooms */}
          <div>
            <h4 className="font-medium mb-3">Rooms ({activeRooms.length})</h4>
            <div className="flex flex-wrap gap-2">
              {activeRooms.map(room => (
                <Badge 
                  key={room.id} 
                  variant={room.available ? 'secondary' : 'outline'}
                  className="text-sm py-1 px-3"
                >
                  {room.name}
                  <span className="ml-2 opacity-70">${room.pricePerNight}</span>
                  {!room.available && <span className="ml-2 text-destructive">(Unavailable)</span>}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Hostel Name</p>
              <p className="font-medium">{settings.hostelName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tagline</p>
              <p className="font-medium">{settings.tagline}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp</p>
              <p className="font-medium">{settings.whatsappNumber || 'Not configured'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{settings.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
