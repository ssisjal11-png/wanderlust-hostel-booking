import { Package, Bed, Calendar, CheckCircle, ChevronRight } from 'lucide-react';
import type { BookingStep } from '@/types/booking';
import { stepConfig } from '@/data/bookingData';
import { cn } from '@/lib/utils';

const iconMap = {
  Package,
  Bed,
  Calendar,
  CheckCircle
};

interface SidebarProps {
  currentStep: BookingStep;
  completedSteps: Set<BookingStep>;
  onStepClick: (step: BookingStep) => void;
}

export function Sidebar({ currentStep, completedSteps, onStepClick }: SidebarProps) {
  return (
    <div className="w-full lg:w-80 bg-sidebar text-sidebar-foreground p-6 lg:p-8 lg:min-h-screen">
      {/* Logo / Brand */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Bed className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-sidebar-foreground">
              Wanderlust
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Hostel & Suites</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-sidebar-foreground/70">Progress</span>
          <span className="text-primary font-medium">
            {stepConfig.findIndex(s => s.id === currentStep) + 1} of {stepConfig.length}
          </span>
        </div>
        <div className="h-2 bg-sidebar-accent rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ 
              width: `${((stepConfig.findIndex(s => s.id === currentStep) + 1) / stepConfig.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Steps Navigation */}
      <nav className="space-y-2">
        <p className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-4">
          Booking Steps
        </p>
        {stepConfig.map((step, index) => {
          const Icon = iconMap[step.icon as keyof typeof iconMap];
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.has(step.id);
          const isClickable = isCompleted || index <= stepConfig.findIndex(s => s.id === currentStep);

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left",
                isActive && "bg-sidebar-primary shadow-lg shadow-black/20",
                isCompleted && !isActive && "bg-sidebar-accent/50",
                !isActive && !isCompleted && isClickable && "hover:bg-sidebar-accent/30",
                !isClickable && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                isActive && "bg-primary text-primary-foreground",
                isCompleted && !isActive && "bg-accent text-accent-foreground",
                !isActive && !isCompleted && "bg-sidebar-accent text-sidebar-foreground/60"
              )}>
                {isCompleted && !isActive ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium text-sm transition-colors",
                  isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground"
                )}>
                  {step.label}
                </p>
                <p className={cn(
                  "text-xs truncate transition-colors",
                  isActive ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/50"
                )}>
                  {step.description}
                </p>
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-sidebar-primary-foreground animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Contact Info */}
      <div className="mt-auto pt-8 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 mb-3">Need help?</p>
        <div className="space-y-2 text-sm">
          <p className="text-sidebar-foreground/80">📞 +1 (555) 123-4567</p>
          <p className="text-sidebar-foreground/80">✉️ booking@wanderlust.com</p>
        </div>
      </div>
    </div>
  );
}
