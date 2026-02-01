import { Sparkles, ArrowDown, CheckCircle, Clock, Check } from 'lucide-react';
import { t } from '@/i18n';
import { Logo } from '@/app/components/Logo';

export function Hero() {
  const scrollToResults = () => {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Subtle gradient orbs for depth */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100/40 to-cyan-100/40 rounded-full blur-3xl opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-[16px] py-[24px] sm:py-12">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-[14px] mt-[0px] mr-[0px] ml-[0px]">
            <Logo />
          </div>
          
          {/* Small eyebrow */}
          
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-2 leading-tight">
            {t('hero.title.part1')}{' '}
            <span className="bg-gradient-to-r from-green-600 via-green-700 to-green-600 bg-clip-text text-transparent">
              {t('hero.title.highlight')}
            </span>
            {' '}{t('hero.title.part2')}
          </h1>
          
          {/* Subheadline */}
          <p className="sm:text-xl text-slate-600 mb-3 leading-relaxed text-[15px]">
            {t('hero.subtitle')}
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-slate-600">
            {/* Freshness indicator */}
            <div className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="font-medium text-[12px]">{t('hero.trust.updatedToday')}</span>
            </div>
            
            {/* Divider */}
            <div className="w-px h-4 bg-slate-200" />
            
            {/* Trust signals */}
            <div className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-600" />
              <span className="font-medium text-[12px]">{t('hero.trust.officialPrices')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}