import { X, Wifi, Globe, Signal, Unlock, Calendar, Phone, Sparkles } from 'lucide-react';
import type { Plan } from '@/hooks/usePlans';
import { getOperatorLogo } from '@/lib/operatorLogos';
import { t, tr } from '@/i18n';

interface PlanDetailsModalProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
  dealType?: 'best-price' | 'most-data' | 'popular';
}

export function PlanDetailsModal({ plan, isOpen, onClose, dealType }: PlanDetailsModalProps) {
  const operatorLogo = getOperatorLogo(plan.title);
  const hasCampaign = plan.campaign !== null;
  const savings = hasCampaign ? plan.regularPrice - plan.price : 0;

  // Match gradient to card type
  const gradientConfig = {
    'best-price': {
      gradient: 'from-amber-500 via-yellow-500 to-orange-500',
      glow: 'shadow-amber-500/30',
      bg: 'from-amber-50 to-orange-50'
    },
    'most-data': {
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      glow: 'shadow-blue-500/30',
      bg: 'from-blue-50 to-teal-50'
    },
    'popular': {
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      glow: 'shadow-purple-500/30',
      bg: 'from-purple-50 to-rose-50'
    }
  };

  const config = dealType ? gradientConfig[dealType] : {
    gradient: 'from-slate-700 to-slate-900',
    glow: 'shadow-slate-900/20',
    bg: 'from-slate-50 to-slate-100'
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className={`relative p-6 bg-gradient-to-r ${config.bg} border-b border-slate-200`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all hover:scale-110"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>

          <div className="flex items-center gap-4 mb-3">
            {operatorLogo ? (
              <img 
                src={operatorLogo} 
                alt={plan.title} 
                className="h-16 object-contain bg-white p-2"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-sm">
                <span className="text-2xl font-bold text-slate-700">
                  {plan.title.charAt(0)}
                </span>
              </div>
            )}
            
            <div>
              <h2 className="font-bold text-slate-900 text-xl">
                {plan.title}
              </h2>
              <p className="text-slate-600">
                {plan.subtitle}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">
              {plan.price}
            </span>
            <span className="text-xl font-semibold text-slate-600">
              {t('modal.pricePerMonth')}
            </span>
          </div>

          {hasCampaign && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-slate-500 line-through">
                {plan.regularPrice} {t('modal.regularPrice')}
              </span>
              {plan.campaign?.months && (
                <span className="text-xs text-slate-500">
                  · {plan.campaign.months} {t('modal.campaignMonths')}
                </span>
              )}
            </div>
          )}

          {hasCampaign && savings > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold mt-3 shadow-md shadow-green-500/30">
              <Sparkles className="w-4 h-4" />
              {tr('modal.savePerMonth', { amount: savings })}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Data */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t('modal.dataSection')}</h3>
            <div className="flex items-baseline gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60">
              <span className="text-4xl font-black text-slate-900">
                {plan.isUnlimited ? '∞' : (plan.dataLabel || t('modal.unlimitedData')).replace(' GB', '')}
              </span>
              <span className="text-xl font-bold text-slate-600">
                {plan.isUnlimited ? t('modal.unlimitedData') : t('modal.gbUnit')}
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t('modal.featuresSection')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Network */}
              {plan.network && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                  <Signal className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">{t('modal.network')}</div>
                    <div className="font-medium text-slate-900">{plan.network}</div>
                  </div>
                </div>
              )}

              {/* eSIM */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                plan.esim 
                  ? 'bg-blue-50 border border-blue-200/60' 
                  : 'bg-slate-50 border border-slate-200/60 opacity-50'
              }`}>
                <Wifi className={`w-5 h-5 ${plan.esim ? 'text-blue-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs text-slate-500">{t('modal.esim')}</div>
                  <div className={`font-medium ${plan.esim ? 'text-blue-900' : 'text-slate-400'}`}>
                    {plan.esim ? t('modal.yes') : t('modal.no')}
                  </div>
                </div>
              </div>

              {/* EU Roaming */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                plan.euRoaming 
                  ? 'bg-purple-50 border border-purple-200/60' 
                  : 'bg-slate-50 border border-slate-200/60 opacity-50'
              }`}>
                <Globe className={`w-5 h-5 ${plan.euRoaming ? 'text-purple-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs text-slate-500">{t('modal.euRoaming')}</div>
                  <div className={`font-medium ${plan.euRoaming ? 'text-purple-900' : 'text-slate-400'}`}>
                    {plan.euRoaming ? t('modal.yes') : t('modal.no')}
                  </div>
                </div>
              </div>

              {/* Binding */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                plan.bindingMonths === 0 
                  ? 'bg-green-50 border border-green-200/60' 
                  : 'bg-orange-50 border border-orange-200/60'
              }`}>
                {plan.bindingMonths === 0 ? (
                  <Unlock className="w-5 h-5 text-green-600" />
                ) : (
                  <Calendar className="w-5 h-5 text-orange-600" />
                )}
                <div>
                  <div className="text-xs text-slate-500">{t('modal.binding')}</div>
                  <div className={`font-medium ${plan.bindingMonths === 0 ? 'text-green-900' : 'text-orange-900'}`}>
                    {plan.bindingMonths === 0 ? t('modal.bindingNone') : `${plan.bindingMonths} ${t('modal.bindingMonths')}`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(plan.calls !== undefined || plan.sms !== undefined) && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t('modal.otherSection')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {plan.calls !== undefined && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                    <Phone className="w-5 h-5 text-slate-600" />
                    <div>
                      <div className="text-xs text-slate-500">{t('modal.calls')}</div>
                      <div className="font-medium text-slate-900">
                        {plan.calls === 'unlimited' ? t('modal.unlimited') : plan.calls}
                      </div>
                    </div>
                  </div>
                )}
                {plan.sms !== undefined && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                    <Signal className="w-5 h-5 text-slate-600" />
                    <div>
                      <div className="text-xs text-slate-500">{t('modal.sms')}</div>
                      <div className="font-medium text-slate-900">
                        {plan.sms === 'unlimited' ? t('modal.unlimited') : plan.sms}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA Button */}
          {plan.sourceUrl && (
            <button
              onClick={() => window.open(plan.sourceUrl, '_blank', 'noopener,noreferrer')}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-lg
                transition-all duration-200
                bg-gradient-to-r ${config.gradient} text-white shadow-lg ${config.glow}
                hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              {t('modal.goToOperator')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}