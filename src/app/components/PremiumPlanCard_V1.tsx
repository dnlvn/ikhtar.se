import { ArrowRight, Sparkles, Unlock, Lock, Phone, Crown } from 'lucide-react';
import { useState } from 'react';
import type { Plan } from '@/hooks/usePlans';
import { getOperatorLogo } from '@/lib/operatorLogos';
import { PlanDetailsModal } from './PlanDetailsModal';
import { t } from '@/i18n';

interface PremiumPlanCardProps {
  plan: Plan;
  dealRank?: 1 | 2 | 3;
  dealType?: 'best-price' | 'most-data' | 'popular';
  savingsVariant?: 'gradient-text' | 'outlined' | 'soft-highlight';
}

/**
 * VARIATION 1: "Bold Gold Frame + Animated Badge + Pulsing CTA"
 * - Thick 3px gold border with subtle shadow
 * - Animated crown badge floating above card
 * - Gold gradient background tint
 * - Pulsing animation on CTA button
 * - Strong gold shadow on hover
 */
export function PremiumPlanCard({ plan, dealRank, dealType, savingsVariant = 'soft-highlight' }: PremiumPlanCardProps) {
  const operatorLogo = getOperatorLogo(plan.title);
  
  const hasCampaign = plan.campaign !== null;
  const savings = hasCampaign ? plan.regularPrice - plan.price : 0;
  
  const campaignMonths = plan.campaign?.months || null;
  const totalSavings = campaignMonths ? savings * campaignMonths : null;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Badge label for top 3 cards
  const dealBadge = dealRank === 1 ? { label: t('card.dealRankBadges.cheapest') }
    : dealRank === 2 ? { label: t('card.dealRankBadges.bestValue') }
    : dealRank === 3 ? { label: t('card.dealRankBadges.mostPopular') }
    : null;

const handleClick = () => {
  if (!plan.sourceUrl) return;

  // GA event: CTA + kort-klick
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'cta_click', {
      operator: plan.operator,
      plan_name: plan.plan_name,
      price: plan.current_price,
      page_path: window.location.pathname,
    });
  }

  window.open(plan.sourceUrl, '_blank', 'noopener,noreferrer');
};

  // Extract operator name from plan title (e.g., "Hallon 5GB" -> "hallon")
  const operatorName = plan.title.toLowerCase().split(' ')[0];

  // Check if this is a best deal (price <= 50 SEK)
  const isBestDeal = plan.price <= 50;

  return (
    <div 
      id={`plan-${plan.id}`}
      className="relative"
    >
      {/* Sparkle decorations for best deals */}
      {isBestDeal && (
        <>
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse delay-75 z-20" />
          <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-orange-400 animate-pulse delay-150 z-20" />
        </>
      )}
      
      <div 
        onClick={handleClick}
        className={`
          relative rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg
          ${plan.sourceUrl ? 'cursor-pointer' : 'cursor-not-allowed'}
          ${isBestDeal 
            ? 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 border-2 border-amber-400 shadow-amber-200/40 shadow-lg hover:shadow-xl hover:shadow-amber-300/50' 
            : 'bg-white border border-slate-200/60'
          }
        `}
        style={{ borderRadius: '0.75rem' }}
      >
        {/* Regular price badge - top left corner (was right) */}
        <span className={`absolute top-0 -translate-y-1/2 left-4 z-10 px-3 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200 shadow-sm line-through ${isBestDeal ? 'text-red-700' : 'text-slate-600'}`}>
          {plan.regularPrice} {t('card.pricePerMonth')}
        </span>

        {/* Top Deal badge - right corner (was left) */}
        {isBestDeal && (
          <div className="absolute -top-3 right-4 z-20">
            <div className="bg-amber-50 border border-amber-300/50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-semibold shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {t('card.bestDealBadge')}
            </div>
          </div>
        )}
        
        <div className="p-4 p-[14px]">
          {/* Top row: Logo + Operator name | Data | Price */}
          <div className="flex items-center justify-between mb-[6px] mt-[0px] mr-[0px] ml-[0px]">
            {/* LEFT: Logo + Operator name */}
            <div className="flex items-center gap-2.5">
              {operatorLogo ? (
                <img 
                  src={operatorLogo} 
                  alt={operatorName} 
                  className="h-[35px] w-auto object-contain"
                />
              ) : (
                <div className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                  <span className="text-xs font-bold text-slate-700">
                    {plan.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* CENTER-LEFT: Data amount */}
            <div className="flex-shrink-0">
              <span className={`${plan.isUnlimited ? 'text-[18px]' : 'text-[22px]'} font-extrabold text-slate-900 leading-none not-italic p-[0px] m-[0px]`}>
                {plan.dataLabel || t('card.unlimitedData')}
              </span>
            </div>

            {/* RIGHT: Price */}
            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-1">
                <span className="text-[40px] font-black text-slate-900 leading-none">
                  {plan.price}
                </span>
                <span className="text-[12px] font-medium text-slate-700 leading-tight">
                  {t('card.pricePerMonth')}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom row: Features (left) | CTA button (right) */}
          <div className="flex items-start justify-between">
            {/* LEFT: Features */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                {plan.bindingMonths === 0 ? (
                  <Unlock className="w-3.5 h-3.5 text-slate-900" strokeWidth={2.5} />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-900" strokeWidth={2.5} />
                )}
                <span className="text-[12px] font-regular leading-tight text-slate-900">
                  {plan.bindingMonths === 0 ? t('card.noBinding') : `${plan.bindingMonths} ${t('card.bindingMonths')}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-900" strokeWidth={2.5} />
                <span className="text-[12px] font-regular text-slate-900 leading-tight">
                  {t('card.freeCalls')}
                </span>
              </div>
            </div>

           {/* RIGHT: CTA button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click when button is clicked
                handleClick();
              }}
              disabled={!plan.sourceUrl}
              className={`
                px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase
                transition-all duration-500 shadow-sm hover:shadow-md hover:-translate-y-0.5
                cursor-pointer disabled:cursor-not-allowed relative overflow-hidden
                ${isBestDeal 
                  ? 'text-white shadow-lg hover:brightness-110' 
                  : 'bg-white border-2 border-green-800 text-green-800 hover:bg-green-50'
                }
              `}
              style={isBestDeal ? { 
                backgroundImage: 'linear-gradient(to right, #F7971E 0%, #FFD200 51%, #F7971E 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmer-slide 3s ease-in-out infinite',
                borderRadius: '0.75rem'
              } : {
                borderRadius: '0.75rem'
              }}
            >
              <span className="relative flex items-center gap-1.5">
                {t('card.viewOffer')}
              </span>
            </button>
          </div>
        </div>
      </div>

      <PlanDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        plan={plan}
        dealType={dealType}
      />
    </div>
  );
}
