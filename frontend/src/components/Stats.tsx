interface StatsProps {
  total: number;
  open: number;
  done: number;
}

export function Stats({ total, open, done }: StatsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-3 text-sm text-gray-500 border-t border-gray-200" data-testid="stats">
      <span>
        <span className="font-medium text-gray-700">{total}</span> total
      </span>
      <span className="text-gray-300">•</span>
      <span>
        <span className="font-medium text-blue-600">{open}</span> open
      </span>
      <span className="text-gray-300">•</span>
      <span>
        <span className="font-medium text-green-600">{done}</span> done
      </span>
    </div>
  );
}
