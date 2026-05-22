import { useEffect, useMemo, useState } from 'react';
import type { Plan } from '@/hooks/usePlans';
import { getActiveMobileProviderPromotion } from '@/lib/mobileProviderConfig';
import { PremiumPlanCard } from './PremiumPlanCard_V1';

interface StickyTopOfferCardProps {
  plan: Plan | null;
  observedPlanIds: string[];
}

function getPlanUrl(plan: Plan) {
  const activePromotion = getActiveMobileProviderPromotion(plan.title);
  return activePromotion?.promotionUrl || plan.sourceUrl || null;
}

export function StickyTopOfferCard({ plan, observedPlanIds }: StickyTopOfferCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ctaUrl = useMemo(() => (plan ? getPlanUrl(plan) : null), [plan]);

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
        <PremiumPlanCard
          plan={plan}
          dealRank={1}
          dealType="best-price"
          cardId={`sticky-plan-${plan.id}`}
        />
      </div>
    </div>
  );
}
