import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
    className?: string;
}

export default function PageHeader({ 
    title, 
    description, 
    breadcrumbs, 
    actions,
    className 
}: PageHeaderProps) {
    return (
        <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
            <div>
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="mb-2 flex items-center gap-1 text-sm">
                        <Link 
                            href="/dashboard" 
                            className="flex items-center text-muted-foreground hover:text-foreground"
                        >
                            <Home className="h-3 w-3" />
                        </Link>
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                {index === breadcrumbs.length - 1 ? (
                                    <span className="font-medium">{crumb.title}</span>
                                ) : (
                                    <Link 
                                        href={crumb.href} 
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {crumb.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                )}
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-muted-foreground">{description}</p>
                )}
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
        </div>
    );
}