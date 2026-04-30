#!/bin/bash

set -e

echo "======================================"
echo "  Farmify Development Setup"
echo "======================================"

cd /var/www/farmify

echo "[1/5] Installing PHP dependencies..."
composer install --no-interaction

echo "[2/5] Installing Node dependencies..."
npm install

echo "[3/5] Creating environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
fi

echo "[4/5] Generating application key..."
php artisan key:generate --force

echo "[5/5] Setting up SQLite database..."
touch database/database.sqlite
php artisan migrate --force

echo ""
echo "======================================"
echo "  Setup Complete!"
echo "======================================"
echo ""
echo "Run 'npm run dev' to start the development server."
echo "Visit http://localhost:8000 in your browser."
echo ""