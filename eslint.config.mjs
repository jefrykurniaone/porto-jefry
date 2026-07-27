import { defineConfig, globalIgnores } from 'eslint/config';
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import sonarjs from 'eslint-plugin-sonarjs';

// Flat config replaces .eslintrc.json — Next 16 removed `next lint`, so the
// lint script now calls eslint directly and must declare its own ignores.
export default defineConfig([
    globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**']),
    ...coreWebVitals,
    ...nextTypescript,
    {
        plugins: { sonarjs },
        rules: {
            'max-lines': ['error', 300],
            'max-lines-per-function': ['error', 40],
            'sonarjs/no-nested-template-literals': 'error',
        },
    },
]);
