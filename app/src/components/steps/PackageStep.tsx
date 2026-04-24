import { Backpack, BedDouble, Crown, Users, Check, Star } from 'lucide-react';
import type { Package } from '@/types/booking';
import { packages } from '@/data/bookingData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const iconMap = {
  Backpack,
  BedDouble,
  Crown,
  Users
};

interface PackageStepProps {
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package) => void;
  onNext: () => void;
}

export function PackageStep({ selectedPackage, onSelectPackage, onNext }: PackageStepProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-foreground mb-2">
          Choose Your Package
        </h2>
        <p className="text-muted-foreground">
          Select the perfect package that fits your travel style and budget
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg, index) => {
          const Icon = iconMap[pkg.icon as keyof typeof iconMap];
          const isSelected = selectedPackage?.id === pkg.id;

          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className={cn(
                "relative group cursor-pointer rounded-2xl p-6 transition-all duration-300",
                "border-2 bg-card shadow-card hover:shadow-soft",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-transparent hover:border-primary/30"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Selection Indicator */}
              <div className={cn(
                "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                isSelected 
                  ? "border-primary bg-primary" 
                  : "border-muted-foreground/30"
              )}>
                {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                )}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pkg.description}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="font-display text-3xl font-bold text-primary">
                  ${pkg.price}
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  {pkg.duration}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Next Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedPackage}
          size="lg"
          className="px-8"
        >
          Continue to Rooms
        </Button>
      </div>
    </div>
  );
}
