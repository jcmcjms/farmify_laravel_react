import { Head, useForm, Link } from '@inertiajs/react';
import { 
    ShoppingCart, 
    MapPin, 
    Phone, 
    FileText, 
    CreditCard, 
    Truck,
    ChevronLeft,
    Check,
    LoaderCircle
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import type { CartItem } from '@/types';

interface CheckoutPageProps {
    cartItems: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    userAddress?: string;
    userPhone?: string;
}

export default function CheckoutPage({ 
    cartItems = [], 
    subtotal = 0, 
    deliveryFee = 0, 
    total = 0,
    userAddress = '',
    userPhone = ''
}: CheckoutPageProps) {
    const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const { data, setData, errors, post } = useForm({
        delivery_address: userAddress,
        delivery_phone: userPhone,
        payment_method: 'cod' as string,
        notes: '',
    });

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        
        setTimeout(() => {
            setIsProcessing(false);
            setOrderPlaced(true);
        }, 2000);
    };

    if (orderPlaced) {
        return (
            <>
                <Head title="Order Confirmed" />
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
                    <p className="text-muted-foreground text-center max-w-md">
                        Your order has been placed and will be delivered to your address. 
                        You will pay in cash when your order arrives.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Button asChild>
                            <Link href="/consumer/orders">View Orders</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/consumer/catalog">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    if (cartItems.length === 0) {
        return (
            <>
                <Head title="Checkout" />
                <div className="text-center py-12">
                    <h1 className="text-xl font-semibold">Your cart is empty</h1>
                    <p className="text-muted-foreground mt-2">Add some products before checking out.</p>
                    <Button className="mt-4" asChild>
                        <Link href="/consumer/catalog">Browse Products</Link>
                    </Button>
                </div>
            </>
        );
    }

    const calculatedSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculatedTotal = calculatedSubtotal + deliveryFee;

    return (
        <>
            <Head title="Checkout" />
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/consumer/cart" className="flex items-center gap-1 hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Cart
                    </Link>
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
                    <p className="text-muted-foreground">Complete your order</p>
                </div>

                <div className="flex items-center justify-center gap-4 mb-8">
                    {['address', 'payment', 'confirm'].map((s, index) => (
                        <div key={s} className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                step === s 
                                    ? 'bg-farm-primary text-white' 
                                    : ['address', 'payment', 'confirm'].indexOf(step) > index 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-muted text-muted-foreground'
                            }`}>
                                {['address', 'payment', 'confirm'].indexOf(step) > index ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className={`ml-2 text-sm capitalize ${step === s ? 'font-medium' : 'text-muted-foreground'}`}>
                                {s === 'address' ? 'Delivery' : s === 'payment' ? 'Payment' : 'Confirm'}
                            </span>
                            {index < 2 && (
                                <div className={`w-12 h-0.5 mx-2 ${['address', 'payment', 'confirm'].indexOf(step) > index ? 'bg-farm-primary' : 'bg-muted'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handlePlaceOrder}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            {step === 'address' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Delivery Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="delivery_address">Delivery Address</Label>
                                            <Input
                                                id="delivery_address"
                                                value={data.delivery_address}
                                                onChange={(e) => setData('delivery_address', e.target.value)}
                                                placeholder="123 Main Street, City, State"
                                                required
                                            />
                                            {errors.delivery_address && (
                                                <p className="text-sm text-destructive">{errors.delivery_address}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="delivery_phone">Phone Number</Label>
                                            <Input
                                                id="delivery_phone"
                                                type="tel"
                                                value={data.delivery_phone}
                                                onChange={(e) => setData('delivery_phone', e.target.value)}
                                                placeholder="+1 234 567 8900"
                                                required
                                            />
                                            {errors.delivery_phone && (
                                                <p className="text-sm text-destructive">{errors.delivery_phone}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="notes">Order Notes (Optional)</Label>
                                            <Input
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Special instructions for delivery"
                                            />
                                        </div>
                                        <Button 
                                            type="button" 
                                            className="w-full"
                                            onClick={() => setStep('payment')}
                                            disabled={!data.delivery_address || !data.delivery_phone}
                                        >
                                            Continue to Payment
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {step === 'payment' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            Payment Method
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center p-4 border rounded-lg bg-farm-primary/5">
                                            <div className="flex items-center gap-3 flex-1">
                                                <Truck className="h-6 w-6 text-farm-primary" />
                                                <div>
                                                    <p className="font-medium">Cash on Delivery (COD)</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Pay in cash when your order is delivered
                                                    </p>
                                                </div>
                                            </div>
                                            <RadioGroupItem value="cod" checked />
                                        </div>
                                        <div className="flex gap-4">
                                            <Button 
                                                type="button" 
                                                variant="outline"
                                                onClick={() => setStep('address')}
                                            >
                                                Back
                                            </Button>
                                            <Button 
                        type="button" 
                        className="flex-1"
                        onClick={() => setStep('confirm')}
                                            >
                                                Review Order
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {step === 'confirm' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Order Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span>{item.product.name} x {item.quantity}</span>
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator />
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Delivery Address</span>
                                                <span className="text-right max-w-[200px]">{data.delivery_address}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Phone</span>
                                                <span>{data.delivery_phone}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Payment Method</span>
                                                <span>Cash on Delivery</span>
                                            </div>
                                            {data.notes && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Notes</span>
                                                    <span className="text-right max-w-[200px]">{data.notes}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-4">
                                            <Button 
                                                type="button" 
                                                variant="outline"
                                                onClick={() => setStep('payment')}
                                            >
                                                Back
                                            </Button>
                                            <Button 
                                                type="submit"
                                                className="flex-1"
                                                disabled={isProcessing}
                                            >
                                                {isProcessing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                                Place Order - ${calculatedTotal.toFixed(2)}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Total</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                                        <span>${calculatedSubtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery Fee</span>
                                        <span>${deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span className="text-lg">${calculatedTotal.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3 text-sm">
                                        <Truck className="h-5 w-5 text-farm-primary shrink-0" />
                                        <div>
                                            <p className="font-medium">Delivery Time</p>
                                            <p className="text-muted-foreground mt-1">
                                                Standard delivery: 2-4 hours. You'll receive a call before delivery.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}