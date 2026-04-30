import { Head, Link } from '@inertiajs/react';
import { 
    Package, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Truck, 
    MapPin,
    Phone,
    Search,
    Filter
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import type { Delivery, DeliveryStatus } from '@/types';

interface DeliveriesPageProps {
    deliveries: Delivery[];
    stats?: {
        available: number;
        in_progress: number;
        completed_today: number;
        today_earnings: number;
    };
}

const statusLabels: Record<DeliveryStatus, { label: string; color: string; icon: typeof Clock }> = {
    assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-800', icon: Package },
    accepted: { label: 'Accepted', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    picked_up: { label: 'Picked Up', color: 'bg-purple-100 text-purple-800', icon: Package },
    in_transit: { label: 'In Transit', color: 'bg-orange-100 text-orange-800', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function RiderDeliveriesPage({ deliveries = [], stats }: DeliveriesPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredDeliveries = deliveries.filter((delivery) => {
        const matchesSearch = delivery.order?.order_number?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
        if (a.status === 'in_transit' || a.status === 'picked_up') return -1;
        if (b.status === 'in_transit' || b.status === 'picked_up') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const availableDeliveries = deliveries.filter(d => d.status === 'assigned').length;
    const inProgressDeliveries = deliveries.filter(d => ['accepted', 'picked_up', 'in_transit'].includes(d.status)).length;
    const completedDeliveries = deliveries.filter(d => d.status === 'delivered').length;

    return (
        <>
            <Head title="Deliveries" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Deliveries</h1>
                        <p className="text-muted-foreground">Manage your delivery tasks</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-blue-100 p-2">
                                    <Package className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{availableDeliveries}</p>
                                    <p className="text-sm text-muted-foreground">Available</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-orange-100 p-2">
                                    <Truck className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{inProgressDeliveries}</p>
                                    <p className="text-sm text-muted-foreground">In Progress</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-100 p-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{completedDeliveries}</p>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-farm-primary/10 p-2">
                                    <Clock className="h-5 w-5 text-farm-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">${stats?.today_earnings?.toFixed(2) || '0.00'}</p>
                                    <p className="text-sm text-muted-foreground">Today</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by order number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Deliveries</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="picked_up">Picked Up</SelectItem>
                            <SelectItem value="in_transit">In Transit</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {sortedDeliveries.length === 0 ? (
                    <EmptyState
                        icon={<Truck className="h-12 w-12" />}
                        title="No deliveries found"
                        description={searchQuery ? "No deliveries match your search." : "No deliveries assigned yet. Check back later!"}
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sortedDeliveries.map((delivery) => (
                            <RiderDeliveryCard key={delivery.id} delivery={delivery} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

interface RiderDeliveryCardProps {
    delivery: Delivery;
}

function RiderDeliveryCard({ delivery }: RiderDeliveryCardProps) {
    const statusInfo = statusLabels[delivery.status];
    const StatusIcon = statusInfo.icon;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card className={delivery.status === 'in_transit' || delivery.status === 'picked_up' ? 'border-farm-primary' : ''}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-mono text-sm text-muted-foreground">Order #{delivery.order?.order_number}</p>
                        <CardTitle className="text-base mt-1">{delivery.order?.items?.[0]?.product?.name || 'Order'}</CardTitle>
                    </div>
                    <Badge className={statusInfo.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusInfo.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Pickup:</p>
                            <p className="font-medium">{delivery.pickup_address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-farm-primary mt-0.5 shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Delivery:</p>
                            <p className="font-medium">{delivery.delivery_address}</p>
                        </div>
                    </div>
                    {delivery.order?.delivery_phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{delivery.order.delivery_phone}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Order Total: ${delivery.order?.total?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="flex gap-2 pt-2">
                    {delivery.status === 'assigned' && (
                        <>
                            <Button size="sm" className="flex-1">Accept</Button>
                            <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                        </>
                    )}
                    {delivery.status === 'accepted' && (
                        <Button size="sm" className="w-full">Mark as Picked Up</Button>
                    )}
                    {delivery.status === 'picked_up' && (
                        <Button size="sm" className="w-full">Start Delivery</Button>
                    )}
                    {delivery.status === 'in_transit' && (
                        <Button size="sm" className="w-full">Mark as Delivered</Button>
                    )}
                    {delivery.status === 'delivered' && (
                        <Button size="sm" variant="outline" className="w-full" asChild>
                            <Link href={`/rider/deliveries/${delivery.id}`}>View Details</Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}