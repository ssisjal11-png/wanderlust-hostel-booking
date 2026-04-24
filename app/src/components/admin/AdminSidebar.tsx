import { 
  LayoutDashboard, 
  Package, 
  BedDouble, 
  Calendar, 
  CalendarDays,
  Settings, 
  Eye,
  Users,
  User,
  LogOut,
  Save,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AdminTab } from '@/types/admin';
import { adminNavItems } from '@/data/adminData';

const iconMap = {
  LayoutDashboard,
  Package,
  BedDouble,
  Calendar,
  CalendarDays,
  Settings,
  Eye,
  Users,
  User,
};

interface AdminSidebarProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onLogout: () => void;
}

export function AdminSidebar({ 
  currentTab, 
  onTabChange, 
  hasUnsavedChanges,
  onSave,
  onLogout
}: AdminSidebarProps) {
  return (
    <div className="w-full lg:w-72 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white">
              Admin Panel
            </h1>
            <p className="text-xs text-slate-400">Wanderlust Hostel</p>
          </div>
        </div>
      </div>

      {/* Save Status */}
      {hasUnsavedChanges && (
        <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Unsaved changes</span>
          </div>
          <Button 
            size="sm" 
            className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white"
            onClick={onSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {adminNavItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as AdminTab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                isActive ? "text-primary-foreground" : "text-slate-500"
              )} />
              <div className="flex-1">
                <p className={cn(
                  "font-medium text-sm",
                  isActive ? "text-primary-foreground" : "text-slate-300"
                )}>
                  {item.label}
                </p>
                <p className={cn(
                  "text-xs",
                  isActive ? "text-primary-foreground/70" : "text-slate-500"
                )}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Exit Admin
        </Button>
        <p className="text-xs text-slate-600 mt-4 text-center">
          v2.0.0 • Admin Dashboard
        </p>
      </div>
    </div>
  );
}
