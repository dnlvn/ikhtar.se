import { ChevronDown, SlidersHorizontal, Smartphone } from 'lucide-react';
import type { SortOption } from '@/hooks/useFilteredPlans';
import { t } from '@/i18n';

interface FilterSectionProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultsCount: number;
}

export function FilterSection({
  sortBy,
  onSortChange,
  resultsCount
}: FilterSectionProps) {
  return (
    <div className="bg-white border-b border-slate-200/80 shadow-sm sticky top-0 z-30 backdrop-blur-lg bg-white/95">
      <div className="max-w-4xl mx-auto px-4 md:px-0 py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Results count - left side */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 text-[16px]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {resultsCount} {t('filter.resultsCount')}
            </span>
          </div>

          {/* Sort control - right side, subtle */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 hidden sm:inline">
              {t('filter.sortLabel')}
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="appearance-none text-xs pl-2 pr-6 py-1.5 rounded-[8px] border border-slate-200 bg-slate-50 text-slate-700 font-medium hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-400 transition-all cursor-pointer"
              >
                <option value="best-deals">{t('filter.sortOptions.bestDeals')}</option>
                <option value="price-asc">{t('filter.sortOptions.priceAsc')}</option>
                <option value="data-desc">{t('filter.sortOptions.dataDesc')}</option>
                <option value="no-binding">{t('filter.sortOptions.noBinding')}</option>
                <option value="popular">{t('filter.sortOptions.popular')}</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}