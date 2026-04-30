import { Head, Link, useRoute } from '@inertiajs/react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
    title?: string;
    message?: string;
    status?: number;
}

export default function ErrorPage({ 
    title = 'Something went wrong', 
    message = 'An unexpected error occurred. Please try again.',
    status 
}: ErrorPageProps) {
    const errorMessages: Record<number, string> = {
        403: "You don't have permission to access this page.",
        404: 'The page you are looking for does not exist.',
        500: 'Server error. Please try again later.',
        503: 'Service unavailable. Please try again later.',
    };

    const displayMessage = status ? errorMessages[status] || message : message;

    return (
        <>
            <Head title={title} />
            <div className="flex min-h-[400px] flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-destructive/10 p-4">
                    <AlertTriangle className="h-10 w-10 text-destructive" />
                </div>
                <h1 className="mb-2 text-2xl font-bold">{title}</h1>
                <p className="mb-6 max-w-md text-muted-foreground">{displayMessage}</p>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}