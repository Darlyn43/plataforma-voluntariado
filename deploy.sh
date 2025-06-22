#!/bin/bash

# Deployment script for Manuchar Peru Volunteer Platform

echo "🚀 Starting deployment process..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

# Build frontend for Firebase hosting
echo "🌐 Building frontend for hosting..."
npx vite build --outDir dist

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo "🔥 Deploying to Firebase..."

# Deploy to Firebase (requires authentication)
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌟 Your Manuchar Peru Volunteer Platform is now live!"
else
    echo "❌ Deployment failed. Please check your Firebase authentication."
    echo "💡 Run 'firebase login' first if you haven't authenticated."
fi