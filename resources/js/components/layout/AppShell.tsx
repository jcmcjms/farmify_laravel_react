import { createContext, useContext, useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

interface AppShellContextType {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const AppShellContext = createContext<AppShellContextType | null>(null);

export function useAppShell() {
    const context = useContext(AppShellContext);
    if (!context) {
        throw new Error('useAppShell must be used within AppShell');
    }
    return context;
}

interface AppShellProps {
    children: ReactNode;
    role: UserRole;
}

export default function AppShell({ children, role }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AppShellContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
            <div className="min-h-screen bg-background">
                <Sidebar role={role} open={sidebarOpen} onOpenChange={setSidebarOpen} />
                <div className={cn('flex flex-col gap-6 pb-6 sm:gap-8', sidebarOpen ? 'sm:pl-64' : 'sm:pl-16')}>
                    <Topbar role={role} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </main>
                </div>
            </div>
        </AppShellContext.Provider>
    );
}