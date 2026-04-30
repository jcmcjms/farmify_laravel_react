import { Head, Link } from '@inertiajs/react';
import { 
    Package, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Truck, 
    Store,
    MapPin,
    Phone,
    ChevronRight,
    Search
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import type { Order, OrderStatus } from '@/types';

interface OrdersPageProps {
    orders: Order[];
}

const statusLabels: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800', icon: Package },
    ready: { label: 'Ready', color: 'bg-orange-100 text-orange-800', icon: Package },
    picked_up: { label: 'Picked Up', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function OrdersPage({ orders = [] }: OrdersPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return (
        <>
            <Head title="My Orders" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
                        <p className="text-muted-foreground">Track and manage your orders</p>
                    </div>
                    <Button asChild>
                        <Link href="/consumer/catalog">
                            <Store className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </Button>
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
                            <SelectValue placeholder="Order Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Orders</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="picked_up">Picked Up</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {sortedOrders.length === 0 ? (
                    <EmptyState
                        icon={<Package className="h-12 w-12" />}
                        title="No orders found"
                        description={searchQuery ? "No orders match your search." : "You haven't placed any orders yet."}
                    />
                ) : (
                    <div className="space-y-4">
                        {sortedOrders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

interface OrderCardProps {
    order: Order;
}

function OrderCard({ order }: OrderCardProps) {
    const statusInfo = statusLabels[order.status];
    const StatusIcon = statusInfo.icon;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-mono text-sm text-muted-foreground">Order #{order.order_number}</p>
                        <CardTitle className="text-lg mt-1">Order from {order.items?.[0]?.product?.farm?.name || 'Farm'}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={statusInfo.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusInfo.label}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Items</p>
                        <div className="space-y-1">
                            {order.items?.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {item.product.name} x {item.quantity}
                                    </span>
                                    <span>${item.subtotal.toFixed(2)}</span>
                                </div>
                            ))}
                            {order.items && order.items.length > 3 && (
                                <p className="text-sm text-muted-foreground">
                                    +{order.items.length - 3} more item(s)
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Delivery to:</span>
                            <span className="truncate">{order.delivery_address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{order.delivery_phone}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ordered: {formatDate(order.created_at)}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div>
                        <span className="text-sm text-muted-foreground">Total: </span>
                        <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/consumer/orders/${order.id}`}>
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}