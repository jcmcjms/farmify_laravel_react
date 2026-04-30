import { Head } from '@inertiajs/react';
import AppShell from '@/components/layout/AppShell';
import type { UserRole } from '@/types';

interface AppLayoutProps {
    role: UserRole;
    children: React.ReactNode;
}

export default function AppLayout({ role, children }: AppLayoutProps) {
    return (
        <AppShell role={role}>
            <Head title="Farmify" />
            {children}
        </AppShell>
    );
}