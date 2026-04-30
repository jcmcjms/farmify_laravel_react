import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Package, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Truck, 
    MapPin,
    Phone,
    ChevronLeft,
    DollarSign,
    LoaderCircle,
    User,
    Store
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import type { Delivery, DeliveryStatus } from '@/types';

interface DeliveryDetailProps {
    delivery: Delivery;
}

const statusLabels: Record<DeliveryStatus, { label: string; color: string; step: number }> = {
    assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-800', step: 0 },
    accepted: { label: 'Accepted', color: 'bg-indigo-100 text-indigo-800', step: 1 },
    picked_up: { label: 'Picked Up', color: 'bg-purple-100 text-purple-800', step: 2 },
    in_transit: { label: 'In Transit', color: 'bg-orange-100 text-orange-800', step: 3 },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', step: 4 },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', step: -1 },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800', step: -1 },
};

export default function RiderDeliveryDetail({ delivery }: DeliveryDetailProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const [showFailDialog, setShowFailDialog] = useState(false);

    const statusInfo = statusLabels[delivery.status];
    const steps = ['Assigned', 'Accepted', 'Picked Up', 'In Transit', 'Delivered'];
    const currentStep = statusInfo.step;

    const handleUpdateStatus = (newStatus: DeliveryStatus) => {
        setIsUpdating(true);
        setTimeout(() => {
            setIsUpdating(false);
        }, 1500);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const canAccept = delivery.status === 'assigned';
    const canPickUp = delivery.status === 'accepted';
    const canStartDelivery = delivery.status === 'picked_up';
    const canComplete = delivery.status === 'in_transit';
    const canDecline = delivery.status === 'assigned';
    const canReportFail = delivery.status === 'in_transit';

    return (
        <>
            <Head title={`Delivery #${delivery.order?.order_number}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/rider/deliveries" className="flex items-center gap-1 hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Deliveries
                    </Link>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Order #{delivery.order?.order_number}
                        </h1>
                        <p className="text-muted-foreground">Delivery Details</p>
                    </div>
                    <Badge className={statusLabels[delivery.status].color}>
                        {statusLabels[delivery.status].label}
                    </Badge>
                </div>

                {currentStep >= 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                {steps.map((step, index) => (
                                    <div key={step} className="flex items-center">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                            index <= currentStep 
                                                ? 'bg-farm-primary text-white' 
                                                : 'bg-muted text-muted-foreground'
                                        }`}>
                                            {index < currentStep ? (
                                                <CheckCircle className="h-5 w-5" />
                                            ) : index === currentStep ? (
                                                <Truck className="h-5 w-5" />
                                            ) : (
                                                <span className="text-sm">{index + 1}</span>
                                            )}
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`w-12 sm:w-24 h-1 mx-2 ${
                                                index < currentStep ? 'bg-farm-primary' : 'bg-muted'
                                            }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                {steps.map((step) => (
                                    <span key={step} className="hidden sm:inline">{step}</span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Delivery Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Pickup Address</p>
                                        <div className="flex items-start gap-2">
                                            <Store className="h-4 w-4 text-farm-primary mt-0.5" />
                                            <span>{delivery.pickup_address}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Delivery Address</p>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-farm-primary mt-0.5" />
                                            <span>{delivery.delivery_address}</span>
                                        </div>
                                    </div>
                                </div>
                                {delivery.order?.delivery_phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>Customer: {delivery.order.delivery_phone}</span>
                                    </div>
                                )}
                                {delivery.order?.notes && (
                                    <div className="rounded-md bg-muted p-3">
                                        <p className="text-sm font-medium">Notes:</p>
                                        <p className="text-sm text-muted-foreground">{delivery.order.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {delivery.order?.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between">
                                            <div>
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.quantity} x ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${delivery.order?.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {delivery.estimated_delivery && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Estimated Delivery</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(delivery.estimated_delivery)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Earnings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span className="font-medium">$5.00</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="font-semibold">Your Earnings</span>
                                    <span className="font-bold text-lg text-farm-primary">$5.00</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Info</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {delivery.order?.consumer && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{delivery.order.consumer.name}</p>
                                            <p className="text-sm text-muted-foreground">{delivery.order.consumer.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 space-y-3">
                                {canAccept && (
                                    <Button className="w-full" onClick={() => handleUpdateStatus('accepted')}>
                                        Accept Delivery
                                    </Button>
                                )}
                                {canPickUp && (
                                    <Button className="w-full" onClick={() => handleUpdateStatus('picked_up')}>
                                        Mark as Picked Up
                                    </Button>
                                )}
                                {canStartDelivery && (
                                    <Button className="w-full" onClick={() => handleUpdateStatus('in_transit')}>
                                        Start Delivery
                                    </Button>
                                )}
                                {canComplete && (
                                    <Button className="w-full" onClick={() => handleUpdateStatus('delivered')}>
                                        Mark as Delivered
                                    </Button>
                                )}
                                {canDecline && (
                                    <Button variant="outline" className="w-full" onClick={() => setShowDeclineDialog(true)}>
                                        Decline Delivery
                                    </Button>
                                )}
                                {canReportFail && (
                                    <Button variant="outline" className="w-full text-destructive" onClick={() => setShowFailDialog(true)}>
                                        Report Delivery Failed
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Decline Delivery</DialogTitle>
                        </DialogHeader>
                        <p className="text-muted-foreground">
                            Are you sure you want to decline this delivery? This action cannot be undone.
                        </p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeclineDialog(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => {
                                setShowDeclineDialog(false);
                                handleUpdateStatus('cancelled');
                            }}>Decline</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={showFailDialog} onOpenChange={setShowFailDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Report Delivery Failed</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Please provide a reason for the failed delivery.
                            </p>
                            <textarea 
                                className="w-full h-24 p-3 rounded-md border"
                                placeholder="Enter reason..."
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowFailDialog(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => {
                                setShowFailDialog(false);
                                handleUpdateStatus('failed');
                            }}>Submit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}