import { Head } from '@inertiajs/react';
import AppShell from '@/components/layout/AppShell';
import type { UserRole } from '@/types';

interface RiderLayoutProps {
    children: React.ReactNode;
}

export default function RiderLayout({ children }: RiderLayoutProps) {
    return (
        <AppShell role="rider">
            <Head title="Farmify - Rider" />
            {children}
        </AppShell>
    );
}