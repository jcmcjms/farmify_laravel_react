import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
    cleanup();
});

vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    Link: ({ children }: { children: unknown }) => children,
    useForm: () => ({
        data: {},
        setData: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        reset: vi.fn(),
        errors: {},
        processing: false,
        progress: null,
    }),
}));

Object.defineProperty(window, 'location', {
    value: { href: 'http://localhost', pathname: '/' },
    writable: true,
});

Object.defineProperty(window, 'history', {
    value: { pushState: vi.fn(), replaceState: vi.fn() },
    writable: true,
});