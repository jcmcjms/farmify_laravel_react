import { Head, Link, usePage } from '@inertiajs/react';
import { Search, Filter, Grid, List, Store, MapPin, Star, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import type { Product, ProductCategory } from '@/types';

interface CatalogProps {
    products: Product[];
    categories?: ProductCategory[];
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

export default function ConsumerCatalog({ products = [], categories = [] }: CatalogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [priceRange, setPriceRange] = useState<string>('all');

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        
        let matchesPrice = true;
        if (priceRange === 'under10') matchesPrice = product.price < 10;
        else if (priceRange === '10to25') matchesPrice = product.price >= 10 && product.price <= 25;
        else if (priceRange === '25to50') matchesPrice = product.price > 25 && product.price <= 50;
        else if (priceRange === 'over50') matchesPrice = product.price > 50;
        
        return matchesSearch && matchesCategory && matchesPrice && product.status === 'available';
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price_low': return a.price - b.price;
            case 'price_high': return b.price - a.price;
            case 'name': return a.name.localeCompare(b.name);
            default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    return (
        <>
            <Head title="Browse Products" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Product Catalog</h1>
                        <p className="text-muted-foreground">Fresh produce from local farms</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/consumer/cart">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            View Cart
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {(categories.length > 0 ? categories : (Object.keys(categoryLabels) as ProductCategory[])).map((cat) => (
                                <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under10">Under $10</SelectItem>
                            <SelectItem value="10to25">$10 - $25</SelectItem>
                            <SelectItem value="25to50">$25 - $50</SelectItem>
                            <SelectItem value="over50">Over $50</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price_low">Price: Low to High</SelectItem>
                            <SelectItem value="price_high">Price: High to Low</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex rounded-md border">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {sortedProducts.length === 0 ? (
                    <EmptyState
                        icon={<Store className="h-12 w-12" />}
                        title="No products found"
                        description={searchQuery ? "No products match your search." : "No products available yet."}
                    />
                ) : (
                    <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4' : 'space-y-4'}>
                        {sortedProducts.map((product) => (
                            <ConsumerProductCard key={product.id} product={product} viewMode={viewMode} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

interface ConsumerProductCardProps {
    product: Product;
    viewMode: 'grid' | 'list';
}

function ConsumerProductCard({ product, viewMode }: ConsumerProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsAdding(true);
        setTimeout(() => setIsAdding(false), 1000);
    };

    return (
        <Card className={viewMode === 'list' ? 'flex' : ''}>
            <div className={viewMode === 'grid' ? 'aspect-square relative' : 'w-48 shrink-0'}>
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
                {product.stock <= 5 && product.stock > 0 && (
                    <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800">
                        Only {product.stock} left
                    </Badge>
                )}
            </div>
            <div className="flex flex-1 flex-col">
                <CardHeader className={viewMode === 'list' ? 'p-4' : ''}>
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{product.name}</CardTitle>
                    </div>
                    {product.farm && (
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {product.farm.name}
                        </p>
                    )}
                </CardHeader>
                <CardContent className={viewMode === 'list' ? 'flex-1 p-4 pt-0' : ''}>
                    <div className="space-y-2 text-sm">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{categoryLabels[product.category]}</Badge>
                        </div>
                        {product.description && (
                            <p className="line-clamp-2 text-muted-foreground">{product.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-farm-primary text-lg">
                                ${product.price.toFixed(2)}/{product.price_unit}
                            </span>
                            <span className="text-muted-foreground">
                                {product.stock > 0 ? `${product.stock} ${product.unit} available` : 'Out of stock'}
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className={viewMode === 'list' ? 'p-4 pt-0' : ''}>
                    <div className="flex w-full gap-2">
                        <Button variant="outline" className="flex-1" asChild>
                            <Link href={`/consumer/products/${product.id}`}>View Details</Link>
                        </Button>
                        <Button 
                            className="flex-1" 
                            onClick={handleAddToCart}
                            disabled={isAdding || product.stock <= 0}
                        >
                            {isAdding ? 'Added!' : 'Add to Cart'}
                        </Button>
                    </div>
                </CardFooter>
            </div>
        </Card>
    );
}