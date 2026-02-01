export function PlanCardSkeleton({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-11 h-11 rounded-xl bg-gray-200"></div>
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="text-right">
            <div className="h-10 w-28 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="flex gap-3 mb-5">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 w-24 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-5 animate-pulse">
      <div className="grid grid-cols-12 gap-6 items-center">
        <div className="col-span-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>

        <div className="col-span-2">
          <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>

        <div className="col-span-2">
          <div className="h-16 w-full bg-gray-200 rounded-lg"></div>
        </div>

        <div className="col-span-3 flex items-center justify-end gap-4">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
