import { useAuth } from '@/lib/api';
import type { UserRole } from '@/types';
import { RoleBadge } from '@/components/layout/RoleBadge';

interface RoleGuardProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
    const auth = useAuth();
    const user = auth?.user;

    if (!user) {
        return <>{fallback}</>;
    }

    const userRole = user.role;

    if (!allowedRoles.includes(userRole)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}