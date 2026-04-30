import { Head, Link } from '@inertiajs/react';
import { 
    DollarSign, 
    TrendingUp, 
    Clock, 
    Calendar,
    Package,
    Truck,
    ChevronRight,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Delivery } from '@/types';

interface EarningsPageProps {
    earnings: {
        total_earnings: number;
        pending_earnings: number;
        completed_deliveries: number;
        today_earnings: number;
        this_week: number;
        this_month: number;
    };
    deliveries: Delivery[];
    weeklyData?: { day: string; amount: number }[];
}

export default function RiderEarningsPage({ 
    earnings = {
        total_earnings: 0,
        pending_earnings: 0,
        completed_deliveries: 0,
        today_earnings: 0,
        this_week: 0,
        this_month: 0,
    }, 
    deliveries = [],
    weeklyData = []
}: EarningsPageProps) {
    const [timeFilter, setTimeFilter] = useState<string>('week');

    const completedDeliveries = deliveries.filter(d => d.status === 'delivered');
    const pendingDeliveries = deliveries.filter(d => ['assigned', 'accepted', 'picked_up', 'in_transit'].includes(d.status));

    const mockWeeklyData = [
        { day: 'Mon', amount: 45 },
        { day: 'Tue', amount: 32 },
        { day: 'Wed', amount: 58 },
        { day: 'Thu', amount: 40 },
        { day: 'Fri', amount: 65 },
        { day: 'Sat', amount: 52 },
        { day: 'Sun', amount: 28 },
    ];

    const displayData = weeklyData.length > 0 ? weeklyData : mockWeeklyData;
    const maxAmount = Math.max(...displayData.map(d => d.amount), 1);

    return (
        <>
            <Head title="Earnings" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Earnings</h1>
                        <p className="text-muted-foreground">Track your delivery earnings</p>
                    </div>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-farm-primary to-farm-primary/80 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/80 text-sm">Total Earnings</p>
                                    <p className="text-3xl font-bold mt-1">${earnings.total_earnings.toFixed(2)}</p>
                                </div>
                                <div className="rounded-full bg-white/20 p-3">
                                    <Wallet className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-sm text-white/80">
                                <ArrowUpRight className="h-4 w-4" />
                                <span>+12% from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm">Today</p>
                                    <p className="text-2xl font-bold mt-1">${earnings.today_earnings.toFixed(2)}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{earnings.completed_deliveries} deliveries</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm">This Week</p>
                                    <p className="text-2xl font-bold mt-1">${earnings.this_week.toFixed(2)}</p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {completedDeliveries.filter(d => isThisWeek(new Date(d.updated_at))).length} deliveries
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm">This Month</p>
                                    <p className="text-2xl font-bold mt-1">${earnings.this_month.toFixed(2)}</p>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3">
                                    <DollarSign className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Pending: ${earnings.pending_earnings.toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Earnings Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-end justify-between gap-2">
                                {displayData.map((day) => (
                                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                        <div 
                                            className="w-full bg-farm-primary rounded-t-md transition-all hover:bg-farm-primary/80"
                                            style={{ height: `${(day.amount / maxAmount) * 200}px` }}
                                        />
                                        <span className="text-xs text-muted-foreground">{day.day}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Average per delivery: </span>
                                    <span className="font-medium">${(earnings.total_earnings / Math.max(earnings.completed_deliveries, 1)).toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Best day: </span>
                                    <span className="font-medium">${Math.max(...displayData.map(d => d.amount)).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-green-100 p-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <span className="text-sm">Completed</span>
                                </div>
                                <span className="font-semibold">{earnings.completed_deliveries}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-blue-100 p-2">
                                        <Truck className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm">In Progress</span>
                                </div>
                                <span className="font-semibold">{pendingDeliveries.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-yellow-100 p-2">
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                    </div>
                                    <span className="text-sm">Pending Payout</span>
                                </div>
                                <span className="font-semibold">${earnings.pending_earnings.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Completed Deliveries</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/rider/deliveries">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {completedDeliveries.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No completed deliveries yet</p>
                        ) : (
                            <div className="space-y-3">
                                {completedDeliveries.slice(0, 5).map((delivery) => (
                                    <div key={delivery.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-green-100 p-2">
                                                <Package className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Order #{delivery.order?.order_number}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {delivery.order?.items?.[0]?.product?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-farm-primary">$5.00</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(delivery.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function isThisWeek(date: Date): boolean {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    return date >= weekStart && date < weekEnd;
}