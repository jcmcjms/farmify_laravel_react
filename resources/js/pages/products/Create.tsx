import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, Image, ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { Product, ProductCategory } from '@/types';

interface ProductFormProps {
    product?: Product;
    isEdit?: boolean;
    farms?: { id: number; name: string }[];
}

const categories: ProductCategory[] = [
    'vegetables', 'fruits', 'herbs', 'dairy', 'eggs', 'meat', 'grains', 'other'
];

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

export default function ProductForm({ product, isEdit = false, farms = [] }: ProductFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: product?.name || '',
        description: product?.description || '',
        farm_id: product?.farm_id?.toString() || '',
        category: product?.category || '',
        price: product?.price?.toString() || '',
        price_unit: product?.price_unit || 'kg',
        stock: product?.stock?.toString() || '',
        unit: product?.unit || 'kg',
        status: product?.status || 'available',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit && product) {
            post(route('products.update', product.id));
        } else {
            post(route('products.store'));
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Product' : 'Create Product'} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/products">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isEdit ? 'Edit Product' : 'Add New Product'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEdit ? 'Update product details' : 'List fresh produce for sale'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Fresh Tomatoes"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe your product..."
                                    rows={4}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="farm_id">Farm</Label>
                                <Select 
                                    value={data.farm_id} 
                                    onValueChange={(val) => setData('farm_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select farm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {farms.map((farm) => (
                                            <SelectItem key={farm.id} value={farm.id.toString()}>
                                                {farm.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select 
                                    value={data.category} 
                                    onValueChange={(val) => setData('category', val as ProductCategory)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {categoryLabels[cat]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Stock</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="5.00"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="price_unit">Per</Label>
                                    <Select 
                                        value={data.price_unit} 
                                        onValueChange={(val) => setData('price_unit', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="lb">lb</SelectItem>
                                            <SelectItem value="piece">piece</SelectItem>
                                            <SelectItem value="bunch">bunch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        required
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        placeholder="100"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Select 
                                        value={data.unit} 
                                        onValueChange={(val) => setData('unit', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="lb">lb</SelectItem>
                                            <SelectItem value="piece">piece</SelectItem>
                                            <SelectItem value="bunch">bunch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select 
                                    value={data.status} 
                                    onValueChange={(val) => setData('status', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="discontinued">Discontinued</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                                <Image className="mb-4 h-12 w-12 text-muted-foreground" />
                                <p className="mb-2 text-sm font-medium">Upload product images</p>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Drag and drop or click to upload
                                </p>
                                <Button type="button" variant="outline" size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Upload Image
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/products">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}