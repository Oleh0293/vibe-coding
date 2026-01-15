import request from 'supertest';
import app from '../app';
import prisma from '../lib/prisma';

describe('Tasks API', () => {
  // ============================================
  // GET /api/tasks
  // ============================================
  describe('GET /api/tasks', () => {
    it('should return an empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual([]);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return all tasks when tasks exist', async () => {
      // Create test tasks
      await prisma.task.createMany({
        data: [
          { title: 'Task 1', status: 'OPEN' },
          { title: 'Task 2', status: 'DONE' }
        ]
      });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('status');
      expect(response.body[0]).toHaveProperty('createdAt');
      expect(response.body[0]).toHaveProperty('updatedAt');
    });

    it('should filter tasks by status=OPEN', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Open Task', status: 'OPEN' },
          { title: 'Done Task', status: 'DONE' }
        ]
      });

      const response = await request(app)
        .get('/api/tasks?status=OPEN')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Open Task');
      expect(response.body[0].status).toBe('OPEN');
    });

    it('should filter tasks by status=DONE', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Open Task', status: 'OPEN' },
          { title: 'Done Task', status: 'DONE' }
        ]
      });

      const response = await request(app)
        .get('/api/tasks?status=DONE')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Done Task');
      expect(response.body[0].status).toBe('DONE');
    });

    it('should return all tasks when status=ALL', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Open Task', status: 'OPEN' },
          { title: 'Done Task', status: 'DONE' }
        ]
      });

      const response = await request(app)
        .get('/api/tasks?status=ALL')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=INVALID')
        .expect(400);

      expect(response.body.error).toBe('Invalid status. Must be OPEN, DONE, or ALL');
    });

    it('should return tasks ordered by createdAt descending', async () => {
      const task1 = await prisma.task.create({ data: { title: 'First' } });
      await new Promise(resolve => setTimeout(resolve, 10));
      const task2 = await prisma.task.create({ data: { title: 'Second' } });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body[0].id).toBe(task2.id);
      expect(response.body[1].id).toBe(task1.id);
    });
  });

  // ============================================
  // POST /api/tasks
  // ============================================
  describe('POST /api/tasks', () => {
    it('should create a task with valid title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'New Task' })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New Task');
      expect(response.body.status).toBe('OPEN');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should trim whitespace from title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '  Trimmed Task  ' })
        .expect(201);

      expect(response.body.title).toBe('Trimmed Task');
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });

    it('should return 400 when title is empty string', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '' })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });

    it('should return 400 when title is only whitespace', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });

    it('should return 400 when title exceeds 120 characters', async () => {
      const longTitle = 'a'.repeat(121);
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: longTitle })
        .expect(400);

      expect(response.body.error).toBe('Title must be at most 120 characters');
    });

    it('should accept title with exactly 120 characters', async () => {
      const maxTitle = 'a'.repeat(120);
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: maxTitle })
        .expect(201);

      expect(response.body.title).toBe(maxTitle);
    });

    it('should return 400 when title is not a string', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 123 })
        .expect(400);

      expect(response.body.error).toBe('Title must be a string');
    });
  });

  // ============================================
  // PATCH /api/tasks/:id/complete
  // ============================================
  describe('PATCH /api/tasks/:id/complete', () => {
    it('should mark a task as complete', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task to complete', status: 'OPEN' }
      });

      const response = await request(app)
        .patch(`/api/tasks/${task.id}/complete`)
        .expect(200);

      expect(response.body.id).toBe(task.id);
      expect(response.body.status).toBe('DONE');
    });

    it('should return 404 when task not found', async () => {
      const response = await request(app)
        .patch('/api/tasks/99999/complete')
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid task ID', async () => {
      const response = await request(app)
        .patch('/api/tasks/invalid/complete')
        .expect(400);

      expect(response.body.error).toBe('Invalid task ID');
    });

    it('should update updatedAt when completing task', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task to complete' }
      });
      const originalUpdatedAt = task.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 10));

      const response = await request(app)
        .patch(`/api/tasks/${task.id}/complete`)
        .expect(200);

      expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });

    it('should work on already completed task', async () => {
      const task = await prisma.task.create({
        data: { title: 'Already done', status: 'DONE' }
      });

      const response = await request(app)
        .patch(`/api/tasks/${task.id}/complete`)
        .expect(200);

      expect(response.body.status).toBe('DONE');
    });
  });

  // ============================================
  // DELETE /api/tasks/:id
  // ============================================
  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task to delete' }
      });

      await request(app)
        .delete(`/api/tasks/${task.id}`)
        .expect(204);

      // Verify task is deleted
      const deletedTask = await prisma.task.findUnique({ where: { id: task.id } });
      expect(deletedTask).toBeNull();
    });

    it('should return 404 when task not found', async () => {
      const response = await request(app)
        .delete('/api/tasks/99999')
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid task ID', async () => {
      const response = await request(app)
        .delete('/api/tasks/invalid')
        .expect(400);

      expect(response.body.error).toBe('Invalid task ID');
    });
  });
});
