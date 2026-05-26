import type { Plan } from '@/hooks/usePlans';
import type { SortOption } from '@/hooks/useFilteredPlans';
import { getActiveMobileProviderPromotion } from '@/lib/mobileProviderConfig';
import { formatSek, getPlanCostSummary } from '@/lib/mobilePlanCost';
import { getOperatorLogo } from '@/lib/operatorLogos';

interface MobileQuickComparisonProps {
  plans: Plan[];
  sortMode: SortOption;
}

function getPlanUrl(plan: Plan) {
  const activePromotion = getActiveMobileProviderPromotion(plan.title);
  return activePromotion?.promotionUrl || plan.sourceUrl || null;
}

function trackAndOpen(plan: Plan, sortMode: SortOption, position: number) {
  const ctaUrl = getPlanUrl(plan);
  if (!ctaUrl) return;

  const costSummary = getPlanCostSummary(plan);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'cta_click',
    operator: plan.title,
    plan_name: plan.subtitle,
    price: plan.price,
    source: 'mobile_quick_comparison',
    selected_sort_mode: sortMode,
    plan_key: plan.planKey,
    current_price: plan.price,
    effective_monthly_price_12m: costSummary.effectiveMonthlyPrice12m,
    card_position: position,
  });

  window.open(ctaUrl, '_blank', 'noopener,noreferrer');
}

function compareHeavyDataDeals(a: Plan, b: Plan) {
  const priceCompare = a.price - b.price;
  if (priceCompare !== 0) return priceCompare;

  const dataCompare = b.dataSortValue - a.dataSortValue;
  if (dataCompare !== 0) return dataCompare;

  const bindingCompare = a.bindingMonths - b.bindingMonths;
  if (bindingCompare !== 0) return bindingCompare;

  const operatorCompare = a.title.localeCompare(b.title, 'sv');
  if (operatorCompare !== 0) return operatorCompare;

  return a.id.localeCompare(b.id);
}

function getHeavyDataComparisonPlans(plans: Plan[]) {
  const seenOperators = new Set<string>();

  return plans
    .filter((plan) => plan.isUnlimited || plan.dataSortValue >= 25)
    .sort(compareHeavyDataDeals)
    .filter((plan) => {
      if (seenOperators.has(plan.title)) return false;
      seenOperators.add(plan.title);
      return true;
    })
    .slice(0, 5);
}

export function MobileQuickComparison({ plans, sortMode }: MobileQuickComparisonProps) {
  const comparisonPlans = getHeavyDataComparisonPlans(plans);
  if (comparisonPlans.length < 2) return null;

  return (
    <section className="mx-auto mt-8 max-w-4xl px-[12px]" dir="rtl">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-slate-900">تبحث عن إنترنت كثير؟</h2>
          <span className="text-[11px] font-bold text-slate-500">أفضل عروض الباقات ذات الإنترنت الكثير</span>
        </div>

        <div className="space-y-2">
          {comparisonPlans.map((plan, index) => {
            const logo = getOperatorLogo(plan.title);
            const costSummary = getPlanCostSummary(plan);
            const ctaUrl = getPlanUrl(plan);

            return (
              <div key={plan.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2">
                <div className="flex h-9 w-[68px] items-center justify-center">
                  {logo ? (
                    <img src={logo} alt={plan.title} className="max-h-7 max-w-[64px] object-contain" />
                  ) : (
                    <span className="text-xs font-black text-slate-800">{plan.title}</span>
                  )}
                </div>

                <div className="min-w-0 text-right">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-base font-black text-slate-950">{plan.price} كرونة</span>
                    <span className="text-xs font-bold text-slate-600">{plan.dataLabel}</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {plan.bindingMonths === 0 ? 'بدون التزام' : `${plan.bindingMonths} شهر`}
                    </span>
                  </div>
                  {costSummary.hasCampaignPeriod && costSummary.effectiveMonthlyPrice12m !== null && (
                    <div className="text-[11px] font-bold text-slate-500">
                      متوسط السنة الأولى: {formatSek(costSummary.effectiveMonthlyPrice12m)} كرونة/شهر
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!ctaUrl}
                  onClick={() => trackAndOpen(plan, sortMode, index + 1)}
                  className="rounded-lg bg-green-700 px-3 py-2 text-[11px] font-black text-white shadow-sm transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  شاهد
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
