import { Link } from '@inertiajs/react';
import { Store, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product, ProductCategory } from '@/types';

interface ProductCardProps {
    product: Product;
    variant?: 'default' | 'compact';
    showFarm?: boolean;
    onAddToCart?: (product: Product) => void;
}

const categoryLabels: Record<ProductCategory, string> = {
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    herbs: 'Herbs',
    dairy: 'Dairy',
    eggs: 'Eggs',
    meat: 'Meat',
    grains: 'Grains',
    other: 'Other',
};

export function ProductCard({ product, variant = 'default', showFarm = true, onAddToCart }: ProductCardProps) {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-square relative">
                {product.images?.[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Store className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}
                {product.status !== 'available' && (
                    <Badge className="absolute top-2 right-2" variant={product.status === 'out_of_stock' ? 'destructive' : 'secondary'}>
                        {product.status.replace('_', ' ')}
                    </Badge>
                )}
                {product.stock <= 5 && product.stock > 0 && product.status === 'available' && (
                    <Badge className="absolute top-2 left-2 bg-orange-100 text-orange-800">
                        Only {product.stock} left
                    </Badge>
                )}
            </div>
            <CardHeader className="p-4">
                <CardTitle className="text-base">{product.name}</CardTitle>
                {showFarm && product.farm && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {product.farm.name}
                    </p>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2 text-sm">
                    <Badge variant="secondary">{categoryLabels[product.category]}</Badge>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-farm-primary text-lg">
                            ${product.price.toFixed(2)}/{product.price_unit}
                        </span>
                        <span className="text-muted-foreground">
                            {product.stock > 0 ? `${product.stock} ${product.unit}` : 'Out of stock'}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <div className="flex w-full gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/products/${product.id}`}>View</Link>
                    </Button>
                    {onAddToCart && (
                        <Button 
                            className="flex-1" 
                            onClick={() => onAddToCart(product)}
                            disabled={product.status !== 'available' || product.stock <= 0}
                        >
                            Add to Cart
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}

export function ProductCardCompact({ product }: { product: Product }) {
    return (
        <Card className="flex overflow-hidden">
            <div className="w-24 h-24 shrink-0">
                {product.images?.[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Store className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-3">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                {product.farm && (
                    <p className="text-xs text-muted-foreground">{product.farm.name}</p>
                )}
                <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-farm-primary">${product.price.toFixed(2)}</span>
                    <Badge variant="secondary" className="text-xs">{categoryLabels[product.category]}</Badge>
                </div>
            </div>
        </Card>
    );
}