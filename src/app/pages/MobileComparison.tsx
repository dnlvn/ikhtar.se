import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Hero } from "@/app/components/Hero";
import { FilterSection } from "@/app/components/FilterSection";
import { PremiumPlanCard } from "@/app/components/PremiumPlanCard_V1";
import { PremiumPlanCardSkeleton } from "@/app/components/PremiumPlanCardSkeleton";
import { SeoContentSection } from "@/app/components/SeoContentSection";
import { MobileQuickComparison } from "@/app/components/MobileQuickComparison";
import { MobileDataUsageGuide } from "@/app/components/MobileDataUsageGuide";
import { usePlans } from "@/hooks/usePlans";
import {
  useFilteredPlans,
  type SortOption,
} from "@/hooks/useFilteredPlans";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { t } from "@/i18n";

export function MobileComparison() {
  const [sortBy, setSortBy] = useState<SortOption>("best-deals");
  const [expandedOperators, setExpandedOperators] = useState<Set<string>>(new Set());

  const { plans, loading, error, retry } = usePlans();

  const { filteredPlans, diverseList, additionalPlansByOperator } =
    useFilteredPlans({
      plans,
      activeFilters: new Set(),
      sortBy,
    });

  const resetFilters = () => {
    setSortBy("best-deals");
  };

  const handleSortChange = (nextSort: SortOption) => {
    setSortBy(nextSort);
    setExpandedOperators(new Set());

    window.setTimeout(() => {
      const resultsSection = document.getElementById("results-section");
      if (!resultsSection) return;

      const offsetTop = resultsSection.getBoundingClientRect().top + window.scrollY - 86;
      window.scrollTo({ top: Math.max(offsetTop, 0), behavior: "smooth" });
    }, 0);
  };

  return (
    <>
      <Helmet>
        <title>{t("seo.title")}</title>
        <meta name="description" content={t("seo.description")} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <link rel="canonical" href="https://ikhtar.se/mobilabonnemang" />
      </Helmet>

      {/* Hero Section */}
      <Hero />

      {/* Filter Section - Sticky */}
      {!loading && !error && (
        <FilterSection
          sortBy={sortBy}
          onSortChange={handleSortChange}
          resultsCount={filteredPlans.length}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-[12px] md:px-4 py-[14px]">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-1">
                  {t("home.error.title")}
                </h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <button
                  onClick={retry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t("home.error.retry")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PremiumPlanCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Loaded State */}
        {!loading && !error && (
          <>
            {/* Empty State */}
            {filteredPlans.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
                  <span className="text-4xl">😔</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {t("home.empty.title")}
                </h3>
                <p className="text-slate-600 mb-8 text-lg">
                  {t("home.empty.description")}
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  {t("home.empty.resetFilters")}
                </button>
              </div>
            ) : (
              <>
                {/* Disclaimer - Top */}
                <div className="text-center mb-2">
                  <p className="text-xs text-slate-500 text-[10px]">
                    {t("home.disclaimer")}
                  </p>
                </div>

                <div className="mb-3 flex justify-center" dir="rtl">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                    جميع الباقات تشمل مكالمات ورسائل مجانية داخل السويد
                  </div>
                </div>

                {/* Plan Cards Grid */}
                <div id="results-section" className="grid grid-cols-1 gap-2">
                  {diverseList.map((plan, index) => {
                    const operator = plan.title;
                    const additionalPlans =
                      additionalPlansByOperator.get(operator) || [];
                    const isExpanded = expandedOperators.has(operator);

                    let dealType:
                      | "best-price"
                      | "most-data"
                      | "popular"
                      | undefined;
                    let dealRank: 1 | 2 | 3 | undefined;

                    if (index === 0) {
                      dealType = "best-price";
                      dealRank = 1;
                    } else if (index === 1) {
                      dealType = "most-data";
                      dealRank = 2;
                    } else if (index === 2) {
                      dealType = "popular";
                      dealRank = 3;
                    }

                    return (
                      <div key={plan.id}>
                        {/* Best visible plan from operator in current mode */}
                        <PremiumPlanCard
                          plan={plan}
                          dealRank={dealRank}
                          dealType={dealType}
                          allPlans={filteredPlans}
                          sortMode={sortBy}
                          cardPosition={index + 1}
                        />

                        {/* Show more button if operator has additional plans */}
                        {additionalPlans.length > 0 && (
                          <div className="mt-1.5 text-center">
                            {!isExpanded ? (
                              <button
                                onClick={() =>
                                  setExpandedOperators((prev) =>
                                    new Set([...prev, operator])
                                  )
                                }
                                className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-green-800 hover:decoration-green-300"
                              >
                                شاهد {additionalPlans.length} باقات أخرى من {operator}
                              </button>
                            ) : (
                              <>
                                {/* Additional plans */}
                                <div className="space-y-2 mb-1.5">
                                  {additionalPlans.map((additionalPlan, additionalIndex) => (
                                    <PremiumPlanCard
                                      key={additionalPlan.id}
                                      plan={additionalPlan}
                                      allPlans={filteredPlans}
                                      sortMode={sortBy}
                                      cardPosition={index + additionalIndex + 2}
                                      isAdditionalPlan
                                    />
                                  ))}
                                </div>
                                {/* Collapse button */}
                                <button
                                  onClick={() =>
                                    setExpandedOperators((prev) => {
                                      const next = new Set(prev);
                                      next.delete(operator);
                                      return next;
                                    })
                                  }
                                  className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900"
                                >
                                  إخفاء عروض {operator}
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Disclaimer - Bottom */}
                <div className="text-center mt-4">
                  <p className="text-xs text-slate-500 text-[10px]">
                    {t("home.disclaimer")}
                  </p>
                </div>

                <MobileQuickComparison plans={diverseList} sortMode={sortBy} />
                <MobileDataUsageGuide />
              </>
            )}
          </>
        )}
      </main>

      {/* SEO Content Section - Below all plan cards */}
      {!loading && !error && filteredPlans.length > 0 && <SeoContentSection plans={plans} />}
    </>
  );
}
