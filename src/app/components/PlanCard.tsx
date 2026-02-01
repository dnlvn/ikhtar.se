import { ArrowRight, TrendingDown, Users, Award } from 'lucide-react';
import type { Plan } from '@/hooks/usePlans';
import { getOperatorLogo } from '@/lib/operatorLogos';

interface PlanCardProps {
  plan: Plan;
  isMobile?: boolean;
  isTopDeal?: boolean;
  dealRank?: number; // 1, 2, or 3 for top deals
  cardStyle?: 'minimal' | 'deal-focused' | 'trust-focused'; // Toggle between designs
}

export function PlanCard({ 
  plan, 
  isMobile = false, 
  isTopDeal = false, 
  dealRank, 
  cardStyle = 'deal-focused' 
}: PlanCardProps) {
  const hasCampaign = !!plan.campaign;
  const savings = hasCampaign && plan.campaign ? plan.regularPrice - plan.price : 0;
  const operatorLogo = getOperatorLogo(plan.title);

  const handleOrder = () => {
    if (plan.sourceUrl) {
      window.open(plan.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // ========================================
  // CONCEPT 1: MINIMAL CLEAN SCANNER-FRIENDLY LIST
  // Ultra-compact, data-focused, maximum density
  // NOW WITH PLAYFUL, CONVERSION-FOCUSED ELEMENTS! 🎉
  // ========================================
  if (cardStyle === 'minimal' && isMobile) {
    // Top 3 deal styling - playful colors!
    const dealStyles = {
      1: { 
        bg: 'bg-gradient-to-r from-amber-50 to-orange-50', 
        border: 'border-l-4 border-amber-400',
        badge: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white',
        label: '🏆 #1',
        ctaColor: 'bg-gradient-to-r from-amber-500 to-orange-500'
      },
      2: { 
        bg: 'bg-gradient-to-r from-orange-50 to-red-50', 
        border: 'border-l-4 border-orange-400',
        badge: 'bg-gradient-to-r from-orange-400 to-red-400 text-white',
        label: '⭐ #2',
        ctaColor: 'bg-gradient-to-r from-orange-500 to-red-500'
      },
      3: { 
        bg: 'bg-gradient-to-r from-blue-50 to-cyan-50', 
        border: 'border-l-4 border-blue-400',
        badge: 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white',
        label: '👍 #3',
        ctaColor: 'bg-gradient-to-r from-blue-500 to-cyan-500'
      }
    };
    const dealStyle = dealRank && dealRank <= 3 ? dealStyles[dealRank as 1 | 2 | 3] : null;

    return (
      <div className={`relative ${
        dealStyle 
          ? `${dealStyle.bg} ${dealStyle.border} shadow-md hover:shadow-lg` 
          : 'bg-white border-b border-gray-200 hover:bg-gray-50'
      } px-3 py-3 transition-all duration-200 ${dealStyle ? 'rounded-lg mb-2' : ''}`}>
        
        <div className="flex items-center gap-3">
          {/* Left: Logo + Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              {/* Playful rank badge */}
              {dealStyle && (
                <div className={`absolute -top-2 left-3 ${dealStyle.badge} px-2.5 py-0.5 rounded-full text-xs font-black shadow-md animate-bounce-subtle z-10`}>
                  {dealStyle.label}
                </div>
              )}
              
              {operatorLogo ? (
                <img 
                  src={operatorLogo} 
                  alt={plan.title} 
                  className={`h-12 w-12 object-contain flex-shrink-0 ${dealStyle ? 'ring-2 ring-white shadow-sm rounded-lg' : ''}`}
                />
              ) : (
                <div className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 ${dealStyle ? 'ring-2 ring-white shadow-sm' : ''}`}>
                  <span className="text-lg font-bold text-gray-700">{plan.title.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-sm truncate">{plan.title}</div>
                <div className="text-lg font-black text-gray-900">{plan.dataLabel}</div>
              </div>
            </div>
            
            {/* Compact features with playful pills */}
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <span className="px-2 py-0.5 bg-white rounded-full text-gray-600 border border-gray-200 font-medium">
                {plan.bindingMonths === 0 ? '🔓 Ingen bindning' : `⏱️ ${plan.bindingMonths} mån`}
              </span>
              {plan.euRoaming && (
                <span className="px-2 py-0.5 bg-white rounded-full text-gray-600 border border-gray-200 font-medium">
                  🌍 EU roaming
                </span>
              )}
            </div>
          </div>

          {/* Right: Price + Savings + CTA */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {/* PLAYFUL Savings badge - prominent! */}
            {hasCampaign && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-md animate-pulse-subtle">
                💰 -{savings} kr
              </div>
            )}
            
            {/* Price */}
            <div className="text-right">
              <div className="text-2xl font-black text-gray-900 whitespace-nowrap leading-none">
                {plan.price} kr
              </div>
              <div className="text-xs text-gray-500 font-medium">/månad</div>
              {hasCampaign && (
                <div className="text-xs text-gray-400 line-through">
                  {plan.regularPrice} kr
                </div>
              )}
            </div>
            
            {/* Playful CTA button */}
            <button 
              className={`${
                dealStyle 
                  ? dealStyle.ctaColor 
                  : 'bg-gradient-to-r from-emerald-500 to-green-600'
              } text-white px-4 py-2 rounded-full font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
              onClick={handleOrder}
              disabled={!plan.sourceUrl}
            >
              {dealRank === 1 ? '🔥 Välj bästa!' : dealRank === 2 || dealRank === 3 ? '⚡ Välj detta!' : 'Se erbjudande →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // CONCEPT 2: DEAL-FOCUSED (HIGH-CONVERSION AFFILIATE)
  // Emphasize savings, urgency, clear value proposition
  // ========================================
  if (cardStyle === 'deal-focused' && isMobile) {
    const dealLabels = {
      1: { text: 'BÄSTA PRISET', color: 'bg-amber-500', emoji: '🏆' },
      2: { text: 'BRA PRIS', color: 'bg-orange-500', emoji: '⭐' },
      3: { text: 'POPULÄRT VAL', color: 'bg-blue-500', emoji: '👍' }
    };
    const dealBadge = dealRank && dealRank <= 3 ? dealLabels[dealRank as 1 | 2 | 3] : null;

    return (
      <div className={`relative bg-white rounded-xl border-2 ${
        dealRank === 1 ? 'border-amber-300 shadow-md' :
        dealRank === 2 ? 'border-orange-200 shadow-sm' :
        dealRank === 3 ? 'border-blue-200 shadow-sm' :
        'border-gray-200'
      } p-3 hover:shadow-lg transition-shadow`}>
        
        {/* Top deal badge */}
        {dealBadge && (
          <div className={`absolute -top-2.5 left-3 ${dealBadge.color} text-white px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm`}>
            {dealBadge.emoji} {dealBadge.text}
          </div>
        )}

        {/* Savings highlight - prominent but not button-like */}
        {hasCampaign && (
          <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-400 text-orange-700 px-3 py-0.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            Spara {savings} kr/mån
          </div>
        )}

        <div className="flex gap-3 mt-1">
          {/* Left: Logo + Data */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              {operatorLogo ? (
                <img 
                  src={operatorLogo} 
                  alt={plan.title} 
                  className="h-16 w-16 object-contain rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gray-100">
                  <span className="text-xl font-bold text-gray-700">{plan.title.charAt(0)}</span>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500 font-medium mb-0.5">{plan.title}</div>
                <div className="text-2xl font-black text-gray-900">{plan.dataLabel}</div>
              </div>
            </div>

            {/* Features */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
              <span>{plan.bindingMonths === 0 ? 'Ingen bindning' : `${plan.bindingMonths} mån bindning`}</span>
              {plan.euRoaming && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>EU roaming</span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="mb-2">
              <div className="text-3xl font-black text-gray-900">
                {plan.price} <span className="text-lg font-semibold text-gray-600">kr/mån</span>
              </div>
              {hasCampaign && (
                <div className="text-xs text-gray-400">
                  ordinarie pris {plan.regularPrice} kr/mån
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA - Full width, dominant */}
        <button 
          className="w-full bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          onClick={handleOrder}
          disabled={!plan.sourceUrl}
        >
          <span>Till {plan.title}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // ========================================
  // CONCEPT 3: TRUST-FOCUSED WITH TOP 3 HIGHLIGHTING
  // Professional, calm, subtle ranking
  // ========================================
  if (cardStyle === 'trust-focused' && isMobile) {
    const rankStyles = {
      1: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800', label: '#1 Bästa priset' },
      2: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800', label: '#2 Bra pris' },
      3: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800', label: '#3 Populärt' }
    };
    const rankStyle = dealRank && dealRank <= 3 ? rankStyles[dealRank as 1 | 2 | 3] : null;

    return (
      <div className={`relative bg-white rounded-lg border ${
        rankStyle ? `${rankStyle.border} ${rankStyle.bg}` : 'border-gray-200'
      } p-3 hover:shadow-md transition-shadow`}>
        
        {/* Subtle ranking badge */}
        {rankStyle && (
          <div className={`inline-flex items-center gap-1.5 ${rankStyle.badge} px-2 py-0.5 rounded text-xs font-semibold mb-2`}>
            <Award className="h-3 w-3" />
            {rankStyle.label}
          </div>
        )}

        <div className="flex items-start gap-3">
          {/* Left: Logo + Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              {operatorLogo ? (
                <img 
                  src={operatorLogo} 
                  alt={plan.title} 
                  className="h-14 w-14 object-contain rounded-lg"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-gray-100">
                  <span className="text-xl font-bold text-gray-700">{plan.title.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-sm mb-0.5">{plan.title}</div>
                <div className="text-xl font-black text-gray-900">{plan.dataLabel}</div>
              </div>
            </div>

            {/* Features in calm pills */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-xs text-gray-600 bg-white/80 px-2 py-0.5 rounded border border-gray-200">
                {plan.bindingMonths === 0 ? 'Ingen bindning' : `${plan.bindingMonths} mån`}
              </span>
              {plan.euRoaming && (
                <span className="text-xs text-gray-600 bg-white/80 px-2 py-0.5 rounded border border-gray-200">
                  EU roaming
                </span>
              )}
              {hasCampaign && (
                <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Kampanj: -{savings} kr/mån
                </span>
              )}
            </div>
          </div>

          {/* Right: Price + CTA stacked */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-black text-gray-900 whitespace-nowrap">
                {plan.price} kr
              </div>
              <div className="text-xs text-gray-500">/månad</div>
              {hasCampaign && (
                <div className="text-xs text-gray-400 line-through">
                  {plan.regularPrice} kr
                </div>
              )}
            </div>
            <button 
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-emerald-700 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm"
              onClick={handleOrder}
              disabled={!plan.sourceUrl}
            >
              Till operatör →
            </button>
          </div>
        </div>

        {/* Trust signal for top deals */}
        {dealRank && dealRank <= 3 && (
          <div className="mt-2 pt-2 border-t border-gray-200/50 flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="h-3.5 w-3.5" />
            <span>Över 500 har valt detta erbjudande denna månad</span>
          </div>
        )}
      </div>
    );
  }

  // ========================================
  // DESKTOP LAYOUT (unified for all concepts)
  // ========================================
  if (!isMobile) {
    const dealBadges = {
      1: { text: '🏆 BÄSTA PRISET', color: 'bg-amber-500' },
      2: { text: '⭐ BRA PRIS', color: 'bg-orange-500' },
      3: { text: '👍 POPULÄRT VAL', color: 'bg-blue-500' }
    };
    const dealBadge = dealRank && dealRank <= 3 ? dealBadges[dealRank as 1 | 2 | 3] : null;

    return (
      <div className={`relative bg-white rounded-xl border-2 ${
        dealRank === 1 ? 'border-amber-300 shadow-md' :
        dealRank === 2 ? 'border-orange-200 shadow-sm' :
        dealRank === 3 ? 'border-blue-200 shadow-sm' :
        'border-gray-200'
      } p-4 hover:shadow-lg transition-shadow`}>
        
        {dealBadge && (
          <div className={`absolute -top-2.5 left-6 ${dealBadge.color} text-white px-3 py-0.5 rounded-full text-xs font-black shadow-sm`}>
            {dealBadge.text}
          </div>
        )}

        {hasCampaign && (
          <div className="absolute -top-2.5 right-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-400 text-orange-700 px-3 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5" />
            Spara {savings} kr/mån
          </div>
        )}

        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Logo */}
          <div className="col-span-2">
            {operatorLogo ? (
              <img 
                src={operatorLogo} 
                alt={plan.title} 
                className="h-16 w-16 object-contain rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gray-100">
                <span className="text-2xl font-bold text-gray-700">{plan.title.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Operator + Data */}
          <div className="col-span-3">
            <div className="text-sm font-bold text-gray-900 mb-1">{plan.title}</div>
            <div className="text-2xl font-black text-gray-900">{plan.dataLabel}</div>
          </div>

          {/* Features */}
          <div className="col-span-3">
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                {plan.bindingMonths === 0 ? 'Ingen bindning' : `${plan.bindingMonths} mån`}
              </span>
              {plan.euRoaming && (
                <span className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                  EU roaming
                </span>
              )}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="col-span-4 flex items-center justify-end gap-4">
            <div className="text-right">
              <div className="text-3xl font-black text-gray-900 whitespace-nowrap">
                {plan.price} kr/mån
              </div>
              {hasCampaign && (
                <div className="text-xs text-gray-400">
                  ord. {plan.regularPrice} kr/mån
                </div>
              )}
            </div>
            <button 
              className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap shadow-sm"
              onClick={handleOrder}
              disabled={!plan.sourceUrl}
            >
              Till operatör →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback (shouldn't reach here)
  return null;
}