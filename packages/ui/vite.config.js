/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            react(),
            tsConfigPaths(),
            dts({
                entryRoot: 'src',
                staticImport: true,
            }),
        ],
        build: {
            target: 'esnext',
            outDir: 'dist',
            emptyOutDir: false, // prevent vite from deleting our dist folder on rebuild
            cssCodeSplit: true,
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                name: 'osc-ui',
                fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
                formats: ['es', 'cjs'],
            },
            rollupOptions: {
                // make sure to externalize deps that shouldn't be bundled
                // into your library
                external: [
                    ...Object.keys(pkg.dependencies ?? {}),
                    ...Object.keys(pkg.peerDependencies ?? {}),
                    'react/jsx-runtime',
                ],
                output: [
                    {
                        format: 'cjs',
                        preserveModules: true,
                        preserveModulesRoot: 'src',
                        exports: 'named',
                        entryFileNames: '[name].cjs',
                    },
                    {
                        format: 'es',
                        preserveModules: true,
                        preserveModulesRoot: 'src',
                        exports: 'named',
                        entryFileNames: '[name].mjs',
                    },
                ],
            },
        }
    };
});
