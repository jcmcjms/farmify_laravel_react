import { usePage } from '@inertiajs/react';
import type { SharedData, User } from '@/types';

export function useAuth() {
    const { auth } = usePage<SharedData>().props;
    return auth;
}

export function useUser(): User | null {
    const { auth } = usePage<SharedData>().props;
    return auth?.user ?? null;
}

export function usePageData<T>(): T {
    return usePage<SharedData>().props as T;
}

export function useFlash() {
    const page = usePage<SharedData>().props;
    return {
        success: (page as Record<string, unknown>).success as string | undefined,
        error: (page as Record<string, unknown>).error as string | undefined,
    };
}

export function getRoleFromUser(user: User | null): string {
    if (!user) return 'guest';
    return user.role || 'guest';
}

export function hasRole(user: User | null, roles: string | string[]): boolean {
    if (!user) return false;
    const userRole = user.role;
    if (typeof roles === 'string') {
        return userRole === roles;
    }
    return roles.includes(userRole);
}

export function canAccess(user: User | null, permissions: string | string[]): boolean {
    return true;
}