import { ChevronRight, Check, Zap, Star, TrendingDown, Sparkles, Trophy, Gift, Users } from 'lucide-react';

export interface Subscription {
  id: string;
  operator: string;
  operatorLogo?: string;
  data: string;
  price: number;
  campaignPrice?: number;
  campaignInfo?: string;
  bindingPeriod: string;
  hasESim: boolean;
  hasEURoaming: boolean;
  speed: string;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  isMobile?: boolean;
  isTopDeal?: boolean;
}

export function SubscriptionCard({ subscription, isMobile = false, isTopDeal = false }: SubscriptionCardProps) {
  const features = [];
  if (subscription.hasESim) features.push('eSIM');
  if (subscription.hasEURoaming) features.push('EU roaming');

  const hasCampaign = !!subscription.campaignPrice;
  const savings = hasCampaign ? subscription.price - subscription.campaignPrice! : 0;

  // Mobile Card Classes
  const mobileCardClasses = isTopDeal 
    ? 'border-amber-400 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 animate-pulse-slow' 
    : hasCampaign
    ? 'border-green-400 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30'
    : 'border-gray-200 hover:border-green-300 hover:shadow-xl';

  if (isMobile) {
    return (
      <div className={`group relative bg-white rounded-2xl border-2 p-5 transition-all duration-300 ${mobileCardClasses}`}>
        {/* Decorative corner elements for top deal */}
        {isTopDeal && (
          <>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-200/40 to-transparent rounded-tr-2xl"></div>
            <div className="absolute top-2 right-2">
              <Trophy className="h-5 w-5 text-amber-500 animate-bounce" />
            </div>
          </>
        )}

        {/* Top Deal Badge - More celebratory */}
        {isTopDeal && (
          <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-white px-5 py-2 rounded-full text-xs font-black flex items-center gap-2 shadow-xl border-2 border-yellow-300">
            <Star className="h-4 w-4 fill-current animate-spin-slow" />
            🎉 BÄSTA ERBJUDANDET
          </div>
        )}

        {/* Savings Badge - More vibrant */}
        {hasCampaign && !isTopDeal && (
          <div className="absolute -top-3 right-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border-2 border-green-400">
            <Gift className="h-3.5 w-3.5 fill-current" />
            🔥 KAMPANJ
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          {/* Operator */}
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 ${
                isTopDeal 
                  ? 'bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-400'
                  : 'bg-gradient-to-br from-emerald-50 to-green-50 border-green-300'
              }`}>
                <span className={`text-sm font-bold ${
                  isTopDeal ? 'text-amber-700' : 'text-green-700'
                }`}>{subscription.operator.charAt(0)}</span>
              </div>
              <div className="font-bold text-gray-900">{subscription.operator}</div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black text-gray-900">{subscription.data}</div>
              {subscription.speed === '5G' && (
                <div className="px-2.5 py-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-md">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  5G
                </div>
              )}
            </div>
          </div>

          {/* Price - Enhanced with glow effect */}
          <div className="text-right">
            {hasCampaign ? (
              <>
                <div className="text-sm text-gray-500 line-through mb-1">{subscription.price} kr/mån</div>
                <div className={`text-4xl font-black ${isTopDeal ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent'}`}>
                  {subscription.campaignPrice}
                  <span className="text-lg font-semibold text-gray-600"> kr</span>
                </div>
                <div className="text-xs text-gray-600 mt-0.5">/månad</div>
              </>
            ) : (
              <>
                <div className="text-4xl font-black text-gray-900">
                  {subscription.price}
                  <span className="text-lg font-semibold text-gray-600"> kr</span>
                </div>
                <div className="text-xs text-gray-600 mt-0.5">/månad</div>
              </>
            )}
          </div>
        </div>

        {/* Savings Display - More prominent */}
        {hasCampaign && (
          <div className={`mb-4 p-4 rounded-xl border-2 relative overflow-hidden ${
            isTopDeal 
              ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-amber-400' 
              : 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-green-400'
          }`}>
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 opacity-10">
              <Sparkles className="h-16 w-16" />
            </div>
            <div className="flex items-center justify-between relative">
              <div>
                <div className={`text-xs font-bold uppercase tracking-wide ${isTopDeal ? 'text-amber-800' : 'text-green-800'} mb-1`}>
                  💰 {subscription.campaignInfo}
                </div>
                <div className={`text-2xl font-black ${isTopDeal ? 'text-amber-600' : 'text-green-700'}`}>
                  Spara {savings} kr/mån
                </div>
                <div className={`text-xs font-semibold mt-1 ${isTopDeal ? 'text-amber-700' : 'text-green-700'}`}>
                  = {savings * 12} kr/år!
                </div>
              </div>
              <TrendingDown className={`h-10 w-10 ${isTopDeal ? 'text-amber-500' : 'text-green-600'}`} />
            </div>
          </div>
        )}

        {/* Social proof for top deal */}
        {isTopDeal && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-xs">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 font-semibold">Mest populära valet - över 1,200 kunder denna månad</span>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="flex flex-wrap gap-3 text-sm mb-5 pb-5 border-b border-gray-100">
          <div className="inline-flex items-center gap-1.5 text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
            {subscription.bindingPeriod}
          </div>
          {features.map(feature => (
            <div key={feature} className="inline-flex items-center gap-1.5 text-green-700 font-medium">
              <Check className="h-4 w-4" />
              {feature}
            </div>
          ))}
        </div>

        {/* Actions - More compelling */}
        <div className="flex gap-3">
          <button className={`flex-1 relative overflow-hidden ${isTopDeal ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500' : 'bg-gradient-to-r from-emerald-600 to-green-700'} text-white px-5 py-4 rounded-xl transition-all font-black text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95`}>
            <span className="relative z-10">✨ Beställ nu</span>
            {isTopDeal && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            )}
          </button>
          <button className="px-4 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all inline-flex items-center gap-1 font-semibold">
            Info
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Urgency element for campaigns */}
        {hasCampaign && (
          <div className="mt-3 text-center">
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${isTopDeal ? 'text-amber-700' : 'text-green-700'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isTopDeal ? 'bg-amber-600' : 'bg-green-600'} animate-pulse`}></div>
              Begränsat erbjudande - boka idag!
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop layout - more compact, table-like
  const desktopCardClasses = isTopDeal 
    ? 'border-amber-400 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30' 
    : hasCampaign
    ? 'border-green-300 shadow-md shadow-green-500/10 hover:shadow-lg hover:shadow-green-500/20'
    : 'border-gray-200 hover:border-green-300 hover:shadow-lg';

  return (
    <div className={`group relative bg-white rounded-xl border-2 p-5 transition-all duration-300 ${desktopCardClasses}`}>
      {/* Top Deal Badge */}
      {isTopDeal && (
        <div className="absolute -top-2.5 left-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
          <Star className="h-3 w-3 fill-current" />
          🎉 BÄSTA PRISET
        </div>
      )}

      <div className="grid grid-cols-12 gap-6 items-center">
        {/* Operator - 3 cols */}
        <div className="col-span-3 flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 flex-shrink-0 ${
            isTopDeal
              ? 'bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-400'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'
          }`}>
            <span className={`text-base font-bold ${isTopDeal ? 'text-amber-700' : 'text-gray-700'}`}>{subscription.operator.charAt(0)}</span>
          </div>
          <div>
            <div className="font-bold text-gray-900 mb-0.5">{subscription.operator}</div>
            <div className="text-xs text-gray-500">{subscription.speed}</div>
          </div>
        </div>

        {/* Data - 2 cols */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black text-gray-900">{subscription.data}</div>
            {subscription.speed === '5G' && (
              <div className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded flex items-center gap-1">
                <Zap className="h-3 w-3 fill-current" />
                5G
              </div>
            )}
          </div>
        </div>

        {/* Features - 2 cols */}
        <div className="col-span-2">
          <div className="space-y-1.5">
            <div className="text-sm text-gray-600 inline-flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
              {subscription.bindingPeriod}
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map(feature => (
                  <div key={feature} className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                    <Check className="h-3.5 w-3.5" />
                    {feature}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Savings - 2 cols */}
        <div className="col-span-2">
          {hasCampaign && (
            <div className={`p-2.5 rounded-lg border-2 ${isTopDeal ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'}`}>
              <div className={`text-xs font-semibold ${isTopDeal ? 'text-amber-700' : 'text-green-700'} mb-0.5`}>
                {subscription.campaignInfo}
              </div>
              <div className={`text-lg font-black ${isTopDeal ? 'text-amber-600' : 'text-green-700'} flex items-center gap-1`}>
                <TrendingDown className="h-4 w-4" />
                Spara {savings} kr
              </div>
            </div>
          )}
        </div>

        {/* Price & Actions - 3 cols */}
        <div className="col-span-3 flex items-center justify-end gap-4">
          {/* Price */}
          <div className="text-right">
            {hasCampaign ? (
              <>
                <div className="text-xs text-gray-500 line-through mb-0.5">{subscription.price} kr/mån</div>
                <div className={`text-2xl font-black ${isTopDeal ? 'bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent'}`}>
                  {subscription.campaignPrice}
                  <span className="text-sm font-semibold text-gray-600"> kr/mån</span>
                </div>
              </>
            ) : (
              <div className="text-2xl font-black text-gray-900">
                {subscription.price}
                <span className="text-sm font-semibold text-gray-600"> kr/mån</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className={`${isTopDeal ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 shadow-amber-500/25 hover:shadow-amber-500/35' : 'bg-gradient-to-r from-green-700 to-green-900 shadow-green-600/20 hover:shadow-green-600/30'} text-white px-6 py-2.5 rounded-lg transition-all font-bold text-sm shadow-md hover:shadow-lg hover:scale-105`}>
              Beställ
            </button>
            <button className="px-3 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all inline-flex items-center gap-1 text-sm font-medium">
              Info
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
