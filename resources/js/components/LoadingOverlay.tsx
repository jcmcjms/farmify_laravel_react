import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
    fullPage?: boolean;
    className?: string;
}

export default function LoadingOverlay({ fullPage = false, className }: LoadingOverlayProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-center',
                fullPage ? 'fixed inset-0 z-50 bg-background/80' : 'absolute inset-0 bg-background/50',
                className
            )}
        >
            <LoaderCircle className="h-8 w-8 animate-spin text-farm-primary" />
        </div>
    );
}