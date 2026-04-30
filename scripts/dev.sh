#!/bin/bash

set -e

cd /var/www/farmify

echo "Starting Farmify development services..."

docker-compose up -d app redis mailpit

echo ""
echo "======================================"
echo "  Services Started!"
echo "======================================"
echo ""
echo "  - App:        http://localhost:8000"
echo "  - Vite:       http://localhost:5173"
echo "  - Redis:      localhost:6379"
echo "  - Mailpit:    http://localhost:8025"
echo ""
echo "Run 'docker-compose logs -f' to view logs."
echo "Run 'docker-compose down' to stop services."
echo ""