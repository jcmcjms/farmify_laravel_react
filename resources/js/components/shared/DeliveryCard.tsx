import { Link } from '@inertiajs/react';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Phone, ChevronRight, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Delivery, DeliveryStatus } from '@/types';

interface DeliveryCardProps {
    delivery: Delivery;
    onAccept?: (delivery: Delivery) => void;
    onDecline?: (delivery: Delivery) => void;
    onUpdateStatus?: (delivery: Delivery, status: DeliveryStatus) => void;
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

export function DeliveryCard({ delivery, onAccept, onDecline, onUpdateStatus }: DeliveryCardProps) {
    const statusInfo = statusLabels[delivery.status];
    const StatusIcon = statusInfo.icon;

    const isActive = delivery.status === 'in_transit' || delivery.status === 'picked_up';
    const canAccept = delivery.status === 'assigned';
    const canPickUp = delivery.status === 'accepted';
    const canStartDelivery = delivery.status === 'picked_up';
    const canComplete = delivery.status === 'in_transit';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card className={isActive ? 'border-farm-primary' : ''}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-mono text-sm text-muted-foreground">Order #{delivery.order?.order_number}</p>
                        <CardTitle className="text-base mt-1">
                            {delivery.order?.items?.[0]?.product?.name || 'Order'}
                        </CardTitle>
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
                            <p className="text-muted-foreground text-xs">Pickup:</p>
                            <p className="font-medium">{delivery.pickup_address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-farm-primary mt-0.5 shrink-0" />
                        <div>
                            <p className="text-muted-foreground text-xs">Delivery:</p>
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
                    <span>Earn: $5.00</span>
                    <span>Order: ${delivery.order?.total?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="flex gap-2 pt-2">
                    {canAccept && onAccept && (
                        <Button size="sm" className="flex-1" onClick={() => onAccept(delivery)}>Accept</Button>
                    )}
                    {canAccept && onDecline && (
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => onDecline(delivery)}>Decline</Button>
                    )}
                    {canPickUp && onUpdateStatus && (
                        <Button size="sm" className="w-full" onClick={() => onUpdateStatus(delivery, 'picked_up')}>
                            Mark as Picked Up
                        </Button>
                    )}
                    {canStartDelivery && onUpdateStatus && (
                        <Button size="sm" className="w-full" onClick={() => onUpdateStatus(delivery, 'in_transit')}>
                            Start Delivery
                        </Button>
                    )}
                    {canComplete && onUpdateStatus && (
                        <Button size="sm" className="w-full" onClick={() => onUpdateStatus(delivery, 'delivered')}>
                            Mark as Delivered
                        </Button>
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

interface DeliveryCardCompactProps {
    delivery: Delivery;
}

export function DeliveryCardCompact({ delivery }: DeliveryCardCompactProps) {
    const statusInfo = statusLabels[delivery.status];

    return (
        <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
            <div className="min-w-0 flex-1">
                <p className="font-medium font-mono text-sm">#{delivery.order?.order_number}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {delivery.delivery_address}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-farm-primary">$5.00</span>
                <Badge className={statusInfo.color} variant="secondary">
                    {statusInfo.label}
                </Badge>
            </div>
        </div>
    );
}