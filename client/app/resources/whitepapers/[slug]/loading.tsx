export default function WhitePaperSlugLoading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1140px] px-4 py-10 sm:px-5 lg:px-6">
        <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="aspect-[4/5] w-full max-w-[320px] rounded-md bg-gray-100" />
          <div className="space-y-4 pt-2">
            <div className="h-3 w-40 rounded bg-gray-100" />
            <div className="h-8 w-4/5 rounded bg-gray-100" />
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
            <div className="mt-6 h-10 w-40 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    </main>
  )
}
