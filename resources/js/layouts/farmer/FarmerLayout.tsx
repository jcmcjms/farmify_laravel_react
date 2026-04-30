import { Head } from '@inertiajs/react';
import AppShell from '@/components/layout/AppShell';

interface FarmerLayoutProps {
    children: React.ReactNode;
}

export default function FarmerLayout({ children }: FarmerLayoutProps) {
    return (
        <AppShell role="farmer">
            <Head title="Farmify - Farmer" />
            {children}
        </AppShell>
    );
}