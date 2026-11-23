export function PageSkeleton() {
  return (
    <div role="status" aria-label="Memuat halaman" className="flex flex-col gap-10">
      <div className="space-y-3">
        <div className="h-12 w-2/3 max-w-md animate-pulse rounded-2xl bg-surface" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded-full bg-surface" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-40 animate-pulse rounded-[1.5rem] bg-surface" />
        <div className="h-40 animate-pulse rounded-[1.5rem] bg-surface" />
        <div className="h-40 animate-pulse rounded-[1.5rem] bg-surface" />
      </div>
      <div className="h-72 animate-pulse rounded-[1.5rem] bg-surface" />
    </div>
  )
}
