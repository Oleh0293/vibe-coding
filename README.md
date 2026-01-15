# Task Manager - Fullstack Monorepo

A fullstack task management application built with modern technologies and TDD practices.

## Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library

### E2E Testing
- **Framework**: Playwright

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Setup (from clean clone)

```bash
# 1. Install all dependencies
npm install

# 2. Set up environment files
cp backend/.env.example backend/.env

# 3. Generate Prisma client and create database
cd backend && npx prisma generate && npx prisma db push && cd ..

# 4. Install Playwright browsers (for E2E tests)
cd e2e && npx playwright install chromium && cd ..
```

### Running the Application

```bash
# Run both backend and frontend concurrently
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Running Tests

```bash
# Run all unit/integration tests (backend + frontend)
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend

# Run E2E tests (starts servers automatically)
npm run test:e2e

# Run ALL tests (unit + integration + E2E)
npm run test:all

# Watch mode for backend tests
npm run test:watch
```

## Project Structure

```
├── backend/                    # Express API server
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── lib/prisma.ts       # Prisma client singleton
│   │   ├── routes/tasks.ts     # Task CRUD endpoints
│   │   ├── tests/
│   │   │   ├── setup.ts        # Jest test setup
│   │   │   └── tasks.test.ts   # API tests (23 tests)
│   │   ├── app.ts              # Express app config
│   │   └── index.ts            # Server entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── api/tasks.ts        # API client
│   │   ├── components/         # React components
│   │   │   ├── TaskInput.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── FilterTabs.tsx
│   │   │   ├── Stats.tsx
│   │   │   └── ErrorBanner.tsx
│   │   ├── hooks/useTasks.ts   # Task state management
│   │   ├── types/task.ts       # TypeScript types
│   │   ├── test/
│   │   │   ├── setup.ts
│   │   │   ├── mocks.ts        # MSW handlers
│   │   │   └── App.test.tsx    # Component tests (5 tests)
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── e2e/                        # Playwright E2E tests
│   ├── tests/
│   │   └── tasks.spec.ts       # E2E scenarios (6 tests)
│   ├── playwright.config.ts
│   └── package.json
│
├── package.json                # Root workspace config
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | List all tasks |
| `GET` | `/api/tasks?status=OPEN` | List open tasks |
| `GET` | `/api/tasks?status=DONE` | List completed tasks |
| `POST` | `/api/tasks` | Create task `{ title: string }` |
| `PATCH` | `/api/tasks/:id/complete` | Mark task as done |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/health` | Health check |

### Validation Rules
- `title` is required (1-120 characters)
- `status` must be `OPEN`, `DONE`, or `ALL`

## Architecture Notes

### Backend
- **Express** handles HTTP routing with typed request/response
- **Prisma** provides type-safe database access with SQLite
- **Validation** is done at the route level before database operations
- **Tests** use a separate test database that resets between tests

### Frontend
- **React** with functional components and hooks
- **useTasks hook** centralizes all task state and API calls
- **Optimistic updates** - UI updates immediately, rolls back on error
- **MSW** mocks API calls in component tests

### E2E Tests
- **Playwright** runs against real backend and frontend
- **Database reset** before each test ensures isolation
- **Auto-starts servers** via `webServer` config

## Development Workflow

This project follows **Test-Driven Development (TDD)**:

1. Write a failing test
2. Write minimal code to pass
3. Refactor while keeping tests green

See [TDD_CHECKLIST.md](TDD_CHECKLIST.md) for the complete test plan.

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start backend + frontend |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm test` | Run unit/integration tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:all` | Run all tests |
| `npm run build` | Build all workspaces |

## License

MIT
# vibe-coding
