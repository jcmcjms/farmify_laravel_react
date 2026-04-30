import { Link } from '@inertiajs/react';
import { Package, Clock, CheckCircle, XCircle, Store, MapPin, Phone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order, OrderStatus } from '@/types';

interface OrderCardProps {
    order: Order;
    userRole?: string;
}

const statusLabels: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800', icon: Package },
    ready: { label: 'Ready', color: 'bg-orange-100 text-orange-800', icon: Package },
    picked_up: { label: 'Picked Up', color: 'bg-indigo-100 text-indigo-800', icon: Package },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export function OrderCard({ order, userRole = 'consumer' }: OrderCardProps) {
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

    const detailLink = userRole === 'consumer' 
        ? `/consumer/orders/${order.id}` 
        : userRole === 'farmer' || userRole === 'farm_manager'
            ? `/orders/${order.id}`
            : `/orders/${order.id}`;

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-mono text-sm text-muted-foreground">Order #{order.order_number}</p>
                        <CardTitle className="text-lg mt-1">
                            {order.items?.[0]?.product?.farm?.name || 'Farm'}
                        </CardTitle>
                    </div>
                    <Badge className={statusInfo.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusInfo.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Items</p>
                        <div className="space-y-1">
                            {order.items?.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground truncate max-w-[150px]">
                                        {item.product.name} x {item.quantity}
                                    </span>
                                    <span>${item.subtotal.toFixed(2)}</span>
                                </div>
                            ))}
                            {order.items && order.items.length > 3 && (
                                <p className="text-sm text-muted-foreground">
                                    +{order.items.length - 3} more
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="truncate">{order.delivery_address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{order.delivery_phone}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {formatDate(order.created_at)}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div>
                        <span className="text-sm text-muted-foreground">Total: </span>
                        <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={detailLink}>
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface OrderCardCompactProps {
    order: Order;
}

export function OrderCardCompact({ order }: OrderCardCompactProps) {
    const statusInfo = statusLabels[order.status];

    return (
        <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
            <div className="min-w-0 flex-1">
                <p className="font-medium font-mono text-sm">#{order.order_number}</p>
                <p className="text-sm text-muted-foreground">{order.items?.length} items</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-bold">${order.total.toFixed(2)}</span>
                <Badge className={statusInfo.color} variant="secondary">
                    {statusInfo.label}
                </Badge>
            </div>
        </div>
    );
}