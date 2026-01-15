import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

import { execSync } from 'child_process';
import prisma from '../lib/prisma';

// Reset database before all tests
beforeAll(async () => {
  // Push schema to test database (creates tables without migrations)
  execSync('npx prisma db push --force-reset', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
  });
});

// Clean up database after each test
afterEach(async () => {
  // Delete all tasks after each test
  await prisma.task.deleteMany();
});

// Disconnect Prisma after all tests
afterAll(async () => {
  await prisma.$disconnect();
});
