import { Link } from '@inertiajs/react';
import { Bell, Menu, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import RoleBadge from './RoleBadge';
import { cn } from '@/lib/utils';
import type { User, UserRole } from '@/types';

interface TopbarProps {
    role: UserRole;
    onMenuToggle: () => void;
}

export default function Topbar({ role, onMenuToggle }: TopbarProps) {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: role,
        phone: '+1234567890',
        avatar_url: undefined,
        email_verified_at: '2024-01-01',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex w-full items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuToggle}
                        className="rounded-md p-2 hover:bg-muted md:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="relative rounded-md p-2 hover:bg-muted"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-farm-primary text-sm font-medium text-farm-primary-foreground">
                                {mockUser.name.charAt(0)}
                            </div>
                            <span className="hidden text-sm font-medium md:inline-block">
                                {mockUser.name}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                        </button>

                        {userDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover p-1 shadow-md">
                                <div className="px-3 py-2 text-sm">
                                    <p className="font-medium">{mockUser.name}</p>
                                    <p className="text-muted-foreground">{mockUser.email}</p>
                                    <RoleBadge role={mockUser.role} />
                                </div>
                                <div className="border-t">
                                    <Link
                                        href="/settings/profile"
                                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Link>
                                    <Link
                                        href="/logout"
                                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}