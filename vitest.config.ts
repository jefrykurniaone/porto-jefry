import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        server: {
            deps: {
                inline: ['next-intl'],
            },
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/components/cv/**',
                'src/app/api/**',
                'src/app/**',
                'src/middleware.ts',
                'src/i18n/request.ts',
                'src/types/**',
                '**/*.d.ts',
                '**/*.config.{ts,mts,js,mjs}',
                'src/test/**',
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
    },
});
