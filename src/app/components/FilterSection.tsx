import type { SortOption } from '@/hooks/useFilteredPlans';

interface FilterSectionProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultsCount?: number;
}

const sortChips: Array<{ value: SortOption; label: string; ariaLabel: string }> = [
  { value: 'best-deals', label: 'أفضل العروض', ariaLabel: 'أفضل العروض' },
  { value: 'yearly-cost', label: 'الأرخص خلال 12 شهرًا', ariaLabel: 'الأرخص خلال 12 شهرًا' },
  { value: 'heavy-data', label: 'الأرخص مع +20 GB', ariaLabel: 'الأرخص مع +20 GB' },
];

export function FilterSection({
  sortBy,
  onSortChange,
}: FilterSectionProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="mx-auto max-w-4xl px-2 py-2 md:px-0">
        <div className="grid grid-cols-3 gap-1" dir="rtl">
          {sortChips.map((chip) => {
            const isActive = sortBy === chip.value;

            return (
              <button
                key={chip.value}
                type="button"
                aria-label={chip.ariaLabel}
                onClick={() => onSortChange(chip.value)}
                className={`min-h-[30px] w-full rounded-full border px-1 py-1 text-[9px] font-black leading-tight transition-all sm:min-h-[32px] sm:px-2 sm:text-[10px] ${
                  isActive
                    ? 'border-green-600 bg-gradient-to-b from-green-600 to-green-700 text-white shadow-md shadow-green-100'
                    : 'border-slate-200 bg-gradient-to-b from-white to-slate-50 text-slate-700 shadow-sm hover:border-green-200 hover:text-green-800'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
