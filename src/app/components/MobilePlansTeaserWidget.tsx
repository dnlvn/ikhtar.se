import { Link } from "react-router";
import { ArrowLeft, ExternalLink, Lock, RefreshCw, Unlock } from "lucide-react";
import { usePlans, type Plan } from "@/hooks/usePlans";
import { useFilteredPlans } from "@/hooks/useFilteredPlans";
import { getOperatorLogo } from "@/lib/operatorLogos";
import { getActiveMobileProviderPromotion } from "@/lib/mobileProviderConfig";

function trackAndOpenOffer(plan: Plan) {
  const activePromotion = getActiveMobileProviderPromotion(plan.title);
  const ctaUrl = activePromotion?.promotionUrl || plan.sourceUrl;

  if (!ctaUrl) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "cta_click",
    operator: plan.title,
    plan_name: plan.subtitle,
    price: plan.price,
  });

  window.open(ctaUrl, "_blank", "noopener,noreferrer");
}

function FallbackCtaCard() {
  return (
    <div className="rounded-[16px] border border-emerald-200/70 bg-emerald-50 p-5 text-center">
      <p className="mb-4 text-sm leading-relaxed text-emerald-900">
        انتقل إلى صفحة المقارنة لمشاهدة العروض الحالية المحدثة من المشغّلين.
      </p>
      <Link
        to="/mobilabonnemang"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-green-800"
      >
        شاهد أرخص الباقات في المقارنة
        <ArrowLeft className="h-4 w-4 rotate-180" />
      </Link>
    </div>
  );
}

function TeaserPlanCard({ plan }: { plan: Plan }) {
  const operatorLogo = getOperatorLogo(plan.title);
  const hasOfferLink = Boolean(plan.sourceUrl || getActiveMobileProviderPromotion(plan.title)?.promotionUrl);

  return (
    <div className="rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {operatorLogo ? (
            <img
              src={operatorLogo}
              alt={plan.title}
              className="h-9 w-auto max-w-[86px] object-contain"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-700">
              {plan.title.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-black text-slate-900">{plan.title}</div>
            <div className="text-xs font-semibold text-slate-500">
              {plan.bindingMonths === 0 ? "بدون التزام" : `${plan.bindingMonths} شهر التزام`}
            </div>
          </div>
        </div>
        {plan.bindingMonths === 0 ? (
          <Unlock className="h-4 w-4 flex-shrink-0 text-slate-500" />
        ) : (
          <Lock className="h-4 w-4 flex-shrink-0 text-slate-500" />
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
        <div>
          <div className="text-xs font-semibold text-slate-500">السعر</div>
          <div className="text-2xl font-black leading-none text-slate-900">
            {plan.price}
            <span className="mr-1 text-xs font-bold text-slate-600">كرونة/شهرياً</span>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500">الإنترنت</div>
          <div className="text-xl font-black leading-none text-slate-900">{plan.dataLabel}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => trackAndOpenOffer(plan)}
        disabled={!hasOfferLink}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        شاهد العرض
        <ExternalLink className="h-4 w-4" />
      </button>
    </div>
  );
}

export function MobilePlansTeaserWidget() {
  const { plans, loading, error } = usePlans();
  const { filteredPlans } = useFilteredPlans({
    plans,
    activeFilters: new Set(),
    sortBy: "price-asc",
  });

  const teaserPlans = filteredPlans.slice(0, 3);

  return (
    <section className="mx-auto max-w-4xl px-4 pb-8">
      <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-2 text-right sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">أرخص الباقات حالياً</h2>
            <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
              <RefreshCw className="h-4 w-4 text-green-600" />
              عروض محدّثة من مواقع المشغّلين
            </p>
          </div>
          <Link
            to="/mobilabonnemang"
            className="inline-flex items-center gap-2 text-sm font-black text-green-700 hover:text-green-800"
          >
            عرض جميع باقات الجوال
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-44 animate-pulse rounded-[14px] bg-slate-100" />
            ))}
          </div>
        )}

        {!loading && (error || teaserPlans.length === 0) && <FallbackCtaCard />}

        {!loading && !error && teaserPlans.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {teaserPlans.map((plan) => (
              <TeaserPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
