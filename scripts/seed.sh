#!/bin/bash

set -e

cd /var/www/farmify

echo "Running seeders..."

php artisan db:seed

echo ""
echo "Seeders complete!"