import { Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Store, 
    Tractor, 
    ShoppingCart, 
    Users, 
    ClipboardList, 
    Package, 
    DollarSign, 
    MapPin,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole, NavItem as NavItemType } from '@/types';

interface SidebarProps {
    role: UserRole;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const roleMenuItems: Record<UserRole, NavItemType[]> = {
    farmer: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'My Farms', url: '/farms', icon: Tractor },
        { title: 'Products', url: '/products', icon: Package },
        { title: 'Jobs', url: '/jobs', icon: ClipboardList },
        { title: 'Orders', url: '/orders', icon: ShoppingCart },
        { title: 'Earnings', url: '/earnings', icon: DollarSign },
    ],
    farm_manager: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Assigned Farms', url: '/farms', icon: Tractor },
        { title: 'Products', url: '/products', icon: Package },
        { title: 'Jobs', url: '/jobs', icon: ClipboardList },
        { title: 'Team', url: '/team', icon: Users },
        { title: 'Reports', url: '/reports', icon: Store },
    ],
    laborer: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Jobs', url: '/jobs', icon: ClipboardList },
        { title: 'My Applications', url: '/my-applications', icon: Package },
        { title: 'Work History', url: '/work-history', icon: Store },
        { title: 'Earnings', url: '/earnings', icon: DollarSign },
    ],
    consumer: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Browse Products', url: '/products', icon: Store },
        { title: 'My Orders', url: '/orders', icon: ShoppingCart },
        { title: 'Subscriptions', url: '/subscriptions', icon: Package },
        { title: 'Addresses', url: '/addresses', icon: MapPin },
    ],
    rider: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Deliveries', url: '/deliveries', icon: Tractor },
        { title: 'Earnings', url: '/earnings', icon: DollarSign },
        { title: 'Profile', url: '/profile', icon: Users },
    ],
};

export default function Sidebar({ role, open, onOpenChange }: SidebarProps) {
    const menuItems = roleMenuItems[role] || roleMenuItems.consumer;

    return (
        <>
            <div 
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-sidebar transition-transform duration-200 ease-in-out dark:border-sidebar-border md:translate-x-0',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-16 items-center border-b border-sidebar-border px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <Tractor className="h-6 w-6 text-farm-primary" />
                        <span className="text-lg text-sidebar-foreground">Farmify</span>
                    </Link>
                </div>
                <nav className="space-y-1 p-4">
                    {menuItems.map((item) => (
                        <NavLink key={item.url} item={item} />
                    ))}
                </nav>
            </div>
            {open && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => onOpenChange(false)}
                />
            )}
        </>
    );
}

interface NavLinkProps {
    item: NavItemType;
}

function NavLink({ item }: NavLinkProps) {
    const Icon = item.icon;
    
    return (
        <Link
            href={item.url}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
        >
            {Icon && <Icon className="h-4 w-4" />}
            {item.title}
        </Link>
    );
}