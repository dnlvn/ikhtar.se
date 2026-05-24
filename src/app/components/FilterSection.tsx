import type { SortOption } from '@/hooks/useFilteredPlans';
import { t } from '@/i18n';

interface FilterSectionProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultsCount: number;
}

const sortChips: Array<{ value: SortOption; label: string; ariaLabel: string }> = [
  { value: 'best-deals', label: 'أفضل العروض', ariaLabel: 'أفضل العروض' },
  { value: 'price-asc', label: 'الأرخص الآن', ariaLabel: 'الأرخص الآن' },
  { value: 'yearly-cost', label: 'الأرخص سنة', ariaLabel: 'الأرخص سنة' },
  { value: 'heavy-data', label: '+20GB', ariaLabel: 'أكثر من 20 GB إنترنت' },
  { value: 'no-binding', label: 'بدون التزام', ariaLabel: 'بدون التزام' },
];

export function FilterSection({
  sortBy,
  onSortChange,
  resultsCount
}: FilterSectionProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="mx-auto max-w-4xl px-3 py-2 md:px-0">
        <div className="mb-1.5 flex items-center justify-center gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            {resultsCount} {t('filter.resultsCount')}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-1" dir="rtl">
          {sortChips.map((chip) => {
            const isActive = sortBy === chip.value;

            return (
              <button
                key={chip.value}
                type="button"
                aria-label={chip.ariaLabel}
                onClick={() => onSortChange(chip.value)}
                className={`min-h-[30px] rounded-full border px-2 py-1 text-[10px] font-black leading-tight transition-all sm:px-2.5 ${
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
