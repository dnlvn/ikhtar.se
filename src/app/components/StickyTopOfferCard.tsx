import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Plan } from '@/hooks/usePlans';
import { getActiveMobileProviderPromotion } from '@/lib/mobileProviderConfig';
import { getOperatorLogo } from '@/lib/operatorLogos';

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
    operator: plan.title,
    plan_name: plan.subtitle,
    price: plan.price,
    source: 'mobile_sticky_top_offer',
  });

  window.open(url, '_blank', 'noopener,noreferrer');
}

export function StickyTopOfferCard({ plan, observedPlanIds }: StickyTopOfferCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollYRef = useRef(0);

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
      const isScrollingDown = scrollY > lastScrollYRef.current;
      const resultsSection = document.getElementById('results-section');
      const observedCards = observedPlanIds
        .map((id) => document.getElementById(`plan-${id}`))
        .filter(Boolean) as HTMLElement[];

      if (!isMobile || !resultsSection || observedCards.length === 0) {
        setIsVisible(false);
        lastScrollYRef.current = scrollY;
        return;
      }

      const resultsTop = resultsSection.getBoundingClientRect().top + scrollY;
      const nearResultsTop = scrollY < resultsTop + 120;
      const hasObservedCardInView = observedCards.some((card) => {
        const rect = card.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
      });
      const topCardsHavePassed = observedCards.every((card) => {
        const rect = card.getBoundingClientRect();
        return rect.bottom < 0;
      });

      setIsVisible(
        isScrollingDown &&
          !nearResultsTop &&
          topCardsHavePassed &&
          !hasObservedCardInView
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
  }, [ctaUrl, observedPlanIds, plan]);

  if (!plan || !ctaUrl) return null;

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
        className="mx-auto flex min-h-[104px] w-full max-w-[430px] cursor-pointer items-center gap-3 rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-3 text-right shadow-[0_14px_35px_rgba(245,158,11,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-14 w-[88px] flex-shrink-0 items-center justify-center rounded-xl bg-white/80 px-2 shadow-sm">
            {operatorLogo ? (
              <img
                src={operatorLogo}
                alt={plan.title}
                className="max-h-9 max-w-[76px] object-contain"
              />
            ) : (
              <span className="text-lg font-black text-slate-900">{plan.title.charAt(0)}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700">
              <Sparkles className="h-3 w-3" />
              أفضل عرض لك
            </div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-black leading-none text-slate-950">
                {plan.price}
              </span>
              <span className="text-[11px] font-bold text-slate-700">kr/mån</span>
              <span className="text-sm font-black text-slate-900">{plan.dataLabel}</span>
            </div>
          </div>
        </div>

        <span
          className="flex-shrink-0 rounded-xl px-3 py-2 text-[12px] font-black text-white shadow-md"
          style={{
            backgroundImage:
              'linear-gradient(to right, #F7971E 0%, #FFD200 51%, #F7971E 100%)',
            backgroundSize: '200% auto',
            animation: 'shimmer-slide 3s ease-in-out infinite, pulse 2.4s ease-in-out infinite',
          }}
        >
          اشترك الآن
        </span>
      </button>
    </div>
  );
}
