import { Head, Link } from '@inertiajs/react';
import { 
    Package, 
    Calendar, 
    Clock, 
    Pause, 
    Play, 
    XCircle, 
    Plus,
    Store,
    Truck,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Subscription, SubscriptionStatus, SubscriptionFrequency } from '@/types';

interface SubscriptionsPageProps {
    subscriptions: Subscription[];
}

const statusLabels: Record<SubscriptionStatus, { label: string; color: string }> = {
    active: { label: 'Active', color: 'bg-green-100 text-green-800' },
    paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    expired: { label: 'Expired', color: 'bg-gray-100 text-gray-800' },
};

const frequencyLabels: Record<SubscriptionFrequency, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Every 2 Weeks',
    monthly: 'Monthly',
};

export default function SubscriptionsPage({ subscriptions = [] }: SubscriptionsPageProps) {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showNewDialog, setShowNewDialog] = useState(false);

    const filteredSubscriptions = subscriptions.filter((sub) => {
        return statusFilter === 'all' || sub.status === statusFilter;
    });

    const activeCount = subscriptions.filter(s => s.status === 'active').length;
    const pausedCount = subscriptions.filter(s => s.status === 'paused').length;

    return (
        <>
            <Head title="My Subscriptions" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Delivery Subscriptions</h1>
                        <p className="text-muted-foreground">Manage your recurring deliveries</p>
                    </div>
                    <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Subscription
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Subscription</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <p className="text-muted-foreground">
                                    Browse our farms and products to set up recurring deliveries of your favorite fresh produce.
                                </p>
                                <Button asChild>
                                    <Link href="/consumer/catalog" onClick={() => setShowNewDialog(false)}>
                                        Browse Products
                                    </Link>
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-100 p-2">
                                    <Package className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{activeCount}</p>
                                    <p className="text-sm text-muted-foreground">Active</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-yellow-100 p-2">
                                    <Pause className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{pausedCount}</p>
                                    <p className="text-sm text-muted-foreground">Paused</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-farm-primary/10 p-2">
                                    <Truck className="h-5 w-5 text-farm-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{subscriptions.length}</p>
                                    <p className="text-sm text-muted-foreground">Total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subscriptions</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {filteredSubscriptions.length === 0 ? (
                    <EmptyState
                        icon={<Package className="h-12 w-12" />}
                        title="No subscriptions found"
                        description={statusFilter !== 'all' ? "No subscriptions match the selected status." : "You don't have any delivery subscriptions yet."}
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredSubscriptions.map((subscription) => (
                            <SubscriptionCard key={subscription.id} subscription={subscription} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

interface SubscriptionCardProps {
    subscription: Subscription;
}

function SubscriptionCard({ subscription }: SubscriptionCardProps) {
    const statusInfo = statusLabels[subscription.status];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium">{subscription.product.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Store className="h-3 w-3" />
                            {subscription.farm?.name || 'Farm'}
                        </p>
                    </div>
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-medium">{frequencyLabels[subscription.frequency]}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{subscription.quantity} {subscription.product.unit}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">${subscription.price.toFixed(2)}/{subscription.frequency === 'monthly' ? 'mo' : 'delivery'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Started</p>
                        <p className="font-medium">{formatDate(subscription.start_date)}</p>
                    </div>
                </div>

                {subscription.next_delivery && subscription.status === 'active' && (
                    <div className="flex items-center gap-2 rounded-md bg-green-50 p-2 text-sm">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">
                            Next delivery: {formatDate(subscription.next_delivery)}
                        </span>
                    </div>
                )}

                {subscription.end_date && (
                    <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Ends: {formatDate(subscription.end_date)}
                        </span>
                    </div>
                )}

                <div className="flex gap-2">
                    {subscription.status === 'active' && (
                        <Button variant="outline" size="sm" className="flex-1">
                            <Pause className="mr-1 h-3 w-3" />
                            Pause
                        </Button>
                    )}
                    {subscription.status === 'paused' && (
                        <Button variant="outline" size="sm" className="flex-1">
                            <Play className="mr-1 h-3 w-3" />
                            Resume
                        </Button>
                    )}
                    {subscription.status !== 'cancelled' && (
                        <Button variant="outline" size="sm" className="flex-1">
                            <XCircle className="mr-1 h-3 w-3" />
                            Cancel
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}