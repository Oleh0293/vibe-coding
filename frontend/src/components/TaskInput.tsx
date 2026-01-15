import { useState, FormEvent } from 'react';

interface TaskInputProps {
  onAdd: (title: string) => Promise<void>;
  disabled?: boolean;
}

export function TaskInput({ onAdd, disabled }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || submitting) return;

    try {
      setSubmitting(true);
      await onAdd(trimmed);
      setTitle('');
    } catch {
      // Error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={120}
        disabled={disabled || submitting}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        data-testid="task-input"
      />
      <button
        type="submit"
        disabled={disabled || submitting || !title.trim()}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        data-testid="add-task-btn"
      >
        {submitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
