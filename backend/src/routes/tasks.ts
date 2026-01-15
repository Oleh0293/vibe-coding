import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Valid status values
type TaskStatus = 'OPEN' | 'DONE';
const VALID_STATUSES: TaskStatus[] = ['OPEN', 'DONE'];

// Validation constants
const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 120;

// Validate title
function validateTitle(title: unknown): { valid: boolean; error?: string } {
  if (title === undefined || title === null) {
    return { valid: false, error: 'Title is required' };
  }
  if (typeof title !== 'string') {
    return { valid: false, error: 'Title must be a string' };
  }
  const trimmed = title.trim();
  if (trimmed.length < TITLE_MIN_LENGTH) {
    return { valid: false, error: 'Title is required' };
  }
  if (trimmed.length > TITLE_MAX_LENGTH) {
    return { valid: false, error: `Title must be at most ${TITLE_MAX_LENGTH} characters` };
  }
  return { valid: true };
}

// GET /api/tasks - Get all tasks with optional status filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let where = {};
    if (status && status !== 'ALL') {
      if (status !== 'OPEN' && status !== 'DONE') {
        return res.status(400).json({ error: 'Invalid status. Must be OPEN, DONE, or ALL' });
      }
      where = { status: status as TaskStatus };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    
    const validation = validateTitle(title);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        status: 'OPEN'
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PATCH /api/tasks/:id/complete - Mark a task as complete
router.patch('/:id/complete', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { status: 'DONE' }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
