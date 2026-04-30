import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ShoppingCart, 
    Store, 
    MapPin, 
    Star, 
    ChevronLeft, 
    Minus, 
    Plus,
    Package,
    Truck,
    Shield
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/types';

interface ProductDetailProps {
    product: Product;
    relatedProducts?: Product[];
    reviews?: { rating: number; comment: string; user: { name: string }; created_at: string }[];
}

const categoryLabels: Record<string, string> = {
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    herbs: 'Herbs',
    dairy: 'Dairy',
    eggs: 'Eggs',
    meat: 'Meat',
    grains: 'Grains',
    other: 'Other',
};

export default function ProductDetail({ product, relatedProducts = [], reviews = [] }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        setTimeout(() => setIsAdding(false), 1500);
    };

    const totalPrice = product.price * quantity;

    return (
        <>
            <Head title={product.name} />
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/consumer/catalog" className="flex items-center gap-1 hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Catalog
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
                        {product.images?.[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Store className="h-24 w-24 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">{categoryLabels[product.category]}</Badge>
                                {product.stock > 0 && product.stock <= 5 && (
                                    <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold">{product.name}</h1>
                        </div>

                        {product.farm && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Store className="h-4 w-4" />
                                <span>Sold by <Link href="#" className="font-medium text-foreground hover:underline">{product.farm.name}</Link></span>
                            </div>
                        )}

                        {product.farm?.location && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{product.farm.location}</span>
                            </div>
                        )}

                        {product.farmer?.rating && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.round(product.farmer.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">({product.farmer.rating.toFixed(1)})</span>
                            </div>
                        )}

                        <div className="text-3xl font-bold text-farm-primary">
                            ${product.price.toFixed(2)}
                            <span className="text-base font-normal text-muted-foreground">/{product.price_unit}</span>
                        </div>

                        {product.description && (
                            <p className="text-muted-foreground">{product.description}</p>
                        )}

                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-md">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <span className="text-muted-foreground">
                                {product.stock} {product.unit} available
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                className="flex-1"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={isAdding || product.stock <= 0}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {isAdding ? 'Added to Cart!' : `Add to Cart - $${totalPrice.toFixed(2)}`}
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="flex flex-col items-center text-center text-sm">
                                <Truck className="h-5 w-5 mb-1 text-muted-foreground" />
                                <span>Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center text-sm">
                                <Shield className="h-5 w-5 mb-1 text-muted-foreground" />
                                <span>Quality Guaranteed</span>
                            </div>
                            <div className="flex flex-col items-center text-center text-sm">
                                <Package className="h-5 w-5 mb-1 text-muted-foreground" />
                                <span>Fresh Produce</span>
                            </div>
                        </div>
                    </div>
                </div>

                {product.farm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>About the Farm</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Farm Name</p>
                                    <p className="font-medium">{product.farm.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Location</p>
                                    <p className="font-medium">{product.farm.location || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Farm Size</p>
                                    <p className="font-medium">{product.farm.size} {product.farm.size_unit}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={product.farm.status === 'active' ? 'default' : 'secondary'}>
                                        {product.farm.status}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {reviews.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Reviews</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {reviews.map((review, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{review.user.name}</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                    <Separator />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.slice(0, 4).map((related) => (
                                <Card key={related.id} className="overflow-hidden">
                                    <div className="aspect-square">
                                        {related.images?.[0] ? (
                                            <img
                                                src={related.images[0]}
                                                alt={related.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-muted">
                                                <Store className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <p className="font-medium truncate">{related.name}</p>
                                        <p className="font-bold text-farm-primary">${related.price.toFixed(2)}/{related.price_unit}</p>
                                        <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                                            <Link href={`/consumer/products/${related.id}`}>View</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}