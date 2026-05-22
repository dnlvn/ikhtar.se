import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Plan } from '@/hooks/usePlans';
import { getActiveMobileProviderPromotion } from '@/lib/mobileProviderConfig';
import { getOperatorLogo } from '@/lib/operatorLogos';
import { t } from '@/i18n';

interface DockedTopOfferCardProps {
  plan: Plan | null;
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
    source: 'mobile_docked_top_card',
  });

  window.open(url, '_blank', 'noopener,noreferrer');
}

export function DockedTopOfferCard({ plan }: DockedTopOfferCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollYRef = useRef(0);
  const ctaUrl = useMemo(() => (plan ? getPlanUrl(plan) : null), [plan]);
  const operatorLogo = getOperatorLogo(plan?.title);

  useEffect(() => {
    if (!plan || !ctaUrl) {
      setIsVisible(false);
      return;
    }

    const updateVisibility = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;
      const isScrollingDown = scrollY > lastScrollYRef.current;
      const resultsSection = document.getElementById('results-section');
      const topOfferCard = document.getElementById(`plan-${plan.id}`);

      if (!isMobile || !resultsSection || !topOfferCard) {
        setIsVisible(false);
        lastScrollYRef.current = scrollY;
        return;
      }

      const resultsTop = resultsSection.getBoundingClientRect().top + scrollY;
      const nearResultsTop = scrollY < resultsTop + 80;
      const topOfferRect = topOfferCard.getBoundingClientRect();
      const topOfferInView = topOfferRect.bottom > 0 && topOfferRect.top < window.innerHeight;
      const topOfferHasPassed = topOfferRect.bottom < 0;

      setIsVisible(
        isScrollingDown &&
          !nearResultsTop &&
          topOfferHasPassed &&
          !topOfferInView
      );
      lastScrollYRef.current = scrollY;
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, [ctaUrl, plan]);

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
      <button
        type="button"
        onClick={() => trackAndOpen(plan, ctaUrl)}
        className="relative mx-auto flex h-[102px] w-full max-w-[430px] cursor-pointer items-center gap-3 overflow-visible rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-yellow-50 px-3 py-3 text-right shadow-[0_14px_34px_rgba(245,158,11,0.30)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 animate-pulse text-yellow-400" />
        <Sparkles className="absolute -bottom-1 -left-1 h-5 w-5 animate-pulse text-orange-400" />

        <span className="absolute -top-3 right-4 z-10 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-700 shadow-sm">
          <Sparkles className="h-2.5 w-2.5" />
          أفضل عرض لك
        </span>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-12 w-[84px] flex-shrink-0 items-center justify-center">
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

          <span className={`${plan.isUnlimited ? 'text-[16px]' : 'text-[20px]'} flex-shrink-0 font-extrabold leading-none text-slate-900`}>
            {plan.dataLabel || t('card.unlimitedData')}
          </span>

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
  );
}
