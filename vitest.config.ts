import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            exclude: ['./*.config.*', './next-env.d.ts', './src/app/layout.tsx', './.next/**', '**/src/components/ui'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // Alias configuration
        },
    },
})