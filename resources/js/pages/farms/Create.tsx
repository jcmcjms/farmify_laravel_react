import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, MapPin, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import type { Farm } from '@/types';

interface FarmFormProps {
    farm?: Farm;
    isEdit?: boolean;
}

export default function FarmForm({ farm, isEdit = false }: FarmFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: farm?.name || '',
        location: farm?.location || '',
        size: farm?.size?.toString() || '',
        size_unit: farm?.size_unit || 'acres',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit && farm) {
            post(route('farms.update', farm.id));
        } else {
            post(route('farms.store'));
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Farm' : 'Create Farm'} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/farms">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isEdit ? 'Edit Farm' : 'Create New Farm'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEdit ? 'Update your farm details' : 'Add a new farm property'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Farm Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Farm Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Green Acres Farm"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    required
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="123 Farm Road, City, State"
                                />
                                <InputError message={errors.location} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="size">Size</Label>
                                    <Input
                                        id="size"
                                        type="number"
                                        required
                                        value={data.size}
                                        onChange={(e) => setData('size', e.target.value)}
                                        placeholder="50"
                                    />
                                    <InputError message={errors.size} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="size_unit">Unit</Label>
                                    <select
                                        id="size_unit"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={data.size_unit}
                                        onChange={(e) => setData('size_unit', e.target.value as 'acres' | 'hectares')}
                                    >
                                        <option value="acres">Acres</option>
                                        <option value="hectares">Hectares</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/farms">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update Farm' : 'Create Farm'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}