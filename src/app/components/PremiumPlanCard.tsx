import { ArrowRight, Sparkles, Unlock, Wifi, Globe, Signal, Info, Phone } from 'lucide-react';
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

export function PremiumPlanCard({ plan, dealRank, dealType, savingsVariant = 'soft-highlight' }: PremiumPlanCardProps) {
  // Get operator logo from uploaded assets
  const operatorLogo = getOperatorLogo(plan.title);
  
  // Calculate campaign savings
  const hasCampaign = plan.campaign !== null;
  const savings = hasCampaign ? plan.regularPrice - plan.price : 0;
  
  // Calculate TOTAL savings using ACTUAL campaign months (no default)
  const campaignMonths = plan.campaign?.months || null;
  const totalSavings = campaignMonths ? savings * campaignMonths : null;

  // Modal state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Savings badge variants
  const renderSavingsBadge = () => {
    if (!hasCampaign || savings <= 0) return null;

    switch (savingsVariant) {
      case 'gradient-text':
        // Option 1: Clean gradient text with icon - no background
        return (
          <div className="inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-green-500 animate-pulse" />
            <span className="text-sm font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Spara {savings} kr/mån
            </span>
          </div>
        );
      
      case 'outlined':
        // Option 2: Outlined badge - border only, no solid fill
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-green-500 bg-transparent">
            <Sparkles className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-extrabold text-green-700">
              Spara {savings} kr/mån
            </span>
          </div>
        );
      
      case 'soft-highlight':
        // Option 3: Soft background highlight with prominent badge styling
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-400/60 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="text-sm font-extrabold text-amber-700">
              Spara {savings} kr/mån
            </span>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Deal badge config
  const dealBadges = {
    'best-price': { 
      label: 'Bäst pris', 
      icon: '🏆',
      gradient: 'from-amber-500 via-yellow-500 to-orange-500',
      glow: 'shadow-amber-500/30'
    },
    'most-data': { 
      label: 'Mest surf', 
      icon: '⚡',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      glow: 'shadow-blue-500/30'
    },
    'popular': { 
      label: 'Populärt val', 
      icon: '⭐',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      glow: 'shadow-purple-500/30'
    }
  };

  const dealBadge = dealType ? dealBadges[dealType] : null;

  // Handle CTA click
  const handleClick = () => {
    if (plan.affiliateUrl) {
      window.open(plan.affiliateUrl, '_blank', 'noopener,noreferrer');
    } else if (plan.sourceUrl) {
      window.open(plan.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`
      group relative rounded-2xl overflow-visible transition-all duration-300
      ${dealRank 
        ? 'bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 border-2 border-blue-200/60 shadow-lg hover:shadow-xl' 
        : 'bg-white border border-slate-200/60 shadow-md hover:shadow-lg'
      }
      hover:-translate-y-1
    `}>
      {/* Top 3 deal badge - top right corner on the border */}
      {dealBadge && (
        <>
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${dealBadge.gradient} rounded-t-[15px]`} />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className={`
              px-3 py-1.5 rounded-full text-xs font-bold text-white
              bg-gradient-to-r ${dealBadge.gradient} shadow-lg ${dealBadge.glow}
              animate-pulse-subtle
            `}>
              <span className="mr-1">{dealBadge.icon}</span>
              {dealBadge.label}
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
          {/* Top row: Logo LEFT + Data amount pill RIGHT */}
          <div className="flex items-start justify-between gap-3 mb-3">
            {/* Operator logo */}
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

            {/* Data amount pill - compact, top right */}
            <div className="inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <span className="text-2xl font-black text-slate-900">
                {plan.isUnlimited ? '∞' : (plan.dataLabel || 'Fri surf').replace(' GB', '')}
              </span>
              <span className="text-sm font-bold text-slate-600">
                {plan.isUnlimited ? '' : 'GB'}
              </span>
            </div>
          </div>

          {/* Second row: Feature badges - ALL HORIZONTAL */}
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
          </div>

          {/* Price row: Old price ABOVE new price on LEFT + Savings box on RIGHT */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              {/* Old price above (small, grey, crossed) */}
              {hasCampaign && (
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm text-slate-400 line-through">
                    {plan.regularPrice} kr/mån
                  </span>
                </div>
              )}
              
              {/* Current price (large) */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">
                  {plan.price}
                </span>
                <span className="text-lg font-semibold text-slate-500">
                  kr/mån
                </span>
              </div>
            </div>
            
            {/* Savings highlight box on RIGHT - informational, not button-like */}
            {renderSavingsBadge()}
          </div>

          {/* CTA Button - Full width, strong */}
          <button
            onClick={handleClick}
            disabled={!plan.sourceUrl}
            className={`
              group/btn w-full py-3.5 px-4 rounded-xl font-bold text-base
              transition-all duration-200 mb-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${dealRank
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md shadow-slate-900/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            <span className="inline-flex items-center gap-2 justify-center">
              Se erbjudandet
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Details link - below CTA, centered */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailsOpen(true);
            }}
            className="w-full flex items-center justify-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 transition-all"
          >
            Detaljer
          </button>
        </div>

        {/* DESKTOP: Horizontal one-row layout */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {/* Left section: Logo + Operator name */}
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

          {/* Data amount - prominent */}
          <div className="flex items-baseline gap-1 min-w-[100px]">
            <span className="text-3xl font-black text-slate-900">
              {plan.isUnlimited ? '∞' : (plan.dataLabel || 'Fri surf').replace(' GB', '')}
            </span>
            <span className="text-base font-bold text-slate-600">
              {plan.isUnlimited ? '' : 'GB'}
            </span>
          </div>

          {/* Feature badges - middle section */}
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

          {/* Savings badge */}
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

          {/* Price section - current price ABOVE, old price BELOW */}
          <div className="flex flex-col items-end min-w-[120px]">
            {/* Current price (large, on top) */}
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">
                {plan.price}
              </span>
              <span className="text-sm font-semibold text-slate-600">
                kr/mån
              </span>
            </div>
            {/* Old price below (strikethrough) */}
            {hasCampaign && (
              <span className="text-xs text-slate-400 line-through mt-0.5">
                {plan.regularPrice} kr/mån
              </span>
            )}
          </div>

          {/* CTA button - compact */}
          <button
            onClick={handleClick}
            disabled={!plan.sourceUrl}
            className={`
              group/btn py-2.5 px-6 rounded-lg font-bold text-sm whitespace-nowrap
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${dealRank
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            Beställ
          </button>

          {/* Details link */}
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

      {/* Plan details modal */}
      <PlanDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        plan={plan}
        dealType={dealType}
      />
    </div>
  );
}