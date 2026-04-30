import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, MapPin, Plus, ArrowLeft, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import type { Farm, Plot } from '@/types';

interface PlotsPageProps {
    farm: Farm;
    plots?: Plot[];
}

export default function Plots({ farm, plots = [] }: PlotsPageProps) {
    const [isCreating, setIsCreating] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        size: '',
        size_unit: 'acres',
        crop: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('farms.plots.store', farm.id), {
            onSuccess: () => {
                reset();
                setIsCreating(false);
            },
        });
    };

    const plotStatusColors: Record<string, string> = {
        active: 'bg-green-100 text-green-800',
        fallow: 'bg-yellow-100 text-yellow-800',
        preparing: 'bg-blue-100 text-blue-800',
    };

    return (
        <>
            <Head title={`${farm.name} - Plots`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/farms/${farm.id}`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">{farm.name} - Plots</h1>
                        <p className="text-muted-foreground">Manage your farm plots</p>
                    </div>
                    <Button onClick={() => setIsCreating(!isCreating)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Plot
                    </Button>
                </div>

                {isCreating && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Plot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="plot_name">Plot Name</Label>
                                    <Input
                                        id="plot_name"
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="North Field"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="plot_size">Size</Label>
                                        <Input
                                            id="plot_size"
                                            type="number"
                                            required
                                            value={data.size}
                                            onChange={(e) => setData('size', e.target.value)}
                                            placeholder="10"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="plot_size_unit">Unit</Label>
                                        <select
                                            id="plot_size_unit"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                            value={data.size_unit}
                                            onChange={(e) => setData('size_unit', e.target.value as 'acres' | 'hectares')}
                                        >
                                            <option value="acres">Acres</option>
                                            <option value="hectares">Hectares</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="crop">Current Crop (optional)</Label>
                                    <Input
                                        id="crop"
                                        type="text"
                                        value={data.crop}
                                        onChange={(e) => setData('crop', e.target.value)}
                                        placeholder="Tomatoes"
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Plot
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {plots.map((plot) => (
                        <Card key={plot.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-base">{plot.name}</CardTitle>
                                    <Badge className={plotStatusColors[plot.status]}>{plot.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Size</span>
                                        <span>{plot.size} {plot.size_unit}</span>
                                    </div>
                                    {plot.crop && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Crop</span>
                                            <span>{plot.crop}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {plots.length === 0 && !isCreating && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No plots yet. Add your first plot to get started.</p>
                    </div>
                )}
            </div>
        </>
    );
}