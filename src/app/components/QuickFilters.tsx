import { DollarSign, Database, Unlock, CreditCard, Globe, Sparkles } from 'lucide-react';

interface QuickFiltersProps {
  activeFilters: Set<string>;
  onFilterToggle: (filter: string) => void;
}

export function QuickFilters({ activeFilters, onFilterToggle }: QuickFiltersProps) {
  const filters = [
    { id: 'cheapest', label: '💰 Billigast', icon: DollarSign, color: 'from-amber-500 to-yellow-500', emoji: '🎯' },
    { id: 'most-data', label: '📱 Mest data', icon: Database, color: 'from-emerald-600 to-green-700', emoji: '🚀' },
    { id: 'no-binding', label: '🔓 Ingen bindning', icon: Unlock, color: 'from-green-600 to-teal-700', emoji: '✨' },
    { id: 'esim', label: 'eSIM', icon: CreditCard, color: 'from-blue-600 to-indigo-700', emoji: '📲' },
    { id: 'eu-roaming', label: 'EU roaming', icon: Globe, color: 'from-purple-600 to-pink-700', emoji: '🌍' },
  ];

  const getGuidanceText = () => {
    if (activeFilters.size === 0) return null;
    
    const filterArray = Array.from(activeFilters);
    
    if (filterArray.length === 1) {
      const filter = filterArray[0];
      if (filter === 'cheapest') return '🎉 Perfekt! Vi visar sorterat på lägsta pris först!';
      if (filter === 'most-data') return '📊 Utmärkt val! Här är abonnemangen med mest surf';
      if (filter === 'no-binding') return '🆓 Smart! Flexibla abonnemang utan bindningstid';
      if (filter === 'esim') return '📱 Modernt! Direkt aktivering med eSIM';
      if (filter === 'eu-roaming') return '✈️ Resa mycket? Här är de bästa för EU roaming';
    } else {
      return `✨ Kombinerar ${filterArray.length} filter för att hitta din perfekta match!`;
    }
    
    return null;
  };

  const guidanceText = getGuidanceText();

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Välj åt mig - snabbt & enkelt
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilters.has(filter.id);
          
          return (
            <button
              key={filter.id}
              onClick={() => onFilterToggle(filter.id)}
              className={`group relative inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? `bg-gradient-to-r ${filter.color} text-white shadow-xl scale-105 border-2 border-white`
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-400 hover:shadow-lg hover:scale-105'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-xl"></div>
              )}
              <Icon className={`h-4 w-4 relative z-10 ${isActive ? '' : 'text-gray-500 group-hover:text-green-600'}`} />
              <span className="relative z-10">{filter.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Guidance feedback with celebration */}
      {guidanceText && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-md animate-pulse-slow">
          <p className="text-sm text-green-900 font-semibold flex items-center gap-2">
            <span className="text-lg">✓</span>
            {guidanceText}
          </p>
        </div>
      )}
    </div>
  );
}