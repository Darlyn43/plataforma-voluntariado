#!/bin/bash

# Manuchar Perú Volunteer Platform Deployment Script

echo "🚀 Iniciando deployment de Manuchar Perú Voluntariado..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI no está instalado. Instalando..."
    npm install -g firebase-tools
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "Por favor, autentícate con Firebase:"
    firebase login
fi

# Set Firebase project
echo "Configurando proyecto Firebase..."
firebase use manuchar-peru-voluntariado --add

# Install dependencies
echo "Instalando dependencias..."
npm install

# Build the application
echo "Construyendo aplicación..."
npm run build

# Build for hosting specifically
echo "Preparando archivos para hosting..."
npx vite build --outDir dist

# Deploy to Firebase
echo "Desplegando a Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment completado!"
echo "📱 Tu aplicación está disponible en: https://manuchar-peru-voluntariado.web.app"
echo ""
echo "🔧 No olvides configurar en Firebase Console:"
echo "   1. Autenticación Email/Password habilitada"
echo "   2. Base de datos Firestore creada"
echo "   3. Dominios autorizados agregados"
echo "   4. Variables de entorno configuradas"