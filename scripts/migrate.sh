#!/bin/bash

set -e

cd /var/www/farmify

echo "Running migrations..."

php artisan migrate

echo ""
echo "Migrations complete!"