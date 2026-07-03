#!/bin/bash

# Headless Blog CMS - Quick Start Script
# This script starts the development server

echo "🚀 Starting Headless Blog CMS..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

echo ""
echo "🔥 Starting development server..."
echo ""
echo "📍 Website:  http://localhost:3000"
echo "📍 Admin:    http://localhost:3000/admin"
echo "📍 API:      http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
