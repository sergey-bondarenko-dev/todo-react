/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import  { fileURLToPath, URL } from 'node:url'
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze'
  const isProd = mode === 'production' || isAnalyze

  return {
    base: isProd ? '/todo-react' : '/',
    plugins: [
      react(),
      isAnalyze && visualizer({
        filename: 'dist/stats.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        open: false,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      setupFiles: './src/test/setup.ts',
      environmentOptions: {
        jsdom: {
          url: 'http://localhost/',
        }
      },
      exclude: [
        ...configDefaults.exclude,
        'e2e/**',
      ],
    },
  }
})
