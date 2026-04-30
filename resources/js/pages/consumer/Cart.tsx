import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ShoppingCart, 
    Trash2, 
    Plus, 
    Minus, 
    Store,
    ArrowRight,
    Package
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/ui/empty-state';
import type { CartItem, Product } from '@/types';

interface CartPageProps {
    cartItems: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
}

export default function CartPage({ cartItems = [], subtotal = 0, deliveryFee = 0, total = 0 }: CartPageProps) {
    const [items, setItems] = useState<CartItem[]>(cartItems);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);

    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setIsUpdating(id);
        setTimeout(() => setIsUpdating(null), 500);
        
        setItems(prev => prev.map(item => 
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const calculatedSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculatedTotal = calculatedSubtotal + deliveryFee;

    if (items.length === 0) {
        return (
            <>
                <Head title="Shopping Cart" />
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>
                        <p className="text-muted-foreground">Your cart is empty</p>
                    </div>
                    <EmptyState
                        icon={<ShoppingCart className="h-12 w-12" />}
                        title="Your cart is empty"
                        description="Add some fresh produce to get started!"
                    />
                    <div className="flex justify-center">
                        <Button asChild>
                            <Link href="/consumer/catalog">Browse Products</Link>
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Shopping Cart" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>
                    <p className="text-muted-foreground">{items.length} item(s) in your cart</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 rounded-md bg-muted overflow-hidden shrink-0">
                                            {item.product.images?.[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-medium">{item.product.name}</h3>
                                                    {item.product.farm && (
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <Store className="h-3 w-3" />
                                                            {item.product.farm.name}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border rounded-md">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={isUpdating === item.id}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={isUpdating === item.id || item.quantity >= item.product.stock}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        ${item.price.toFixed(2)}/{item.product.price_unit}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                                    <span>${calculatedSubtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span>${deliveryFee.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold text-lg">${calculatedTotal.toFixed(2)}</span>
                                </div>
                                
                                <Button className="w-full" size="lg" asChild>
                                    <Link href="/consumer/checkout">
                                        Proceed to Checkout
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3 text-sm">
                                    <Truck className="h-5 w-5 text-farm-primary shrink-0" />
                                    <div>
                                        <p className="font-medium">Delivery Information</p>
                                        <p className="text-muted-foreground mt-1">
                                            Free delivery on orders over $50. Standard delivery fee is $5.99 for orders under $50.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}