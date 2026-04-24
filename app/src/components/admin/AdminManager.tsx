import { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Lock,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import type { AdminUser, AdminPermissions } from '@/types/admin';
import { ADMIN_ROLES, DEPARTMENTS } from '@/types/admin';

interface AdminManagerProps {
  admins: AdminUser[];
  currentAdmin: AdminUser;
  isEditing: boolean;
  selectedAdmin: AdminUser | null;
  showDeleteConfirm: string | null;
  onCreate: (admin: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  onUpdate: (id: string, admin: Partial<AdminUser>) => void;
  onDelete: (id: string) => void;
  onStartEdit: (admin: AdminUser) => void;
  onStartCreate: () => void;
  onCancelEdit: () => void;
  onSetDeleteConfirm: (id: string | null) => void;
}

const defaultPermissions: AdminPermissions = {
  dashboard: true,
  packages: { view: true, create: false, edit: false, delete: false },
  rooms: { view: true, create: false, edit: false, delete: false },
  bookings: { view: true, create: true, edit: false, delete: false, confirm: false, cancel: false },
  calendar: { view: true, edit: false },
  settings: { view: false, edit: false },
  admins: { view: false, create: false, edit: false, delete: false },
  reports: false,
};

const rolePermissions: Record<string, Partial<AdminPermissions>> = {
  superadmin: {
    dashboard: true,
    packages: { view: true, create: true, edit: true, delete: true },
    rooms: { view: true, create: true, edit: true, delete: true },
    bookings: { view: true, create: true, edit: true, delete: true, confirm: true, cancel: true },
    calendar: { view: true, edit: true },
    settings: { view: true, edit: true },
    admins: { view: true, create: true, edit: true, delete: true },
    reports: true,
  },
  admin: {
    dashboard: true,
    packages: { view: true, create: true, edit: true, delete: false },
    rooms: { view: true, create: true, edit: true, delete: false },
    bookings: { view: true, create: true, edit: true, delete: false, confirm: true, cancel: true },
    calendar: { view: true, edit: true },
    settings: { view: true, edit: true },
    admins: { view: true, create: false, edit: false, delete: false },
    reports: true,
  },
  manager: {
    dashboard: true,
    packages: { view: true, create: true, edit: true, delete: false },
    rooms: { view: true, create: true, edit: true, delete: false },
    bookings: { view: true, create: true, edit: true, delete: false, confirm: true, cancel: true },
    calendar: { view: true, edit: true },
    settings: { view: true, edit: false },
    admins: { view: false, create: false, edit: false, delete: false },
    reports: true,
  },
  staff: {
    dashboard: true,
    packages: { view: true, create: false, edit: false, delete: false },
    rooms: { view: true, create: false, edit: false, delete: false },
    bookings: { view: true, create: true, edit: true, delete: false, confirm: false, cancel: false },
    calendar: { view: true, edit: false },
    settings: { view: false, edit: false },
    admins: { view: false, create: false, edit: false, delete: false },
    reports: false,
  },
};

export function AdminManager({
  admins,
  currentAdmin,
  isEditing,
  selectedAdmin,
  showDeleteConfirm,
  onCreate,
  onUpdate,
  onDelete,
  onStartEdit,
  onStartCreate,
  onCancelEdit,
  onSetDeleteConfirm,
}: AdminManagerProps) {
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    department: 'frontdesk',
    status: 'active',
    permissions: { ...defaultPermissions },
    twoFactorEnabled: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleStartEdit = (admin: AdminUser) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      department: admin.department,
      status: admin.status,
      permissions: { ...admin.permissions },
      twoFactorEnabled: admin.twoFactorEnabled,
    });
    setPassword('');
    onStartEdit(admin);
  };

  const handleStartCreate = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'staff',
      department: 'frontdesk',
      status: 'active',
      permissions: { ...defaultPermissions },
      twoFactorEnabled: false,
    });
    setPassword('');
    onStartCreate();
  };

  const handleSave = () => {
    const adminData = {
      ...formData,
      avatar: '',
    } as Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>;

    if (selectedAdmin) {
      onUpdate(selectedAdmin.id, adminData);
    } else {
      onCreate(adminData);
    }
  };

  const handleRoleChange = (role: string) => {
    const permissions = rolePermissions[role] || defaultPermissions;
    setFormData(prev => ({
      ...prev,
      role: role as AdminUser['role'],
      permissions: { ...defaultPermissions, ...permissions },
    }));
  };

  const updatePermission = (section: keyof AdminPermissions, key: string, value: boolean) => {
    setFormData(prev => {
      const currentSection = prev.permissions?.[section];
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [section]: typeof currentSection === 'object' && currentSection !== null
            ? { ...(currentSection as Record<string, boolean>), [key]: value }
            : value,
        } as AdminPermissions,
      };
    });
  };

  const canManageAdmins = currentAdmin.role === 'superadmin' || 
    (currentAdmin.permissions.admins?.create && currentAdmin.permissions.admins?.edit);

  const activeAdmins = admins.filter(a => a.status === 'active');
  const inactiveAdmins = admins.filter(a => a.status !== 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Management</h2>
          <p className="text-muted-foreground">
            Manage admin users and their permissions
          </p>
        </div>
        {canManageAdmins && (
          <Button onClick={handleStartCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Admin
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Admins</p>
            <p className="text-2xl font-bold">{admins.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-500">{activeAdmins.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Super Admins</p>
            <p className="text-2xl font-bold">{admins.filter(a => a.role === 'superadmin').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">With 2FA</p>
            <p className="text-2xl font-bold">{admins.filter(a => a.twoFactorEnabled).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Admins */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Active Admins ({activeAdmins.length})
        </h3>
        <div className="space-y-3">
          {activeAdmins.map((admin) => (
            <Card key={admin.id} className="group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{admin.name}</h4>
                        <Badge variant={admin.role === 'superadmin' ? 'default' : 'secondary'}>
                          <Shield className="w-3 h-3 mr-1" />
                          {ADMIN_ROLES.find(r => r.value === admin.role)?.label}
                        </Badge>
                        {admin.twoFactorEnabled && (
                          <Badge variant="outline" className="text-green-600">
                            <Lock className="w-3 h-3 mr-1" />
                            2FA
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {admin.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {admin.phone}
                        </span>
                        <span>{DEPARTMENTS.find(d => d.value === admin.department)?.label}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Last login: {admin.lastLogin === '-' ? 'Never' : new Date(admin.lastLogin).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canManageAdmins && admin.id !== currentAdmin.id && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(admin)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSetDeleteConfirm(admin.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Inactive Admins */}
      {inactiveAdmins.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Inactive/Suspended ({inactiveAdmins.length})
          </h3>
          <div className="space-y-3 opacity-60">
            {inactiveAdmins.map((admin) => (
              <Card key={admin.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{admin.name}</h4>
                          <Badge variant="outline" className="text-destructive">
                            {admin.status === 'suspended' ? 'Suspended' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                    {canManageAdmins && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(admin)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSetDeleteConfirm(admin.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    )}
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
              {selectedAdmin ? 'Edit Admin' : 'Create New Admin'}
            </DialogTitle>
            <DialogDescription>
              Configure admin details and permissions.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@wanderlust.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 555-0000"
                  />
                </div>
                {!selectedAdmin && (
                  <div className="space-y-2">
                    <Label>Password *</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ADMIN_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {ADMIN_ROLES.find(r => r.value === formData.role)?.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as AdminUser['status'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.twoFactorEnabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, twoFactorEnabled: checked }))}
                />
                <div>
                  <Label className="cursor-pointer">Enable Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">
                    Requires admin to verify with phone or email on login
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4 py-4">
              <div className="space-y-4">
                {/* Dashboard */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Dashboard</p>
                    <p className="text-xs text-muted-foreground">View analytics and statistics</p>
                  </div>
                  <Switch
                    checked={formData.permissions?.dashboard}
                    onCheckedChange={(checked) => updatePermission('dashboard', '', checked)}
                  />
                </div>

                {/* Packages */}
                <div className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Packages</p>
                      <p className="text-xs text-muted-foreground">Manage booking packages</p>
                    </div>
                    <Switch
                      checked={formData.permissions?.packages?.view}
                      onCheckedChange={(checked) => updatePermission('packages', 'view', checked)}
                    />
                  </div>
                  {formData.permissions?.packages?.view && (
                    <div className="flex gap-4 pl-4">
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.packages?.create}
                          onCheckedChange={(checked) => updatePermission('packages', 'create', checked as boolean)}
                        />
                        <span className="text-sm">Create</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.packages?.edit}
                          onCheckedChange={(checked) => updatePermission('packages', 'edit', checked as boolean)}
                        />
                        <span className="text-sm">Edit</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.packages?.delete}
                          onCheckedChange={(checked) => updatePermission('packages', 'delete', checked as boolean)}
                        />
                        <span className="text-sm">Delete</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Rooms */}
                <div className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rooms</p>
                      <p className="text-xs text-muted-foreground">Manage room types</p>
                    </div>
                    <Switch
                      checked={formData.permissions?.rooms?.view}
                      onCheckedChange={(checked) => updatePermission('rooms', 'view', checked)}
                    />
                  </div>
                  {formData.permissions?.rooms?.view && (
                    <div className="flex gap-4 pl-4">
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.rooms?.create}
                          onCheckedChange={(checked) => updatePermission('rooms', 'create', checked as boolean)}
                        />
                        <span className="text-sm">Create</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.rooms?.edit}
                          onCheckedChange={(checked) => updatePermission('rooms', 'edit', checked as boolean)}
                        />
                        <span className="text-sm">Edit</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.rooms?.delete}
                          onCheckedChange={(checked) => updatePermission('rooms', 'delete', checked as boolean)}
                        />
                        <span className="text-sm">Delete</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Bookings */}
                <div className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Bookings</p>
                      <p className="text-xs text-muted-foreground">Manage reservations</p>
                    </div>
                    <Switch
                      checked={formData.permissions?.bookings?.view}
                      onCheckedChange={(checked) => updatePermission('bookings', 'view', checked)}
                    />
                  </div>
                  {formData.permissions?.bookings?.view && (
                    <div className="flex flex-wrap gap-4 pl-4">
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.bookings?.create}
                          onCheckedChange={(checked) => updatePermission('bookings', 'create', checked as boolean)}
                        />
                        <span className="text-sm">Create</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.bookings?.edit}
                          onCheckedChange={(checked) => updatePermission('bookings', 'edit', checked as boolean)}
                        />
                        <span className="text-sm">Edit</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.bookings?.delete}
                          onCheckedChange={(checked) => updatePermission('bookings', 'delete', checked as boolean)}
                        />
                        <span className="text-sm">Delete</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.bookings?.confirm}
                          onCheckedChange={(checked) => updatePermission('bookings', 'confirm', checked as boolean)}
                        />
                        <span className="text-sm">Confirm</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions?.bookings?.cancel}
                          onCheckedChange={(checked) => updatePermission('bookings', 'cancel', checked as boolean)}
                        />
                        <span className="text-sm">Cancel</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Admin Management */}
                {currentAdmin.role === 'superadmin' && (
                  <div className="p-3 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Admin Management</p>
                        <p className="text-xs text-muted-foreground">Manage other admin users</p>
                      </div>
                      <Switch
                        checked={formData.permissions?.admins?.view}
                        onCheckedChange={(checked) => updatePermission('admins', 'view', checked)}
                      />
                    </div>
                    {formData.permissions?.admins?.view && (
                      <div className="flex gap-4 pl-4">
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.permissions?.admins?.create}
                            onCheckedChange={(checked) => updatePermission('admins', 'create', checked as boolean)}
                          />
                          <span className="text-sm">Create</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.permissions?.admins?.edit}
                            onCheckedChange={(checked) => updatePermission('admins', 'edit', checked as boolean)}
                          />
                          <span className="text-sm">Edit</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.permissions?.admins?.delete}
                            onCheckedChange={(checked) => updatePermission('admins', 'delete', checked as boolean)}
                          />
                          <span className="text-sm">Delete</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.name || !formData.email || (!selectedAdmin && !password)}
            >
              <Check className="w-4 h-4 mr-2" />
              {selectedAdmin ? 'Save Changes' : 'Create Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => onSetDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this admin user? This action cannot be undone.
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
              Delete Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
