import { Head, Link, usePage } from '@inertiajs/react';
import { Search, Filter, Plus, Grid, List, Store, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import type { Product, ProductCategory } from '@/types';

interface ProductCatalogProps {
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

export default function Catalog({ products = [], categories = [] }: ProductCatalogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Head title="Browse Products" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Browse Products</h1>
                        <p className="text-muted-foreground">Fresh produce from local farms</p>
                    </div>
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

                {filteredProducts.length === 0 ? (
                    <EmptyState
                        icon={<Store className="h-12 w-12" />}
                        title="No products found"
                        description={searchQuery ? "No products match your search." : "No products available yet."}
                    />
                ) : (
                    <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4' : 'space-y-4'}>
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} viewMode={viewMode} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

interface ProductCardProps {
    product: Product;
    viewMode: 'grid' | 'list';
}

function ProductCard({ product, viewMode }: ProductCardProps) {
    const statusBadge = {
        available: 'bg-green-100 text-green-800',
        out_of_stock: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        discontinued: 'bg-gray-100 text-gray-800',
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
                {product.status !== 'available' && (
                    <Badge className={`absolute top-2 right-2 ${statusBadge[product.status]}`}>
                        {product.status.replace('_', ' ')}
                    </Badge>
                )}
            </div>
            <div className="flex flex-1 flex-col">
                <CardHeader className={viewMode === 'list' ? 'p-4' : ''}>
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{product.name}</CardTitle>
                        {product.farm && (
                            <span className="text-xs text-muted-foreground">{product.farm.name}</span>
                        )}
                    </div>
                </CardHeader>
                <CardContent className={viewMode === 'list' ? 'flex-1 p-4 pt-0' : ''}>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">{categoryLabels[product.category]}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-farm-primary">
                                ${product.price}/{product.price_unit}
                            </span>
                            <span className="text-muted-foreground">
                                {product.stock > 0 ? `${product.stock} ${product.unit} available` : 'Out of stock'}
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className={viewMode === 'list' ? 'p-4 pt-0' : ''}>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={`/products/${product.id}`}>View Details</Link>
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
}