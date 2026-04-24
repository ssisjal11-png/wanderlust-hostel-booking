import { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  Star, 
  Check,
  X,
  GripVertical
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PackageFormData } from '@/types/admin';
import { AVAILABLE_ICONS } from '@/types/admin';
import { cn } from '@/lib/utils';

// Icon components mapping
import { 
  Backpack, 
  BedDouble, 
  Crown, 
  Users, 
  Star as StarIcon, 
  Heart, 
  Gem, 
  Sparkles, 
  Zap, 
  Sun, 
  Moon, 
  Coffee 
} from 'lucide-react';

const iconComponents: Record<string, React.ElementType> = {
  Backpack,
  BedDouble,
  Crown,
  Users,
  Star: StarIcon,
  Heart,
  Gem,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Coffee,
};

interface PackageManagerProps {
  packages: PackageFormData[];
  isEditing: boolean;
  selectedPackage: PackageFormData | null;
  showDeleteConfirm: string | null;
  onCreate: (pkg: PackageFormData) => void;
  onUpdate: (id: string, pkg: Partial<PackageFormData>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (pkg: PackageFormData) => void;
  onStartEdit: (pkg: PackageFormData) => void;
  onStartCreate: () => void;
  onCancelEdit: () => void;
  onSetDeleteConfirm: (id: string | null) => void;
}

const emptyPackage: PackageFormData = {
  name: '',
  description: '',
  price: 0,
  duration: 'per night',
  features: [''],
  icon: 'Backpack',
  popular: false,
  active: true,
};

export function PackageManager({
  packages,
  isEditing,
  selectedPackage,
  showDeleteConfirm,
  onCreate,
  onUpdate,
  onDelete,
  onDuplicate,
  onStartEdit,
  onStartCreate,
  onCancelEdit,
  onSetDeleteConfirm,
}: PackageManagerProps) {
  const [formData, setFormData] = useState<PackageFormData>(emptyPackage);
  const [newFeature, setNewFeature] = useState('');

  const handleStartEdit = (pkg: PackageFormData) => {
    setFormData({ ...pkg });
    onStartEdit(pkg);
  };

  const handleStartCreate = () => {
    setFormData(emptyPackage);
    onStartCreate();
  };

  const handleSave = () => {
    if (selectedPackage) {
      onUpdate(selectedPackage.id!, formData);
    } else {
      onCreate(formData);
    }
    setFormData(emptyPackage);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const activePackages = packages.filter(p => p.active);
  const inactivePackages = packages.filter(p => !p.active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Package Management</h2>
          <p className="text-muted-foreground">
            Manage your booking packages and pricing options
          </p>
        </div>
        <Button onClick={handleStartCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* Active Packages */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Active Packages ({activePackages.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activePackages.map((pkg) => {
            const Icon = iconComponents[pkg.icon] || Backpack;
            return (
              <Card key={pkg.id} className={cn(
                "group transition-all duration-200",
                pkg.popular && "border-primary/50 ring-1 ring-primary/20"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        pkg.popular ? "bg-primary text-primary-foreground" : "bg-secondary"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{pkg.name}</h4>
                          {pkg.popular && (
                            <Badge variant="default" className="bg-primary">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {pkg.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-lg font-bold text-primary">
                            ${pkg.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {pkg.duration}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pkg.features.slice(0, 3).map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {pkg.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{pkg.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(pkg)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDuplicate(pkg)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSetDeleteConfirm(pkg.id!)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Inactive Packages */}
      {inactivePackages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Inactive Packages ({inactivePackages.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-60">
            {inactivePackages.map((pkg) => {
              const Icon = iconComponents[pkg.icon] || Backpack;
              return (
                <Card key={pkg.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{pkg.name}</h4>
                            <Badge variant="outline">Inactive</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pkg.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(pkg)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSetDeleteConfirm(pkg.id!)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && onCancelEdit()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPackage ? 'Edit Package' : 'Create New Package'}
            </DialogTitle>
            <DialogDescription>
              Configure your package details, pricing, and features.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Package Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Comfort Stay"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ICONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            {iconComponents[icon.value] && (
                              <span className="w-4 h-4">
                                {(() => {
                                  const Icon = iconComponents[icon.value];
                                  return <Icon className="w-4 h-4" />;
                                })()}
                              </span>
                            )}
                            {icon.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this package includes..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="per night"
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

            {/* Features */}
            <div className="space-y-4">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature..."
                  onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                />
                <Button type="button" onClick={addFeature} variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{feature}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.popular}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
                />
                <div>
                  <Label className="cursor-pointer">Mark as Popular</Label>
                  <p className="text-xs text-muted-foreground">
                    This package will be highlighted on the booking form
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.name || !formData.description || formData.price <= 0}
            >
              <Check className="w-4 h-4 mr-2" />
              {selectedPackage ? 'Save Changes' : 'Create Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => onSetDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this package? This action cannot be undone.
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
              Delete Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
