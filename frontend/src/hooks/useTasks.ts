import { useState, useCallback, useEffect } from 'react';
import { Task, FilterStatus } from '../types/task';
import { tasksApi, ApiError } from '../api/tasks';

interface UseTasksReturn {
  tasks: Task[];
  allTasks: Task[];
  loading: boolean;
  error: string | null;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  addTask: (title: string) => Promise<void>;
  completeTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  clearError: () => void;
}

export function useTasks(): UseTasksReturn {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('ALL');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await tasksApi.getAll();
      setAllTasks(tasks);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch tasks');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (title: string) => {
    try {
      setError(null);
      const newTask = await tasksApi.create(title);
      setAllTasks(prev => [newTask, ...prev]);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create task');
      }
      throw err;
    }
  }, []);

  const completeTask = useCallback(async (id: number) => {
    try {
      setError(null);
      const updatedTask = await tasksApi.complete(id);
      setAllTasks(prev =>
        prev.map(task => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to complete task');
      }
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      setError(null);
      await tasksApi.delete(id);
      setAllTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete task');
      }
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Filter tasks based on current filter
  const tasks = allTasks.filter(task => {
    if (filter === 'ALL') return true;
    return task.status === filter;
  });

  return {
    tasks,
    allTasks,
    loading,
    error,
    filter,
    setFilter,
    addTask,
    completeTask,
    deleteTask,
    clearError,
  };
}
