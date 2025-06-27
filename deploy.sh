#!/bin/bash

# Manuchar Perú Volunteer Platform Deployment Script (Supabase Version)

echo "🚀 Iniciando deployment de Manuchar Perú Voluntariado..."

# Limpiar carpeta dist anterior
rm -rf dist

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Construir frontend
echo "🧱 Construyendo frontend con Vite..."
npx vite build --mode=production --outDir=dist

# Construir backend (usando esbuild)
echo "🧠 Empaquetando backend con esbuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "✅ Build completado correctamente!"
echo ""
echo "🛫 Ahora puedes desplegarlos usando tu plataforma preferida (Netlify, Vercel, Fly.io, etc.)"
