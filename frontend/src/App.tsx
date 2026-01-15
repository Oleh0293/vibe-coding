import { useTasks } from './hooks/useTasks';
import { TaskInput, TaskList, FilterTabs, Stats, ErrorBanner } from './components';

function App() {
  const {
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
  } = useTasks();

  const counts = {
    all: allTasks.length,
    open: allTasks.filter(t => t.status === 'OPEN').length,
    done: allTasks.filter(t => t.status === 'DONE').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-500 mt-1">Stay organized, get things done</p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Input Section */}
          <div className="p-4 border-b border-gray-200">
            <TaskInput onAdd={addTask} disabled={loading} />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 border-b border-gray-200">
              <ErrorBanner message={error} onDismiss={clearError} />
            </div>
          )}

          {/* Filter Tabs */}
          <div className="p-4 border-b border-gray-200 flex justify-center">
            <FilterTabs current={filter} onChange={setFilter} counts={counts} />
          </div>

          {/* Task List */}
          <div className="p-4 min-h-[200px]">
            <TaskList
              tasks={tasks}
              loading={loading}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          </div>

          {/* Stats */}
          {!loading && allTasks.length > 0 && (
            <Stats total={counts.all} open={counts.open} done={counts.done} />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-400">
          Built with React + TypeScript + Tailwind
        </footer>
      </div>
    </div>
  );
}

export default App;
