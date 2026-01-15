import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onComplete: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'DONE';

  const handleComplete = async () => {
    if (isCompleted) return;
    try {
      await onComplete(task.id);
    } catch {
      // Error handled by parent
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(task.id);
    } catch {
      // Error handled by parent
    }
  };

  return (
    <li
      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
      data-testid={`task-item-${task.id}`}
    >
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          isCompleted
            ? 'bg-green-500 border-green-500 cursor-default'
            : 'border-gray-300 hover:border-green-500'
        }`}
        title={isCompleted ? 'Completed' : 'Mark as complete'}
        data-testid={`complete-btn-${task.id}`}
      >
        {isCompleted && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}
        data-testid={`task-title-${task.id}`}
      >
        {task.title}
      </span>

      <button
        onClick={handleDelete}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete task"
        data-testid={`delete-btn-${task.id}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  );
}
