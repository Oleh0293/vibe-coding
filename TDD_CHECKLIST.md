# TDD Checklist - Task Manager API

## Overview
This checklist follows Test-Driven Development (TDD) methodology:
1. **RED** - Write a failing test
2. **GREEN** - Write minimal code to pass
3. **REFACTOR** - Clean up while keeping tests green

---

## Phase 1: Task CRUD Operations

### GET /api/tasks - List all tasks
- [x] Returns 200 and empty array when no tasks exist
- [ ] Returns 200 and array of tasks when tasks exist
- [ ] Tasks are ordered by createdAt descending

### POST /api/tasks - Create a task
- [ ] Returns 201 and created task with valid data
- [ ] Returns 400 when title is missing
- [ ] Returns 400 when title is empty string
- [ ] Created task has completed=false by default
- [ ] Created task has auto-generated id, createdAt, updatedAt

### GET /api/tasks/:id - Get single task
- [ ] Returns 200 and task when found
- [ ] Returns 404 when task not found
- [ ] Returns 400 for invalid id format

### PUT /api/tasks/:id - Update a task
- [ ] Returns 200 and updated task with valid data
- [ ] Returns 404 when task not found
- [ ] Returns 400 when title is empty string
- [ ] Can update title, description, completed
- [ ] updatedAt changes on update

### DELETE /api/tasks/:id - Delete a task
- [ ] Returns 204 on successful deletion
- [ ] Returns 404 when task not found

---

## Phase 2: Filtering & Search

### GET /api/tasks?completed=true/false
- [ ] Returns only completed tasks when completed=true
- [ ] Returns only incomplete tasks when completed=false

### GET /api/tasks?search=keyword
- [ ] Returns tasks matching title
- [ ] Returns tasks matching description
- [ ] Search is case-insensitive

---

## Phase 3: Pagination

### GET /api/tasks?page=1&limit=10
- [ ] Returns paginated results
- [ ] Returns correct total count
- [ ] Returns empty array for page beyond data

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

---

## Current Status

✅ **FIRST TEST IMPLEMENTED**: `GET /api/tasks` returns empty array

The first test is ready to run. Execute `npm test` in the backend directory to verify.
