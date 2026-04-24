import { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Building2, 
  Phone,
  Palette,
  Clock,
  FileText,
  Code,
  Search,
  Users,
  Moon,
  Globe,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { AdminSettings } from '@/types/admin';
import { CURRENCIES } from '@/types/admin';

interface SettingsManagerProps {
  settings: AdminSettings;
  onUpdate: (settings: Partial<AdminSettings>) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (data: string) => boolean;
}

export function SettingsManager({ 
  settings, 
  onUpdate, 
  onReset,
  onExport,
  onImport
}: SettingsManagerProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');

  const handleChange = (field: keyof AdminSettings, value: string | number | boolean) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(localSettings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  const handleFactoryReset = () => {
    onReset();
    setLocalSettings(settings);
    setHasChanges(false);
  };

  const handleImport = () => {
    setImportError('');
    const success = onImport(importData);
    if (success) {
      setShowImportDialog(false);
      setImportData('');
    } else {
      setImportError('Invalid JSON data. Please check your file and try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">
            Configure your hostel booking system
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Discard
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="stays">Stays & Guests</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="seo">SEO & Scripts</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Hostel Information
              </CardTitle>
              <CardDescription>
                Basic information about your hostel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hostel Name *</Label>
                  <Input
                    value={localSettings.hostelName}
                    onChange={(e) => handleChange('hostelName', e.target.value)}
                    placeholder="Your Hostel Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    value={localSettings.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    placeholder="Your catchy tagline"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={localSettings.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief description of your hostel..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={localSettings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Full address"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cancellation Policy</Label>
                <Textarea
                  value={localSettings.cancellationPolicy}
                  onChange={(e) => handleChange('cancellationPolicy', e.target.value)}
                  placeholder="Describe your cancellation policy..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Terms & Conditions</Label>
                <Textarea
                  value={localSettings.termsAndConditions}
                  onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                  placeholder="Your terms and conditions..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Privacy Policy</Label>
                <Textarea
                  value={localSettings.privacyPolicy}
                  onChange={(e) => handleChange('privacyPolicy', e.target.value)}
                  placeholder="Your privacy policy..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>House Rules</Label>
                <Textarea
                  value={localSettings.houseRules}
                  onChange={(e) => handleChange('houseRules', e.target.value)}
                  placeholder="Your house rules..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stays & Guests Settings */}
        <TabsContent value="stays" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Stay Controls
              </CardTitle>
              <CardDescription>
                Configure minimum and maximum stay requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Stay (nights)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    value={localSettings.minStayNights}
                    onChange={(e) => handleChange('minStayNights', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum number of nights guests must book
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Maximum Stay (nights)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    value={localSettings.maxStayNights}
                    onChange={(e) => handleChange('maxStayNights', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of nights allowed per booking
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in Time</Label>
                  <Input
                    type="time"
                    value={localSettings.checkInTime}
                    onChange={(e) => handleChange('checkInTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Check-out Time</Label>
                  <Input
                    type="time"
                    value={localSettings.checkOutTime}
                    onChange={(e) => handleChange('checkOutTime', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Guest Controls
              </CardTitle>
              <CardDescription>
                Configure guest limits and restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Guests</Label>
                  <Input
                    type="number"
                    min={1}
                    value={localSettings.minGuests}
                    onChange={(e) => handleChange('minGuests', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Guests</Label>
                  <Input
                    type="number"
                    min={1}
                    value={localSettings.maxGuests}
                    onChange={(e) => handleChange('maxGuests', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max per Room</Label>
                  <Input
                    type="number"
                    min={1}
                    value={localSettings.maxGuestsPerRoom}
                    onChange={(e) => handleChange('maxGuestsPerRoom', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="cursor-pointer">Allow Children</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow bookings with children
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.allowChildren}
                    onCheckedChange={(checked) => handleChange('allowChildren', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="cursor-pointer">Allow Pets</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow guests to bring pets
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.allowPets}
                    onCheckedChange={(checked) => handleChange('allowPets', checked)}
                  />
                </div>
                {localSettings.allowPets && (
                  <div className="space-y-2 pl-4 border-l-2">
                    <Label>Pet Fee ($)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={localSettings.petFee}
                      onChange={(e) => handleChange('petFee', parseInt(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                How guests can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>WhatsApp Number *</Label>
                <Input
                  value={localSettings.whatsappNumber}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="15551234567 (no + or spaces)"
                />
                <p className="text-xs text-muted-foreground">
                  This number will receive booking requests via WhatsApp
                </p>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={localSettings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={localSettings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="booking@yourhostel.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="cursor-pointer">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive email notifications for new bookings
                  </p>
                </div>
                <Switch
                  checked={localSettings.emailNotifications}
                  onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="cursor-pointer">WhatsApp Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive WhatsApp notifications for new bookings
                  </p>
                </div>
                <Switch
                  checked={localSettings.whatsappNotifications}
                  onCheckedChange={(checked) => handleChange('whatsappNotifications', checked)}
                />
              </div>
              <div className="space-y-2 pt-4">
                <Label>Booking Confirmation Template</Label>
                <Textarea
                  value={localSettings.bookingConfirmationTemplate}
                  onChange={(e) => handleChange('bookingConfirmationTemplate', e.target.value)}
                  placeholder="Message template for booking confirmations..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {'{{guestName}}'}, {'{{hostelName}}'}, {'{{checkInDate}}'}, {'{{checkOutDate}}'}, {'{{roomName}}'}, {'{{totalAmount}}'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localSettings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={localSettings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      placeholder="#d97706"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localSettings.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={localSettings.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      placeholder="#059669"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={localSettings.logo}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  placeholder="https://your-logo-url.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label>Favicon URL</Label>
                <Input
                  value={localSettings.favicon}
                  onChange={(e) => handleChange('favicon', e.target.value)}
                  placeholder="https://your-favicon-url.com/favicon.ico"
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={localSettings.currency}
                  onValueChange={(value) => handleChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <Label className="cursor-pointer flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable dark mode for the admin dashboard
                  </p>
                </div>
                <Switch
                  checked={localSettings.darkMode}
                  onCheckedChange={(checked) => handleChange('darkMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO & Scripts Settings */}
        <TabsContent value="seo" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Optimize your site for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={localSettings.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  placeholder="Page title for search engines"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 50-60 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={localSettings.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="Brief description for search results..."
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 150-160 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <Input
                  value={localSettings.metaKeywords}
                  onChange={(e) => handleChange('metaKeywords', e.target.value)}
                  placeholder="hostel, travel, accommodation, budget"
                />
              </div>
              <div className="space-y-2">
                <Label>OG Image URL</Label>
                <Input
                  value={localSettings.ogImage}
                  onChange={(e) => handleChange('ogImage', e.target.value)}
                  placeholder="Image for social media sharing"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200x630 pixels
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Analytics & Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Google Analytics ID</Label>
                <Input
                  value={localSettings.googleAnalyticsId}
                  onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                />
              </div>
              <div className="space-y-2">
                <Label>Facebook Pixel ID</Label>
                <Input
                  value={localSettings.facebookPixelId}
                  onChange={(e) => handleChange('facebookPixelId', e.target.value)}
                  placeholder="XXXXXXXXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Custom Scripts
              </CardTitle>
              <CardDescription>
                Add custom code to your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Header Script</Label>
                <Textarea
                  value={localSettings.customHeaderScript}
                  onChange={(e) => handleChange('customHeaderScript', e.target.value)}
                  placeholder="<!-- Custom scripts for <head> section -->"
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This code will be added to the {'<head>'} section of every page
                </p>
              </div>
              <div className="space-y-2">
                <Label>Footer Script</Label>
                <Textarea
                  value={localSettings.customFooterScript}
                  onChange={(e) => handleChange('customFooterScript', e.target.value)}
                  placeholder="<!-- Custom scripts before closing </body> tag -->"
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This code will be added before the closing {'</body>'} tag
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export or import your hostel data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Export All Data</p>
                  <p className="text-sm text-muted-foreground">
                    Download a backup of all your settings, packages, rooms, and bookings
                  </p>
                </div>
                <Button variant="outline" onClick={onExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Import Data</p>
                  <p className="text-sm text-muted-foreground">
                    Restore from a previous backup
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShowImportDialog(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <p className="font-medium text-destructive">Reset to Defaults</p>
                  <p className="text-sm text-destructive/70">
                    This will reset all settings to their default values
                  </p>
                </div>
                <Button variant="destructive" onClick={handleFactoryReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Paste your JSON backup data below. This will overwrite all existing data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste JSON data here..."
              rows={10}
            />
            {importError && (
              <p className="text-sm text-destructive">{importError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
