import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Plan } from '@/hooks/usePlans';
import { getActiveMobileProviderPromotion } from '@/lib/mobileProviderConfig';
import { getOperatorLogo } from '@/lib/operatorLogos';
import { t } from '@/i18n';

interface StickyTopOfferCardProps {
  plan: Plan | null;
  observedPlanIds: string[];
}

function getPlanUrl(plan: Plan) {
  const activePromotion = getActiveMobileProviderPromotion(plan.title);
  return activePromotion?.promotionUrl || plan.sourceUrl || null;
}

function trackAndOpen(plan: Plan, url: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'cta_click',
    operator: plan.operator,
    plan_name: plan.plan_name,
    price: plan.current_price,
  });

  window.open(url, '_blank', 'noopener,noreferrer');
}

export function StickyTopOfferCard({ plan, observedPlanIds }: StickyTopOfferCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ctaUrl = useMemo(() => (plan ? getPlanUrl(plan) : null), [plan]);
  const operatorLogo = getOperatorLogo(plan?.title);

  useEffect(() => {
    if (!plan || !ctaUrl || observedPlanIds.length === 0) {
      setIsVisible(false);
      return;
    }

    const updateVisibility = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;
      const resultsSection = document.getElementById('results-section');
      const topOfferCard = document.getElementById(`plan-${plan.id}`);
      const observedCards = observedPlanIds
        .map((id) => document.getElementById(`plan-${id}`))
        .filter(Boolean) as HTMLElement[];

      if (!isMobile || !resultsSection || !topOfferCard || observedCards.length === 0) {
        setIsVisible(false);
        return;
      }

      const resultsTop = resultsSection.getBoundingClientRect().top + scrollY;
      const nearResultsTop = scrollY < resultsTop + 120;
      const topOfferRect = topOfferCard.getBoundingClientRect();
      const topOfferInView = topOfferRect.bottom > 0 && topOfferRect.top < window.innerHeight;
      const triggerCardsHavePassed = observedCards.every((card) => {
        const rect = card.getBoundingClientRect();
        return rect.bottom < 0;
      });

      setIsVisible(!nearResultsTop && !topOfferInView && triggerCardsHavePassed);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, [ctaUrl, observedPlanIds, plan]);

  if (!plan || !ctaUrl) return null;

  const operatorName = plan.title.toLowerCase().split(' ')[0];

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] transition-all duration-300 md:hidden ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0'
      }`}
      dir="rtl"
      aria-hidden={!isVisible}
    >
      <div className="mx-auto w-full max-w-[430px]">
        <button
          type="button"
          onClick={() => trackAndOpen(plan, ctaUrl)}
          className="relative flex h-[104px] w-full cursor-pointer items-center justify-between gap-2 rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-yellow-50 px-3 py-3 text-right shadow-lg shadow-amber-200/50 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 animate-pulse text-yellow-400" />
          <Sparkles className="absolute -bottom-1 -left-1 h-5 w-5 animate-pulse text-orange-400" />

          <div className="absolute -top-3 right-4 z-10 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-700 shadow-sm">
            <span className="flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              {t('card.bestDealBadge')}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-12 w-[86px] flex-shrink-0 items-center justify-center">
              {operatorLogo ? (
                <img
                  src={operatorLogo}
                  alt={operatorName}
                  className="max-h-[35px] max-w-[82px] object-contain"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                  <span className="text-xs font-bold text-slate-700">{plan.title.charAt(0)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-shrink-0 flex-col items-center gap-1">
              <span className={`${plan.isUnlimited ? 'text-[16px]' : 'text-[20px]'} font-extrabold leading-none text-slate-900`}>
                {plan.dataLabel || t('card.unlimitedData')}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-[34px] font-black leading-none text-slate-900">
                  {plan.price}
                </span>
                <span className="text-[11px] font-medium leading-tight text-slate-700">
                  {t('card.pricePerMonth')}
                </span>
              </div>
            </div>
          </div>

          <span
            className="flex-shrink-0 rounded-xl px-4 py-2 text-[12px] font-bold uppercase text-white shadow-md"
            style={{
              backgroundImage:
                'linear-gradient(to right, #F7971E 0%, #FFD200 51%, #F7971E 100%)',
              backgroundSize: '200% auto',
              animation: 'shimmer-slide 3s ease-in-out infinite',
            }}
          >
            اشترك الآن
          </span>
        </button>
      </div>
    </div>
  );
}
