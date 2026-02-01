import { SlidersHorizontal, ArrowUpDown, TrendingDown } from 'lucide-react';

interface FilterBarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  onFilterClick: () => void;
  resultCount: number;
}

const SORT_LABELS: Record<string, string> = {
  'price-asc': 'Pris: Lägst först',
  'price-desc': 'Pris: Högst först',
  'data-desc': 'Data: Mest först',
  'best-value': 'Bästa värde',
};

export function FilterBar({ sortBy, onSortChange, onFilterClick, resultCount }: FilterBarProps) {
  const currentSortLabel = SORT_LABELS[sortBy] || 'Sorterat';

  return (
    <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-white to-green-50/50 rounded-xl border-2 border-green-200 shadow-md">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {resultCount}
          </div>
          <div className="text-sm">
            <div className="font-bold text-gray-900">Hittade erbjudanden</div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-green-600" />
              {currentSortLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-green-700" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-sm border-2 border-green-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 font-semibold hover:border-green-400 transition-all"
          >
            <option value="price-asc">💰 Pris: Lägst först</option>
            <option value="price-desc">Pris: Högst först</option>
            <option value="data-desc">📊 Data: Mest först</option>
            <option value="best-value">⭐ Bästa värde</option>
          </select>
        </div>

        {/* Filter Button - Mobile */}
        <button
          onClick={onFilterClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border-2 border-green-400 rounded-lg bg-white text-gray-700 hover:bg-green-50 hover:border-green-500 transition-all md:hidden font-semibold shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </button>
      </div>
    </div>
  );
}