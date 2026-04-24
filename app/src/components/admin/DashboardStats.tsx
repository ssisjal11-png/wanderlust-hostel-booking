import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Package,
  BedDouble,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BookingStats } from '@/types/admin';

interface DashboardStatsProps {
  stats: BookingStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      trend: '+12%',
      trendUp: true,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: '+8%',
      trendUp: true,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Clock,
      trend: '-3%',
      trendUp: false,
      color: 'bg-amber-500',
    },
    {
      title: 'Confirmed',
      value: stats.confirmedBookings,
      icon: CheckCircle,
      trend: '+15%',
      trendUp: true,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {card.trendUp ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={card.trendUp ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
                      {card.trend}
                    </span>
                    <span className="text-muted-foreground text-sm">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.color} bg-opacity-10 flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Booking Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${stats.averageBookingValue}</p>
                <p className="text-xs text-muted-foreground">Per reservation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Popular Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-lg font-bold">{stats.popularPackage}</p>
                <p className="text-xs text-muted-foreground">42% of bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Popular Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-lg font-bold">{stats.popularRoom}</p>
                <p className="text-xs text-muted-foreground">38% of bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancellation Rate */}
      <Card className="bg-red-50 border-red-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-red-900">Cancellation Rate</p>
                <p className="text-sm text-red-700">
                  {stats.cancelledBookings} bookings cancelled this month
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600">
                {((stats.cancelledBookings / stats.totalBookings) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-red-500">of total bookings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
