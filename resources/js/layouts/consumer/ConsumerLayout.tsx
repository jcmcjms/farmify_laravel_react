import { Head } from '@inertiajs/react';
import AppShell from '@/components/layout/AppShell';
import type { UserRole } from '@/types';

interface ConsumerLayoutProps {
    children: React.ReactNode;
}

export default function ConsumerLayout({ children }: ConsumerLayoutProps) {
    return (
        <AppShell role="consumer">
            <Head title="Farmify - Consumer" />
            {children}
        </AppShell>
    );
}