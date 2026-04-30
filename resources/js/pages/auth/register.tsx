import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Tractor, User, Users, Truck, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import type { UserRole } from '@/types';

interface RegisterProps {
    errors?: Record<string, string>;
}

const roles = [
    { 
        value: 'farmer' as UserRole, 
        label: 'Farmer', 
        description: 'Grow and sell fresh produce from your farm',
        icon: Tractor 
    },
    { 
        value: 'farm_manager' as UserRole, 
        label: 'Farm Manager', 
        description: 'Manage farms and coordinate operations',
        icon: Users 
    },
    { 
        value: 'laborer' as UserRole, 
        label: 'Laborer', 
        description: 'Find work on farms',
        icon: User 
    },
    { 
        value: 'consumer' as UserRole, 
        label: 'Consumer', 
        description: 'Buy fresh produce directly from farmers',
        icon: ShoppingBag 
    },
    { 
        value: 'rider' as UserRole, 
        label: 'Rider', 
        description: 'Deliver products to customers',
        icon: Truck 
    },
];

export default function Register({ errors = {} }: RegisterProps) {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const { data, setData, post, processing, errors: formErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: '' as UserRole,
    });

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setData('role', role);
        setStep(2);
    };

    const handleSubmitBasic = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess: () => {
                // Will redirect based on role
            },
        });
    };

    return (
        <AuthLayout title="Create an account" description="Choose how you want to use Farmify">
            <Head title="Register" />

            {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                            <button
                                key={role.value}
                                type="button"
                                onClick={() => handleRoleSelect(role.value)}
                                className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center transition-colors hover:border-farm-primary hover:bg-farm-primary/5"
                            >
                                <Icon className="h-10 w-10 text-farm-primary" />
                                <div>
                                    <p className="font-semibold">{role.label}</p>
                                    <p className="text-sm text-muted-foreground">{role.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmitBasic} className="flex flex-col gap-6">
                    <div className="mb-4">
                        <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                            ← Back
                        </Button>
                    </div>
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                    <p className="text-muted-foreground">
                        Creating account as: <span className="font-semibold capitalize">{selectedRole}</span>
                    </p>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                            <Input
                                id="name"
                                type="text"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                            <Input
                                id="phone"
                                type="tel"
                                required
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+1 234 567 8900"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="password_confirmation" className="text-sm font-medium">Confirm Password</label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Continue
                    </Button>
                </form>
            )}

            {step === 3 && selectedRole && (
                <form onSubmit={handleFinalSubmit} className="flex flex-col gap-6">
                    <div className="mb-4">
                        <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                            ← Back
                        </Button>
                    </div>
                    <h2 className="text-xl font-semibold">Complete Your Profile</h2>
                    <p className="text-muted-foreground">
                        Adding {selectedRole === 'farmer' ? 'farm' : selectedRole === 'consumer' ? 'delivery' : 'profile'} details
                    </p>

                    {selectedRole === 'farmer' && (
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="farm_name" className="text-sm font-medium">Farm Name</label>
                                <Input
                                    id="farm_name"
                                    type="text"
                                    required
                                    placeholder="Green Acres Farm"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="location" className="text-sm font-medium">Farm Location</label>
                                <Input
                                    id="location"
                                    type="text"
                                    required
                                    placeholder="123 Farm Road, City, State"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="size" className="text-sm font-medium">Farm Size (acres)</label>
                                <Input
                                    id="size"
                                    type="number"
                                    required
                                    placeholder="50"
                                />
                            </div>
                        </div>
                    )}

                    {selectedRole === 'consumer' && (
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="address" className="text-sm font-medium">Delivery Address</label>
                                <Input
                                    id="address"
                                    type="text"
                                    required
                                    placeholder="123 Main Street, City, State"
                                />
                            </div>
                        </div>
                    )}

                    {['farm_manager', 'laborer', 'rider'].includes(selectedRole) && (
                        <div className="grid gap-4">
                            <p className="text-muted-foreground">
                                Your {selectedRole.replace('_', ' ')} profile is set up. You can complete additional details later.
                            </p>
                        </div>
                    )}

                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                </form>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <TextLink href={route('login')}>Log in</TextLink>
            </div>
        </AuthLayout>
    );
}