import { FilterStatus } from '../types/task';

interface FilterTabsProps {
  current: FilterStatus;
  onChange: (filter: FilterStatus) => void;
  counts: {
    all: number;
    open: number;
    done: number;
  };
}

const tabs: { value: FilterStatus; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'DONE', label: 'Done' },
];

export function FilterTabs({ current, onChange, counts }: FilterTabsProps) {
  const getCount = (value: FilterStatus) => {
    switch (value) {
      case 'ALL': return counts.all;
      case 'OPEN': return counts.open;
      case 'DONE': return counts.done;
    }
  };

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            current === tab.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          data-testid={`filter-${tab.value.toLowerCase()}`}
        >
          {tab.label}
          <span className={`ml-2 text-sm ${
            current === tab.value ? 'text-blue-400' : 'text-gray-400'
          }`}>
            ({getCount(tab.value)})
          </span>
        </button>
      ))}
    </div>
  );
}
