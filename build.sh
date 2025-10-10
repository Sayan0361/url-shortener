#!/bin/bash

echo "🚀 Building URL Shortener for production..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# The built frontend will be in frontend/dist/
# We'll handle copying this in the Dockerfile

echo "✅ Build completed!"