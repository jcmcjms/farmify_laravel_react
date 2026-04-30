import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { User, UserRole } from '@/types';
import { useAuth } from '@/lib/api';

export default function Dashboard() {
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

    const componentName = dashboardMap[role] || 'DashboardConsumer';

    return (
        <>
            <Head title="Dashboard" />
            <DynamicDashboard role={role} user={user} />
        </>
    );
}

interface DynamicDashboardProps {
    role: UserRole;
    user: User;
}

function DynamicDashboard({ role, user }: DynamicDashboardProps) {
    const stats = {
        farmer: [
            { label: 'Active Jobs', value: '5' },
            { label: 'Pending Orders', value: '12' },
            { label: 'This Month Earnings', value: '$2,450' },
            { label: 'Active Workers', value: '8' },
        ],
        farm_manager: [
            { label: 'Assigned Farms', value: '3' },
            { label: 'Total Workers', value: '24' },
            { label: 'Active Jobs', value: '8' },
            { label: 'Products', value: '45' },
        ],
        laborer: [
            { label: 'Applied Jobs', value: '3' },
            { label: 'Work Sessions', value: '12' },
            { label: 'Total Earnings', value: '$1,850' },
            { label: 'Success Rate', value: '92%' },
        ],
        consumer: [
            { label: 'Recent Orders', value: '8' },
            { label: 'Active Subscriptions', value: '2' },
            { label: 'Favorite Farms', value: '5' },
            { label: 'Total Spent', value: '$450' },
        ],
        rider: [
            { label: 'Available Deliveries', value: '4' },
            { label: 'Completed Today', value: '12' },
            { label: 'Today Earnings', value: '$85' },
            { label: 'Rating', value: '4.8' },
        ],
    };

    const roleStats = stats[role] || stats.consumer;
    const welcomeMessage = `Welcome back, ${user.name}!`;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{welcomeMessage}</h1>
                    <p className="text-muted-foreground">Here's what's happening with your farm today.</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {roleStats.map((stat, index) => (
                    <div
                        key={index}
                        className="rounded-lg border bg-card p-6 shadow-sm"
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 rounded-md p-2 hover:bg-muted">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-farm-primary/10">
                                <span className="text-farm-primary">📦</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">New order received</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-md p-2 hover:bg-muted">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-farm-secondary/10">
                                <span className="text-farm-secondary">👤</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">New worker application</p>
                                <p className="text-xs text-muted-foreground">5 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <button className="rounded-md border p-4 text-left transition-colors hover:bg-muted">
                            <p className="font-medium">Add New Product</p>
                            <p className="text-sm text-muted-foreground">List fresh produce</p>
                        </button>
                        <button className="rounded-md border p-4 text-left transition-colors hover:bg-muted">
                            <p className="font-medium">Post a Job</p>
                            <p className="text-sm text-muted-foreground">Find workers</p>
                        </button>
                        <button className="rounded-md border p-4 text-left transition-colors hover:bg-muted">
                            <p className="font-medium">View Orders</p>
                            <p className="text-sm text-muted-foreground">Manage deliveries</p>
                        </button>
                        <button className="rounded-md border p-4 text-left transition-colors hover:bg-muted">
                            <p className="font-medium">Browse Products</p>
                            <p className="text-sm text-muted-foreground">Shop fresh produce</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}