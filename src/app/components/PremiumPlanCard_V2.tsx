import { ArrowRight, Sparkles, Unlock, Phone, Zap } from 'lucide-react';
import { useState } from 'react';
import type { Plan } from '@/hooks/usePlans';
import { getOperatorLogo } from '@/lib/operatorLogos';
import { PlanDetailsModal } from './PlanDetailsModal';

interface PremiumPlanCardProps {
  plan: Plan;
  dealRank?: 1 | 2 | 3;
  dealType?: 'best-price' | 'most-data' | 'popular';
  savingsVariant?: 'gradient-text' | 'outlined' | 'soft-highlight';
}

/**
 * VARIATION 2: "Gold Glow + Corner Ribbon + Shimmering CTA"
 * - Glowing gold shadow around entire card
 * - Corner ribbon with "TOP DEAL" label
 * - Shimmer animation on card background
 * - Enlarged, gradient CTA with stronger gold
 * - Subtle shine effect on hover
 */
export function PremiumPlanCard({ plan, dealRank, dealType, savingsVariant = 'soft-highlight' }: PremiumPlanCardProps) {
  const operatorLogo = getOperatorLogo(plan.title);
  
  const hasCampaign = plan.campaign !== null;
  const savings = hasCampaign ? plan.regularPrice - plan.price : 0;
  
  const campaignMonths = plan.campaign?.months || null;
  const totalSavings = campaignMonths ? savings * campaignMonths : null;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const renderSavingsBadge = () => {
    if (!hasCampaign || savings <= 0) return null;

    switch (savingsVariant) {
      case 'gradient-text':
        return (
          <div className="inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-green-500 animate-pulse" />
            <span className="text-sm font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Spara {savings} kr/mån
            </span>
          </div>
        );
      
      case 'outlined':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-green-500 bg-transparent">
            <Sparkles className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-extrabold text-green-700">
              Spara {savings} kr/mån
            </span>
          </div>
        );
      
      case 'soft-highlight':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50/80 border-l-4 border-red-500">
            <Sparkles className="w-4 h-4 text-red-600 animate-pulse" />
            <span className="text-sm font-bold text-red-700">
              Spara {savings} kr/mån
            </span>
          </div>
        );
      
      default:
        return null;
    }
  };

  const dealBadges = {
    'best-price': { 
      label: 'Bäst pris', 
      icon: '🏆',
    },
    'most-data': { 
      label: 'Mest surf', 
      icon: '⚡',
    },
    'popular': { 
      label: 'Populärt val', 
      icon: '⭐',
    }
  };

  const dealBadge = dealType ? dealBadges[dealType] : null;

  const handleClick = () => {
    if (plan.affiliateUrl) {
      window.open(plan.affiliateUrl, '_blank', 'noopener,noreferrer');
    } else if (plan.sourceUrl) {
      window.open(plan.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative">
      {/* Glowing gold aura for top 3 deals */}
      {dealRank && (
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-2xl blur-md opacity-40 group-hover:opacity-60 animate-pulse-slow" />
      )}
      
      <div className={`
        group relative rounded-2xl overflow-visible transition-all duration-300
        ${dealRank 
          ? 'bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/20 border-2 border-amber-400/80 shadow-2xl hover:shadow-amber-500/30' 
          : 'bg-white border border-slate-200/60 shadow-md hover:shadow-lg'
        }
        hover:-translate-y-1
      `}>
        {/* Corner Ribbon for top 3 */}
        {dealBadge && (
          <>
            {/* Top gold bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-t-[15px]" />
            
            {/* Corner ribbon - top right */}
            <div className="absolute -top-0 -right-0 overflow-hidden w-24 h-24 z-10">
              <div className="absolute top-4 right-[-32px] rotate-45 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-white text-[9px] font-black uppercase tracking-wider py-1.5 px-8 shadow-lg">
                <span className="mr-1">{dealBadge.icon}</span>
                Top Deal
              </div>
            </div>
          </>
        )}
        
        <div 
          className="relative p-5 cursor-pointer"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          {/* MOBILE: Stacked vertical layout */}
          <div className="md:hidden">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                {operatorLogo ? (
                  <img 
                    src={operatorLogo} 
                    alt={plan.title} 
                    className="h-11 object-contain"
                  />
                ) : (
                  <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-sm">
                    <span className="text-xl font-bold text-slate-700">
                      {plan.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <span className="text-2xl font-black text-slate-900">
                  {plan.isUnlimited ? '∞' : plan.dataGb}
                </span>
                <span className="text-sm font-bold text-slate-600">
                  {plan.isUnlimited ? '' : 'GB'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-4">
              {plan.bindingMonths === 0 && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 border border-green-200/60 text-[10px] font-medium text-green-700 whitespace-nowrap">
                  <Unlock className="w-3 h-3 flex-shrink-0" />
                  Ingen bindningstid
                </div>
              )}
              {(plan.calls === 'unlimited' || plan.calls === undefined) && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 border border-blue-200/60 text-[10px] font-medium text-blue-700 whitespace-nowrap">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  Fria samtal
                </div>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailsOpen(true);
                }}
                className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all whitespace-nowrap flex-shrink-0"
              >
                Läs mer
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                {hasCampaign && (
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm text-slate-400 line-through">
                      {plan.regularPrice} kr/mån
                    </span>
                  </div>
                )}
                
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-lg font-semibold text-slate-500">
                    kr/mån
                  </span>
                </div>
              </div>
              
              {renderSavingsBadge()}
            </div>

            {/* Enhanced CTA with shimmer effect for top 3 */}
            <button
              onClick={handleClick}
              disabled={!plan.sourceUrl}
              className={`
                group/btn w-full py-4 px-4 rounded-xl font-black text-base
                transition-all duration-200 relative overflow-hidden
                disabled:opacity-50 disabled:cursor-not-allowed
                ${dealRank
                  ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 hover:scale-[1.04] active:scale-[0.98]'
                  : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md shadow-slate-900/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {/* Shimmer effect overlay */}
              {dealRank && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
              )}
              
              <span className="inline-flex items-center gap-2 justify-center relative z-10">
                {dealRank && <Zap className="w-5 h-5 animate-pulse" />}
                Till operatör
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* DESKTOP: Horizontal one-row layout */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <div className="flex items-center gap-3 min-w-[120px]">
              {operatorLogo ? (
                <img 
                  src={operatorLogo} 
                  alt={plan.title} 
                  className="h-10 object-contain"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-sm">
                  <span className="text-lg font-bold text-slate-700">
                    {plan.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-1 min-w-[100px]">
              <span className="text-3xl font-black text-slate-900">
                {plan.isUnlimited ? '∞' : plan.dataGb}
              </span>
              <span className="text-base font-bold text-slate-600">
                {plan.isUnlimited ? '' : 'GB'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-1">
              {plan.bindingMonths === 0 && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200/60 text-xs font-medium text-green-700 whitespace-nowrap">
                  <Unlock className="w-3.5 h-3.5 flex-shrink-0" />
                  Ingen bindningstid
                </div>
              )}
              {(plan.calls === 'unlimited' || plan.calls === undefined) && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/60 text-xs font-medium text-blue-700 whitespace-nowrap">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  eSIM
                </div>
              )}
            </div>

            <div className="flex items-center">
              {hasCampaign && totalSavings && campaignMonths && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50/80 border-l-4 border-red-500">
                  <Sparkles className="w-4 h-4 text-red-600 animate-pulse" />
                  <span className="text-sm font-bold text-red-700">
                    Spara {totalSavings} kr ({campaignMonths} mån kampanj)
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end min-w-[120px]">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">
                  {plan.price}
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  kr/mån
                </span>
              </div>
              {hasCampaign && (
                <span className="text-xs text-slate-400 line-through mt-0.5">
                  {plan.regularPrice} kr/mån
                </span>
              )}
            </div>

            {/* Enhanced CTA with shimmer effect for top 3 */}
            <button
              onClick={handleClick}
              disabled={!plan.sourceUrl}
              className={`
                group/btn py-3 px-7 rounded-lg font-black text-sm whitespace-nowrap
                transition-all duration-200 relative overflow-hidden
                disabled:opacity-50 disabled:cursor-not-allowed
                ${dealRank
                  ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 hover:scale-[1.06] active:scale-[0.98]'
                  : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {/* Shimmer effect overlay */}
              {dealRank && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
              )}
              
              <span className="relative z-10">
                {dealRank && <Zap className="w-4 h-4 inline mr-1.5 animate-pulse" />}
                Beställ
              </span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailsOpen(true);
              }}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-all whitespace-nowrap"
            >
              Detaljer
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <PlanDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          plan={plan}
          dealType={dealType}
        />
      </div>
    </div>
  );
}
