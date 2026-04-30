# Farmify

> Modern farm management system built with Laravel 12, React 19, and Vite

[![Laravel](https://img.shields.io/badge/Laravel-12.0-red?style=flat-square&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple?style=flat-square&logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-ready-blue?style=flat-square&logo=docker)](https://www.docker.com)

## Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **SQLite** (Development) / **MySQL 8** (Production)
- **Redis** - Caching & Queue
- **Inertia.js** - SPA Bridge

### Frontend
- **React 19** - UI Library
- **Vite 6** - Build Tool
- **TypeScript 5.7** - Type Safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Headless Components
- **Lucide** - Icons

## Quick Start

### Prerequisites
- PHP 8.2+
- Node.js 20+
- Composer
- Docker (optional)

### 5-Minute Setup

```bash
# 1. Clone and enter directory
cd farmify

# 2. Install PHP dependencies
composer install

# 3. Install Node dependencies
npm install

# 4. Create environment file
cp .env.example .env
php artisan key:generate

# 5. Start development server
npm run dev
```

Visit [http://localhost:8000](http://localhost:8000)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | Farmify | Application name |
| `APP_ENV` | local | Environment (local/production) |
| `APP_DEBUG` | true | Debug mode |
| `APP_URL` | http://localhost:8000 | Application URL |
| `DB_CONNECTION` | sqlite | Database driver |
| `DB_DATABASE` | database.sqlite | Database path |
| `SESSION_DRIVER` | file | Session driver |
| `CACHE_STORE` | file | Cache driver |
| `QUEUE_CONNECTION` | sync | Queue driver |
| `MAIL_MAILER` | log | Mail driver |

## Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run Vitest tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run typecheck` | Run TypeScript check |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run lint:check` | Check linting |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |

## Docker Setup

### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services:**
- App: http://localhost:8000
- Vite: http://localhost:5173
- Redis: localhost:6379
- Mailpit: http://localhost:8025

### Production

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Scale queue workers
docker-compose -f docker-compose.prod.yml up -d --scale queue=3
```

## Architecture Overview (C4)

### Context Level
```
┌─────────────────────────────────────────────────────────┐
│                    Farmify System                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Farmer    │    │  Manager    │    │   Admin     │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘  │
│         │                   │                   │       │
└─────────┼───────────────────┼───────────────────┼───────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Web Application  │
                    │  (Laravel + React) │
                    └─────────┬─────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────┴────┐         ┌─────┴─────┐        ┌────┴────┐
    │  MySQL  │         │   Redis   │        │ Storage │
    └─────────┘         └───────────┘        └─────────┘
```

### Project Structure

```
farmify/
├── app/                    # Laravel application
│   ├── Http/              # Controllers & Middleware
│   ├── Models/            # Eloquent Models
│   └── Providers/        # Service Providers
├── bootstrap/             # Application bootstrap
├── config/                # Configuration files
├── database/              # Migrations & Seeders
├── resources/
│   ├── js/               # React components
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── test/         # Test files
│   │   └── types/        # TypeScript types
│   └── views/            # Blade views
├── routes/               # Route definitions
├── storage/              # Application storage
├── tests/                # PHPUnit tests
├── docker/                # Docker configs
├── scripts/              # Helper scripts
├── .github/workflows/    # CI/CD pipelines
└── .vscode/              # VS Code settings
```

## API Endpoints

| Method | URI | Description |
|--------|-----|-------------|
| GET | / | Dashboard |
| GET | /login | Login page |
| GET | /register | Registration |
| POST | /login | Authenticate |
| POST | /logout | Logout |
| GET | /settings | Settings |
| PUT | /settings/profile | Update profile |

## Development

### Running Tests

```bash
# Run all tests
php artisan test

# Run with coverage
php artisan test --coverage

# Run frontend tests
npm run test

# Run frontend tests with UI
npm run test:ui
```

### Code Quality

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details