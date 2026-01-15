export type TaskStatus = 'OPEN' | 'DONE';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type FilterStatus = 'ALL' | 'OPEN' | 'DONE';
