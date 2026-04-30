import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { MapPin, Plus, Search, Tractor } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Farm } from '@/types';

interface FarmsIndexProps {
    farms: Farm[];
}

export default function Index({ farms = [] }: FarmsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredFarms = farms.filter((farm) => {
        const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farm.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || farm.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Head title="Farms" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Farms</h1>
                        <p className="text-muted-foreground">Manage your farm properties</p>
                    </div>
                    <Button asChild>
                        <Link href="/farms/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Farm
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search farms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {filteredFarms.length === 0 ? (
                    <EmptyState
                        icon={<Tractor className="h-12 w-12" />}
                        title="No farms found"
                        description={searchQuery ? "No farms match your search criteria." : "Get started by adding your first farm."}
                        action={
                            <Button asChild>
                                <Link href="/farms/create">Add Farm</Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredFarms.map((farm) => (
                            <FarmCard key={farm.id} farm={farm} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

interface FarmCardProps {
    farm: Farm;
}

function FarmCard({ farm }: FarmCardProps) {
    const statusColors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    };

    return (
        <Card className="overflow-hidden">
            <div className="h-2 bg-farm-primary" />
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{farm.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {farm.location}
                        </CardDescription>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[farm.status]}`}>
                        {farm.status}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-medium">{farm.size} {farm.size_unit}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Plots</p>
                        <p className="font-medium">{farm.plots?.length || 0}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/farms/${farm.id}`}>View</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/farms/${farm.id}/edit`}>Edit</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}