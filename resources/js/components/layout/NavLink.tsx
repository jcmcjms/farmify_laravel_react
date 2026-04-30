import { Link } from '@inertiajs/react';
import { useLocation } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavLinkProps {
    href: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
    activeClassName?: string;
}

export default function NavLink({ 
    href, 
    icon: Icon, 
    children, 
    className,
    activeClassName = 'bg-sidebar-accent text-sidebar-accent-foreground' 
}: NavLinkProps) {
    const location = useLocation();
    const isActive = location === href;

    return (
        <Link
            href={href}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive && activeClassName,
                className
            )}
        >
            {Icon && <Icon className="h-4 w-4" />}
            {children}
        </Link>
    );
}