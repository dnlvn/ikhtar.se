import { usePlans } from "@/hooks/usePlans";
import { PremiumPlanCard as V1 } from "@/app/components/PremiumPlanCard_V1";
import { PremiumPlanCard as V2 } from "@/app/components/PremiumPlanCard_V2";
import { PremiumPlanCard as V3 } from "@/app/components/PremiumPlanCard_V3";

export default function GoldVariationsDemo() {
  const { plans, loading } = usePlans();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Laddar abonnemang...</p>
        </div>
      </div>
    );
  }

  if (plans.length < 3) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Inte tillräckligt med abonnemang för demo (behöver minst 3)</p>
        </div>
      </div>
    );
  }

  const topPlans = plans.slice(0, 3);
  const dealTypes: Array<'best-price' | 'most-data' | 'popular'> = ['best-price', 'most-data', 'popular'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-400 rounded-full px-4 py-2 mb-4">
            <span className="text-2xl">🏆</span>
            <span className="text-sm font-black text-amber-900 uppercase tracking-wider">Top 3 Gold Variations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900">
            3 Gold Highlight Designs
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Maximera klick på CTA för de bästa dealsen med kraftfull guldframhävning
          </p>
        </div>

        {/* Variation 1 */}
        <section className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  Variation 1: Bold Gold Frame + Animated Badge
                </h2>
                <p className="text-slate-600">
                  <strong>Fördelar:</strong> Kraftig 3px guldram • Animerad krona-badge • Pulsande CTA • Stark guldskugga
                </p>
              </div>
              <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-bold">
                V1
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {topPlans.map((plan, idx) => (
                <V1 key={plan.id} plan={plan} dealRank={(idx + 1) as 1 | 2 | 3} dealType={dealTypes[idx]} />
              ))}
            </div>
          </div>
        </section>

        {/* Variation 2 */}
        <section className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  Variation 2: Gold Glow + Corner Ribbon
                </h2>
                <p className="text-slate-600">
                  <strong>Fördelar:</strong> Glödande guldaura • Hörn-band "TOP DEAL" • Shimmer-effekt på CTA • Stor & fet CTA
                </p>
              </div>
              <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-bold">
                V2
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {topPlans.map((plan, idx) => (
                <V2 key={plan.id} plan={plan} dealRank={(idx + 1) as 1 | 2 | 3} dealType={dealTypes[idx]} />
              ))}
            </div>
          </div>
        </section>

        {/* Variation 3 */}
        <section className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  Variation 3: Double Gold Border + Star Badge
                </h2>
                <p className="text-slate-600">
                  <strong>Fördelar:</strong> Dubbel guldram • Roterande stjärn-badge • Radiell guldgradient • Mega CTA med guldring
                </p>
              </div>
              <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-bold">
                V3
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {topPlans.map((plan, idx) => (
                <V3 key={plan.id} plan={plan} dealRank={(idx + 1) as 1 | 2 | 3} dealType={dealTypes[idx]} />
              ))}
            </div>
          </div>
        </section>

        {/* Comparison: Regular vs Gold */}
        <section className="space-y-6">
          <div className="bg-slate-100 rounded-2xl p-6 border-2 border-slate-300">
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Jämförelse: Vanliga kort (Ingen highlight)
            </h2>
            <p className="text-slate-600 mb-6">
              Så här ser kort utanför topp 3 ut - neutral grå styling för kontrast
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {topPlans.map((plan) => (
                <V1 key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        {/* Key Differences Summary */}
        <section className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl p-8 border-2 border-amber-400 shadow-xl">
          <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">
            🎯 Nyckelfunktioner för att maximera CTA-klick
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-md">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-bold text-slate-900 mb-2">Visuell hierarki</h3>
              <p className="text-sm text-slate-600">
                Tjocka guldborders och glow-effekter gör topp 3 omöjliga att missa
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-md">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-bold text-slate-900 mb-2">Premium känsla</h3>
              <p className="text-sm text-slate-600">
                Guldteman signalerar värde och exklusivitet - "detta är bästa dealen"
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-md">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-slate-900 mb-2">Animerade CTA:er</h3>
              <p className="text-sm text-slate-600">
                Pulsande, glödande, större knappar med ikoner drar ögonen till "Beställ"
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
