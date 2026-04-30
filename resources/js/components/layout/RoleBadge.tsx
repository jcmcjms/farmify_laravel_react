import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

const roleBadgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-farm-primary/10 text-farm-primary',
                farmer: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
                farm_manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
                laborer: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
                consumer: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
                rider: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
            },
            size: {
                sm: 'px-2 py-0.5 text-xs',
                md: 'px-2.5 py-0.5 text-xs',
                lg: 'px-3 py-1 text-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

interface RoleBadgeProps extends VariantProps<typeof roleBadgeVariants> {
    role: UserRole;
    className?: string;
}

const roleLabels: Record<UserRole, string> = {
    farmer: 'Farmer',
    farm_manager: 'Farm Manager',
    laborer: 'Laborer',
    consumer: 'Consumer',
    rider: 'Rider',
};

export default function RoleBadge({ role, className, size }: RoleBadgeProps) {
    return (
        <span className={cn(roleBadgeVariants({ variant: role, size, className }))}>
            {roleLabels[role] || role}
        </span>
    );
}

export { roleBadgeVariants };
export { roleLabels };