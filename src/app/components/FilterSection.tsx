import type { SortOption } from '@/hooks/useFilteredPlans';
import { t } from '@/i18n';

interface FilterSectionProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultsCount: number;
}

const sortChips: Array<{ value: SortOption; label: string }> = [
  { value: 'best-deals', label: 'أفضل العروض الآن' },
  { value: 'yearly-cost', label: 'الأرخص خلال سنة' },
  { value: 'heavy-data', label: 'أكثر من 20 GB إنترنت' },
  { value: 'no-binding', label: 'بدون التزام' },
];

export function FilterSection({
  sortBy,
  onSortChange,
  resultsCount
}: FilterSectionProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="mx-auto max-w-4xl px-4 py-3 md:px-0">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-slate-900">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              {resultsCount} {t('filter.resultsCount')}
            </span>
          </div>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" dir="rtl">
          <div className="flex min-w-max gap-2 pb-1">
            {sortChips.map((chip) => {
              const isActive = sortBy === chip.value;

              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => onSortChange(chip.value)}
                  className={`min-h-[40px] rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                    isActive
                      ? 'border-green-700 bg-green-700 text-white shadow-md shadow-green-100'
                      : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-green-200 hover:bg-green-50 hover:text-green-800'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
