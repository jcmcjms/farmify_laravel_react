# ===========================================
# PHP Build Stage
# ===========================================
FROM php:8.3-fpm-alpine AS php-build

RUN apk add --no-cache \
    composer \
    nodejs \
    npm \
    git \
    unzip \
    libzip-dev \
    oniguruma-dev \
    && docker-php-ext-install \
        pdo \
        pdo_sqlite \
        zip \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
    && pecl install redis \
    && docker-php-ext-enable redis

WORKDIR /var/www/farmify

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

# ===========================================
# Node Build Stage
# ===========================================
FROM node:22-alpine AS node-build

WORKDIR /var/www/farmify

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# ===========================================
# Application Stage
# ===========================================
FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    composer \
    libzip-dev \
    oniguruma-dev \
    linux-headers \
    $PHPIZE_DEPS \
    && docker-php-ext-install \
        pdo \
        pdo_sqlite \
        zip \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /var/cache/apk/*

WORKDIR /var/www/farmify

COPY --from=php-build /var/www/farmify/vendor ./vendor
COPY --from=node-build /var/www/farmify/public ./public
COPY --from=node-build /var/www/farmify/bootstrap ./bootstrap

RUN chown -R www-data:www-data /var/www/farmify

EXPOSE 9000

CMD ["php-fpm"]