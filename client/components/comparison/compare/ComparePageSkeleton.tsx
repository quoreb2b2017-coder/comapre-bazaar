export function ComparePageSkeleton() {
  return (
    <main className="compare-page animate-pulse">
      <div className="compare-page-inner">
        <div className="mb-4 h-4 w-48 rounded bg-gray-200" />
        <div className="compare-hero mb-6 border-cb-orange-border pb-6">
          <div className="space-y-3">
            <div className="h-3 w-32 rounded bg-cb-orange-light" />
            <div className="h-8 w-72 max-w-full rounded bg-gray-200" />
            <div className="h-4 w-96 max-w-full rounded bg-gray-100" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="compare-card h-[420px] bg-gray-100" />
          <div className="compare-picker h-[420px] bg-cb-orange-light/50" />
        </div>
      </div>
    </main>
  )
}

export function CompareTablesSkeleton() {
  return (
    <div className="mb-8 space-y-6 animate-pulse" aria-hidden="true">
      <div className="compare-table-shell h-64 bg-gray-100" />
      <div className="compare-table-shell h-80 bg-gray-100" />
    </div>
  )
}
