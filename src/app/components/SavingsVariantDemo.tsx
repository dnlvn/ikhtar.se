import { PremiumPlanCard } from './PremiumPlanCard';
import type { Plan } from '@/hooks/usePlans';

// Demo plan with campaign savings
const demoPlan: Plan = {
  id: 'demo-1',
  title: 'Hallon',
  subtitle: 'Fria samtal + SMS',
  dataGb: 100,
  dataLabel: '100 GB',
  isUnlimited: false,
  price: 19,
  regularPrice: 109,
  campaign: {
    months: 3,
    description: 'Kampanjpris i 3 månader'
  },
  bindingMonths: 0,
  network: 'Tre',
  esim: true,
  euRoaming: true,
  calls: 'unlimited',
  sms: 'unlimited',
  sourceUrl: 'https://example.com'
};

export function SavingsVariantDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Savings Badge Design Variants
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the variant that best supports the price without looking like a clickable button. 
            The CTA button should remain the only strong action element.
          </p>
        </div>

        {/* Variants Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Variant 1: Gradient Text */}
          <div>
            <div className="mb-4 p-4 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">1️⃣</span>
                <h2 className="text-xl font-bold text-slate-900">Gradient Text</h2>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Style:</strong> Clean gradient text with animated icon, no background
              </p>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Pros:</strong> Modern, lightweight, doesn't compete with CTA
              </p>
              <p className="text-sm text-slate-600">
                <strong>Cons:</strong> May be less noticeable at quick glance
              </p>
            </div>
            <PremiumPlanCard 
              plan={demoPlan} 
              dealType="best-price"
              dealRank={1}
              savingsVariant="gradient-text"
            />
          </div>

          {/* Variant 2: Outlined */}
          <div>
            <div className="mb-4 p-4 bg-white rounded-xl border-2 border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">2️⃣</span>
                <h2 className="text-xl font-bold text-slate-900">Outlined Badge</h2>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Style:</strong> Border-only badge with transparent background
              </p>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Pros:</strong> Clear visual boundary, noticeable but not heavy
              </p>
              <p className="text-sm text-slate-600">
                <strong>Cons:</strong> Could still feel slightly button-like
              </p>
            </div>
            <PremiumPlanCard 
              plan={demoPlan} 
              dealType="best-price"
              dealRank={1}
              savingsVariant="outlined"
            />
          </div>

          {/* Variant 3: Soft Highlight */}
          <div>
            <div className="mb-4 p-4 bg-white rounded-xl border-2 border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">3️⃣</span>
                <h2 className="text-xl font-bold text-slate-900">Soft Highlight</h2>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Style:</strong> Subtle background with left accent border
              </p>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Pros:</strong> Clearly visible, feels like highlighted text
              </p>
              <p className="text-sm text-slate-600">
                <strong>Cons:</strong> Slightly larger visual footprint
              </p>
            </div>
            <PremiumPlanCard 
              plan={demoPlan} 
              dealType="best-price"
              dealRank={1}
              savingsVariant="soft-highlight"
            />
          </div>
        </div>

        {/* Comparison with regular cards */}
        <div className="border-t-2 border-slate-200 pt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            All Variants on Regular Cards (No Deal Badge)
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-900 rounded-lg font-bold text-sm">
                  Gradient Text
                </span>
              </div>
              <PremiumPlanCard 
                plan={demoPlan}
                savingsVariant="gradient-text"
              />
            </div>
            
            <div>
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-2 bg-green-100 text-green-900 rounded-lg font-bold text-sm">
                  Outlined
                </span>
              </div>
              <PremiumPlanCard 
                plan={demoPlan}
                savingsVariant="outlined"
              />
            </div>
            
            <div>
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-2 bg-purple-100 text-purple-900 rounded-lg font-bold text-sm">
                  Soft Highlight
                </span>
              </div>
              <PremiumPlanCard 
                plan={demoPlan}
                savingsVariant="soft-highlight"
              />
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-12 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
          <h3 className="text-xl font-bold text-slate-900 mb-3">💡 Recommendation for Conversion</h3>
          <p className="text-slate-700 mb-3">
            <strong>Variant 1 (Gradient Text)</strong> is recommended for maximum conversion because:
          </p>
          <ul className="space-y-2 text-slate-700 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Looks like emphasized informational text, not a button</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>The animated sparkle icon draws attention without heavy styling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>CTA button remains the only clickable-looking element</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Modern, clean aesthetic matches premium design</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
