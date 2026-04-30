import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Package, 
    Users, 
    ShoppingCart, 
    Truck, 
    Store, 
    Clock, 
    DollarSign,
    ArrowRight,
    Plus,
    Calendar,
    MapPin,
    TrendingUp,
    Star
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/api';
import type { User, UserRole, Job, Order, Product, Delivery } from '@/types';

interface DashboardProps {
    stats?: {
        activeJobs?: number;
        pendingOrders?: number;
        earnings?: number;
        activeWorkers?: number;
        availableJobs?: number;
        applications?: number;
        totalEarnings?: number;
        recentOrders?: number;
        subscriptions?: number;
        favoriteFarms?: number;
        totalSpent?: number;
        availableDeliveries?: number;
        todayDeliveries?: number;
        rating?: number;
    };
    recentJobs?: Job[];
    recentOrders?: Order[];
    availableJobs?: Job[];
    myApplications?: { job: Job; status: string }[];
    products?: Product[];
    deliveries?: Delivery[];
}

export default function Dashboard({ 
    stats = {},
    recentJobs = [],
    recentOrders = [],
    availableJobs = [],
    myApplications = [],
    products = [],
    deliveries = []
}: DashboardProps) {
    const auth = useAuth();
    const user = auth?.user;
    
    if (!user) {
        return <div>Loading...</div>;
    }

    const role = user.role || 'consumer';

    const dashboardMap: Record<UserRole, string> = {
        farmer: 'DashboardFarmer',
        farm_manager: 'DashboardFarmManager',
        laborer: 'DashboardLaborer',
        consumer: 'DashboardConsumer',
        rider: 'DashboardRider',
    };

    return (
        <>
            <Head title="Dashboard" />
            {role === 'farmer' && <FarmerDashboard stats={stats} recentJobs={recentJobs} recentOrders={recentOrders} products={products} user={user} />}
            {role === 'farm_manager' && <FarmManagerDashboard stats={stats} recentJobs={recentJobs} products={products} user={user} />}
            {role === 'laborer' && <LaborerDashboard stats={stats} availableJobs={availableJobs} myApplications={myApplications} user={user} />}
            {role === 'consumer' && <ConsumerDashboard stats={stats} recentOrders={recentOrders} user={user} />}
            {role === 'rider' && <RiderDashboard stats={stats} deliveries={deliveries} user={user} />}
        </>
    );
}

interface FarmerDashboardProps {
    stats: Record<string, number>;
    recentJobs: Job[];
    recentOrders: Order[];
    products: Product[];
    user: User;
}

function FarmerDashboard({ stats, recentJobs, recentOrders, products, user }: FarmerDashboardProps) {
    const activeJobs = stats.activeJobs ?? 5;
    const pendingOrders = stats.pendingOrders ?? 12;
    const earnings = stats.earnings ?? 2450;
    const activeWorkers = stats.activeWorkers ?? 8;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
                    <p className="text-muted-foreground">Here's what's happening with your farm today.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/jobs/create">Post Job</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Jobs</p>
                                <p className="text-2xl font-bold mt-1">{activeJobs}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Orders</p>
                                <p className="text-2xl font-bold mt-1">{pendingOrders}</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <ShoppingCart className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-2xl font-bold mt-1">${earnings.toLocaleString()}</p>
                            </div>
                            <div className="rounded-full bg-farm-primary/10 p-3">
                                <DollarSign className="h-5 w-5 text-farm-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Workers</p>
                                <p className="text-2xl font-bold mt-1">{activeWorkers}</p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/orders">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No recent orders</p>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.slice(0, 4).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                        <div>
                                            <p className="font-medium">Order #{order.order_number}</p>
                                            <p className="text-sm text-muted-foreground">{order.items?.length} items</p>
                                        </div>
                                        <Badge variant="secondary">{order.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Active Jobs</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/jobs">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentJobs.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No active jobs</p>
                        ) : (
                            <div className="space-y-3">
                                {recentJobs.slice(0, 4).map((job) => (
                                    <div key={job.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                        <div>
                                            <p className="font-medium">{job.title}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Users className="h-3 w-3" /> {job.applicant_count} applicants
                                            </p>
                                        </div>
                                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                                            {job.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                            <Link href="/products/create">
                                <Plus className="h-5 w-5" />
                                <span>Add Product</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                            <Link href="/jobs/create">
                                <Users className="h-5 w-5" />
                                <span>Post a Job</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                            <Link href="/products">
                                <Package className="h-5 w-5" />
                                <span>Manage Products</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                            <Link href="/farms">
                                <Store className="h-5 w-5" />
                                <span>My Farm</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface LaborerDashboardProps {
    stats: Record<string, number>;
    availableJobs: Job[];
    myApplications: { job: Job; status: string }[];
    user: User;
}

function LaborerDashboard({ stats, availableJobs, myApplications, user }: LaborerDashboardProps) {
    const availableJobsCount = stats.availableJobs ?? 4;
    const myApplicationsCount = stats.applications ?? 3;
    const totalEarnings = stats.totalEarnings ?? 1850;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
                    <p className="text-muted-foreground">Find work opportunities and track your earnings.</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Available Jobs</p>
                                <p className="text-2xl font-bold mt-1">{availableJobsCount}</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <Briefcase className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">My Applications</p>
                                <p className="text-2xl font-bold mt-1">{myApplicationsCount}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Earnings</p>
                                <p className="text-2xl font-bold mt-1">${totalEarnings.toLocaleString()}</p>
                            </div>
                            <div className="rounded-full bg-farm-primary/10 p-3">
                                <DollarSign className="h-5 w-5 text-farm-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Available Jobs</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/jobs">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {availableJobs.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No jobs available</p>
                        ) : (
                            <div className="space-y-3">
                                {availableJobs.slice(0, 4).map((job) => (
                                    <div key={job.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                        <div>
                                            <p className="font-medium">{job.title}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {job.farm?.name}
                                            </p>
                                        </div>
                                        <Button size="sm">Apply</Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>My Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {myApplications.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No applications yet</p>
                        ) : (
                            <div className="space-y-3">
                                {myApplications.slice(0, 4).map((app) => (
                                    <div key={app.job.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                        <div>
                                            <p className="font-medium">{app.job.title}</p>
                                            <p className="text-sm text-muted-foreground">{app.job.farm?.name}</p>
                                        </div>
                                        <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                                            {app.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

interface ConsumerDashboardProps {
    stats: Record<string, number>;
    recentOrders: Order[];
    user: User;
}

function ConsumerDashboard({ stats, recentOrders, user }: ConsumerDashboardProps) {
    const recentOrdersCount = stats.recentOrders ?? 8;
    const subscriptions = stats.subscriptions ?? 2;
    const favoriteFarms = stats.favoriteFarms ?? 5;
    const totalSpent = stats.totalSpent ?? 450;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
                    <p className="text-muted-foreground">Your fresh produce is just a few clicks away.</p>
                </div>
                <Button asChild>
                    <Link href="/consumer/catalog">
                        <Store className="mr-2 h-4 w-4" />
                        Browse Products
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Recent Orders</p>
                                <p className="text-2xl font-bold mt-1">{recentOrdersCount}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                                <p className="text-2xl font-bold mt-1">{subscriptions}</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Favorite Farms</p>
                                <p className="text-2xl font-bold mt-1">{favoriteFarms}</p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <Store className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                                <p className="text-2xl font-bold mt-1">${totalSpent}</p>
                            </div>
                            <div className="rounded-full bg-farm-primary/10 p-3">
                                <DollarSign className="h-5 w-5 text-farm-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/consumer/orders">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No orders yet</p>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.slice(0, 4).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                        <div>
                                            <p className="font-medium">Order #{order.order_number}</p>
                                            <p className="text-sm text-muted-foreground">{order.items?.length} items - ${order.total.toFixed(2)}</p>
                                        </div>
                                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                                <Link href="/consumer/catalog">
                                    <Store className="h-5 w-5" />
                                    <span>Browse Products</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                                <Link href="/consumer/cart">
                                    <ShoppingCart className="h-5 w-5" />
                                    <span>View Cart</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                                <Link href="/consumer/orders">
                                    <Package className="h-5 w-5" />
                                    <span>My Orders</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                                <Link href="/consumer/subscriptions">
                                    <Calendar className="h-5 w-5" />
                                    <span>Subscriptions</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

interface RiderDashboardProps {
    stats: Record<string, number>;
    deliveries: Delivery[];
    user: User;
}

function RiderDashboard({ stats, deliveries, user }: RiderDashboardProps) {
    const availableDeliveries = stats.availableDeliveries ?? 4;
    const todayDeliveries = stats.todayDeliveries ?? 12;
    const todayEarnings = stats.todayEarnings ?? 85;
    const rating = stats.rating ?? 4.8;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
                    <p className="text-muted-foreground">Ready for your next delivery?</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Available</p>
                                <p className="text-2xl font-bold mt-1">{availableDeliveries}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed Today</p>
                                <p className="text-2xl font-bold mt-1">{todayDeliveries}</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <Truck className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Today Earnings</p>
                                <p className="text-2xl font-bold mt-1">${todayEarnings}</p>
                            </div>
                            <div className="rounded-full bg-farm-primary/10 p-3">
                                <DollarSign className="h-5 w-5 text-farm-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Rating</p>
                                <p className="text-2xl font-bold mt-1 flex items-center gap-1">
                                    {rating} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                </p>
                            </div>
                            <div className="rounded-full bg-yellow-100 p-3">
                                <Star className="h-5 w-5 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Today's Deliveries</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/rider/deliveries">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {deliveries.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No deliveries assigned</p>
                        ) : (
                            <div className="space-y-3">
                                {deliveries.slice(0, 4).map((delivery) => (
                                    <div key={delivery.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                        <div>
                                            <p className="font-medium">Order #{delivery.order?.order_number}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {delivery.delivery_address}
                                            </p>
                                        </div>
                                        <Badge variant={delivery.status === 'delivered' ? 'default' : 'secondary'}>
                                            {delivery.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Earnings Summary</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/rider/earnings">View Details <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                <span className="text-muted-foreground">This Week</span>
                                <span className="font-bold">$425.00</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                <span className="text-muted-foreground">This Month</span>
                                <span className="font-bold">$1,850.00</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md bg-green-50">
                                <span className="text-muted-foreground">Pending Payout</span>
                                <span className="font-bold text-green-600">$75.00</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

interface FarmManagerDashboardProps {
    stats: Record<string, number>;
    recentJobs: Job[];
    products: Product[];
    user: User;
}

function FarmManagerDashboard({ stats, recentJobs, products, user }: FarmManagerDashboardProps) {
    const assignedFarms = stats.activeJobs ?? 3;
    const totalWorkers = stats.activeWorkers ?? 24;
    const activeJobs = stats.activeJobs ?? 8;
    const productsCount = stats.earnings ?? 45;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
                    <p className="text-muted-foreground">Manage your farms and coordinate operations.</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Assigned Farms</p>
                                <p className="text-2xl font-bold mt-1">{assignedFarms}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Store className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Workers</p>
                                <p className="text-2xl font-bold mt-1">{totalWorkers}</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Jobs</p>
                                <p className="text-2xl font-bold mt-1">{activeJobs}</p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <Briefcase className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Products</p>
                                <p className="text-2xl font-bold mt-1">{productsCount}</p>
                            </div>
                            <div className="rounded-full bg-farm-primary/10 p-3">
                                <Package className="h-5 w-5 text-farm-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Active Jobs</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/jobs">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentJobs.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No active jobs</p>
                        ) : (
                            <div className="space-y-3">
                                {recentJobs.slice(0, 4).map((job) => (
                                    <div key={job.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                        <div>
                                            <p className="font-medium">{job.title}</p>
                                            <p className="text-sm text-muted-foreground">{job.farm?.name}</p>
                                        </div>
                                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                                            {job.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                                <Link href="/farms">
                                    <Store className="h-5 w-5" />
                                    <span>View Farms</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                                <Link href="/jobs">
                                    <Briefcase className="h-5 w-5" />
                                    <span>Manage Jobs</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                                <Link href="/products">
                                    <Package className="h-5 w-5" />
                                    <span>Products</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                                <Link href="/settings">
                                    <Users className="h-5 w-5" />
                                    <span>Workers</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function Briefcase({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={className}
        >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function FileText({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}