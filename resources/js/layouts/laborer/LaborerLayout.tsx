import { Head } from '@inertiajs/react';
import AppShell from '@/components/layout/AppShell';

interface LaborerLayoutProps {
    children: React.ReactNode;
}

export default function LaborerLayout({ children }: LaborerLayoutProps) {
    return (
        <AppShell role="laborer">
            <Head title="Farmify - Laborer" />
            {children}
        </AppShell>
    );
}