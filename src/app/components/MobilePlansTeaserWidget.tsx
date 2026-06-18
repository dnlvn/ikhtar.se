import { Link } from "react-router";
import { ArrowLeft, ExternalLink, Lock, RefreshCw, Unlock } from "lucide-react";
import { usePlans, type Plan } from "@/hooks/usePlans";
import { useFilteredPlans } from "@/hooks/useFilteredPlans";
import { getOperatorLogo } from "@/lib/operatorLogos";
import { getActiveMobileProviderPromotion } from "@/lib/mobileProviderConfig";

type MobilePlansTeaserWidgetProps = {
  intent?: "cheapest" | "operator" | "no-binding" | "data-guide";
  operatorSlug?: string;
  title?: string;
  subtitle?: string;
  showAllOperatorPlans?: boolean;
  showDetailedPricing?: boolean;
  fallbackMessage?: string;
};

function getOperatorKey(plan: Plan) {
  return plan.title.trim().toLowerCase().replace(/\s+/g, "-");
}

function matchesOperator(plan: Plan, operatorSlug?: string) {
  if (!operatorSlug) return false;

  const title = plan.title.trim().toLowerCase();

  if (operatorSlug === "tre") {
    return title === "tre" || title === "3" || title.includes("tre");
  }

  return title.includes(operatorSlug);
}

function getAverage12MonthPrice(plan: Plan) {
  const campaignPrice = plan.campaign?.price;
  const campaignMonths = plan.campaign?.months;

  if (
    campaignPrice == null ||
    campaignMonths == null ||
    campaignMonths <= 0 ||
    plan.regularPrice == null ||
    plan.regularPrice <= 0
  ) {
    return null;
  }

  const cappedCampaignMonths = Math.min(campaignMonths, 12);
  const totalCost =
    campaignPrice * cappedCampaignMonths +
    plan.regularPrice * (12 - cappedCampaignMonths);

  return Math.round(totalCost / 12);
}

function getPostCampaignPrice(plan: Plan) {
  if (plan.campaign?.price == null || plan.regularPrice == null) {
    return null;
  }

  return plan.regularPrice > plan.price ? plan.regularPrice : null;
}

function selectCheapestUniqueOperatorPlans(plans: Plan[]) {
  const selectedPlans: Plan[] = [];
  const seenOperators = new Set<string>();

  for (const plan of plans) {
    const operatorKey = getOperatorKey(plan);

    if (seenOperators.has(operatorKey)) {
      continue;
    }

    seenOperators.add(operatorKey);
    selectedPlans.push(plan);

    if (selectedPlans.length === 3) {
      break;
    }
  }

  if (selectedPlans.length >= 3) {
    return selectedPlans;
  }

  return plans.slice(0, 3);
}

function selectOperatorPlans(
  plans: Plan[],
  operatorSlug?: string,
  showAllOperatorPlans = false
) {
  const operatorPlans = plans.filter((plan) => matchesOperator(plan, operatorSlug));

  if (showAllOperatorPlans) {
    return operatorPlans;
  }

  const operatorPlan = operatorPlans[0];
  const alternatives = selectCheapestUniqueOperatorPlans(
    plans.filter((plan) => !matchesOperator(plan, operatorSlug))
  );

  return [operatorPlan, ...alternatives].filter(Boolean).slice(0, 3) as Plan[];
}

function selectDataGuidePlans(plans: Plan[]) {
  const lightPlan = plans.find((plan) => plan.dataSortValue > 0 && plan.dataSortValue <= 5);
  const mediumPlan = plans.find((plan) => plan.dataSortValue >= 10 && plan.dataSortValue <= 20);
  const heavyPlan = plans.find((plan) => plan.dataSortValue >= 50 || plan.isUnlimited);

  const selected = [lightPlan, mediumPlan, heavyPlan].filter(Boolean) as Plan[];

  if (selected.length >= 3) {
    return selected;
  }

  return selectCheapestUniqueOperatorPlans(plans);
}

function selectTeaserPlans(
  plans: Plan[],
  intent: MobilePlansTeaserWidgetProps["intent"],
  operatorSlug?: string,
  showAllOperatorPlans = false
) {
  if (intent === "operator") {
    return selectOperatorPlans(plans, operatorSlug, showAllOperatorPlans);
  }

  if (intent === "no-binding") {
    return selectCheapestUniqueOperatorPlans(plans.filter((plan) => plan.bindingMonths === 0));
  }

  if (intent === "data-guide") {
    return selectDataGuidePlans(plans);
  }

  return selectCheapestUniqueOperatorPlans(plans);
}

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

function FallbackCtaCard({ message }: { message?: string }) {
  return (
    <div className="rounded-[16px] border border-emerald-200/70 bg-emerald-50 p-5 text-center">
      <p className="mb-4 text-sm leading-relaxed text-emerald-900">
        {message || "انتقل إلى صفحة المقارنة لمشاهدة العروض الحالية المحدثة من المشغّلين."}
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

function TeaserPlanCard({
  plan,
  showDetailedPricing = false,
}: {
  plan: Plan;
  showDetailedPricing?: boolean;
}) {
  const operatorLogo = getOperatorLogo(plan.title);
  const hasOfferLink = Boolean(plan.sourceUrl || getActiveMobileProviderPromotion(plan.title)?.promotionUrl);
  const average12MonthPrice = getAverage12MonthPrice(plan);
  const postCampaignPrice = getPostCampaignPrice(plan);

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

      {showDetailedPricing && (average12MonthPrice || postCampaignPrice) && (
        <div className="mb-4 space-y-1 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-right text-xs font-bold text-slate-600">
          {average12MonthPrice && (
            <p>متوسط 12 شهر: {average12MonthPrice} كرونة/شهر</p>
          )}
          {postCampaignPrice && (
            <p>بعد العرض: {postCampaignPrice} كرونة/شهر</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => trackAndOpenOffer(plan)}
        disabled={!hasOfferLink}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-black text-white shadow-lg transition-all duration-500 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundImage: "linear-gradient(to right, #F7971E 0%, #FFD200 51%, #F7971E 100%)",
          backgroundSize: "200% auto",
          animation: "shimmer-slide 3s ease-in-out infinite",
        }}
      >
        شاهد العرض
        <ExternalLink className="h-4 w-4" />
      </button>
    </div>
  );
}

export function MobilePlansTeaserWidget({
  intent = "cheapest",
  operatorSlug,
  title = "أرخص الباقات حالياً",
  subtitle = "عروض محدّثة من مواقع المشغّلين",
  showAllOperatorPlans = false,
  showDetailedPricing = false,
  fallbackMessage,
}: MobilePlansTeaserWidgetProps) {
  const { plans, loading, error } = usePlans();
  const { filteredPlans } = useFilteredPlans({
    plans,
    activeFilters: new Set(),
    sortBy: "price-asc",
  });

  const teaserPlans = selectTeaserPlans(
    filteredPlans,
    intent,
    operatorSlug,
    showAllOperatorPlans
  );

  return (
    <section className="mx-auto max-w-4xl px-4 pb-8">
      <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-2 text-right sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{title}</h2>
            <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
              <RefreshCw className="h-4 w-4 text-green-600" />
              {subtitle}
            </p>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-44 animate-pulse rounded-[14px] bg-slate-100" />
            ))}
          </div>
        )}

        {!loading && (error || teaserPlans.length === 0) && (
          <FallbackCtaCard message={fallbackMessage} />
        )}

        {!loading && !error && teaserPlans.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {teaserPlans.map((plan) => (
                <TeaserPlanCard
                  key={plan.id}
                  plan={plan}
                  showDetailedPricing={showDetailedPricing}
                />
              ))}
            </div>

            {showAllOperatorPlans && teaserPlans.length <= 1 && fallbackMessage && (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-right text-sm font-semibold text-amber-900">
                {fallbackMessage}
              </p>
            )}

            <div className="mt-5 flex justify-center sm:justify-end">
              <Link
                to="/mobilabonnemang"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-black text-green-800 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
              >
                عرض جميع باقات الجوال
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
