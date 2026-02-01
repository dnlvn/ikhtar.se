import { useState, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import type { Plan } from '@/hooks/usePlans';

interface StickyCTAProps {
  cheapestPlan: Plan | null;
}

export function StickyCTA({ cheapestPlan }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!cheapestPlan) return null;

  const handleClick = () => {
    if (cheapestPlan.sourceUrl) {
      window.open(cheapestPlan.sourceUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback: scroll to top if no source URL
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`hidden lg:block fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-t-4 border-amber-300 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Deal summary */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-0.5">
                  💰 Billigast just nu
                </div>
                <div className="text-xl font-black text-white">
                  {cheapestPlan.title} • {cheapestPlan.dataLabel} • {cheapestPlan.price} kr/mån
                </div>
              </div>
            </div>

            {/* Right: CTA button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClick}
                disabled={!cheapestPlan.sourceUrl}
                className="relative overflow-hidden bg-white text-amber-700 px-8 py-4 rounded-xl font-black text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Till erbjudandet hos {cheapestPlan.title} →
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/40 to-transparent animate-shimmer"></div>
              </button>

              {/* Scroll to top button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
