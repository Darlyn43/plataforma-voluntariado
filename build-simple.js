#!/usr/bin/env node

import { build } from 'vite';
import { execSync } from 'child_process';

console.log('🔨 Building Manuchar Perú Volunteer Platform...');

try {
  // Build frontend with Vite
  console.log('Building frontend...');
  await build({
    outDir: 'dist',
    mode: 'production',
    build: {
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
           vendor: ['react', 'react-dom'],
           ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog']
         }

        }
      }
    }
  });
  
  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Files ready in dist/ directory');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}