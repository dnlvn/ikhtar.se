import type { SortOption } from '@/hooks/useFilteredPlans';
import { t } from '@/i18n';

interface FilterSectionProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultsCount: number;
}

const sortChips: Array<{ value: SortOption; label: string; ariaLabel: string }> = [
  { value: 'best-deals', label: 'أفضل الآن', ariaLabel: 'أفضل العروض الآن' },
  { value: 'yearly-cost', label: 'خلال سنة', ariaLabel: 'الأرخص خلال سنة' },
  { value: 'heavy-data', label: '+20 GB', ariaLabel: 'أكثر من 20 GB إنترنت' },
  { value: 'no-binding', label: 'بدون التزام', ariaLabel: 'بدون التزام' },
];

export function FilterSection({
  sortBy,
  onSortChange,
  resultsCount
}: FilterSectionProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="mx-auto max-w-4xl px-3 py-2.5 md:px-0">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-slate-900">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              {resultsCount} {t('filter.resultsCount')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5" dir="rtl">
          {sortChips.map((chip) => {
            const isActive = sortBy === chip.value;

            return (
              <button
                key={chip.value}
                type="button"
                aria-label={chip.ariaLabel}
                onClick={() => onSortChange(chip.value)}
                className={`min-h-[38px] rounded-2xl border px-1.5 py-1.5 text-[11px] font-black leading-tight transition-all ${
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
