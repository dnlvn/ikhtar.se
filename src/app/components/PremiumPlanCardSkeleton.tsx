export function PremiumPlanCardSkeleton() {
  return (
    <div className="relative">
      <div className="rounded-[18px] bg-white border-2 border-slate-200 shadow-sm overflow-hidden animate-pulse">
        <div className="p-4">
          {/* Top row */}
          <div className="flex items-center justify-between mb-2.5">
            {/* Logo + name */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-slate-200 rounded-lg" />
              <div className="h-4 w-16 bg-slate-200 rounded" />
            </div>
            {/* Data */}
            <div className="h-7 w-16 bg-slate-200 rounded" />
            {/* Price */}
            <div className="flex flex-col items-end gap-1">
              <div className="h-2.5 w-14 bg-slate-100 rounded" />
              <div className="h-10 w-20 bg-slate-200 rounded" />
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between">
            {/* Features */}
            <div className="flex flex-col gap-0.5">
              <div className="h-3.5 w-24 bg-slate-100 rounded" />
              <div className="h-3.5 w-20 bg-slate-100 rounded" />
            </div>
            {/* CTA */}
            <div className="h-9 w-32 bg-slate-200 rounded-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );
}