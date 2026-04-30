import * as React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)} {...props}>
            {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
            <h3 className="mb-1 text-base font-semibold">{title}</h3>
            {description && <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>}
            {action}
        </div>
    );
}

export { EmptyState };