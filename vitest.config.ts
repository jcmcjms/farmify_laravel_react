import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./resources/js/test/setup.ts'],
        include: ['resources/js/**/*.spec.{ts,tsx}', 'resources/js/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['resources/js/**/*.{ts,tsx}'],
            exclude: ['resources/js/**/*.d.ts', 'resources/js/**/*.spec.{ts,tsx}', 'resources/js/**/*.test.{ts,tsx}'],
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './resources/js'),
        },
    },
});