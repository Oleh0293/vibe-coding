import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Task } from '../types/task';

// Mock data for tests
export const mockTasks: Task[] = [
  { id: 1, title: 'Test Task 1', status: 'OPEN', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
  { id: 2, title: 'Test Task 2', status: 'DONE', createdAt: '2026-01-15T09:00:00Z', updatedAt: '2026-01-15T09:30:00Z' },
];

export const handlers = [
  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let tasks = [...mockTasks];
    if (status === 'OPEN') {
      tasks = tasks.filter(t => t.status === 'OPEN');
    } else if (status === 'DONE') {
      tasks = tasks.filter(t => t.status === 'DONE');
    }
    
    return HttpResponse.json(tasks);
  }),

  http.post('/api/tasks', async ({ request }) => {
    const body = await request.json() as { title: string };
    const newTask: Task = {
      id: Date.now(),
      title: body.title,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.patch('/api/tasks/:id/complete', ({ params }) => {
    const id = Number(params.id);
    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      return HttpResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return HttpResponse.json({ ...task, status: 'DONE' });
  }),

  http.delete('/api/tasks/:id', ({ params }) => {
    const id = Number(params.id);
    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      return HttpResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),
];

export const server = setupServer(...handlers);
