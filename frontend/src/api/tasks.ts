import { Task, FilterStatus } from '../types/task';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || 'Unknown error');
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }
  
  return response.json();
}

export const tasksApi = {
  async getAll(status: FilterStatus = 'ALL'): Promise<Task[]> {
    const params = status !== 'ALL' ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE}/tasks${params}`);
    return handleResponse<Task[]>(response);
  },

  async create(title: string): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return handleResponse<Task>(response);
  },

  async complete(id: number): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}/complete`, {
      method: 'PATCH',
    });
    return handleResponse<Task>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};
