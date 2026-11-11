// Placeholder animé pendant le chargement des annonces
export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-primary-100/70">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-50">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded-full bg-primary-50" />
        <div className="h-4 w-3/4 rounded-full bg-primary-100/70" />
        <div className="h-3 w-1/2 rounded-full bg-primary-50" />
        <div className="!mt-5 h-5 w-1/3 rounded-full bg-primary-100/70" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div
      className={
        'grid grid-cols-1 gap-6 sm:grid-cols-2 ' +
        (count === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
