export function SkeletonLine({ width = 'w-full', height = 'h-3' }) {
  return <div className={`skeleton ${width} ${height}`} />
}

export function LinkCardSkeleton() {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex justify-between">
        <SkeletonLine width="w-16" height="h-4" />
        <SkeletonLine width="w-20" height="h-4" />
      </div>
      <SkeletonLine width="w-3/4" height="h-4" />
      <div className="flex flex-col gap-1.5">
        <SkeletonLine height="h-3" />
        <SkeletonLine width="w-5/6" height="h-3" />
        <SkeletonLine width="w-4/6" height="h-3" />
      </div>
      <div className="flex gap-2">
        <SkeletonLine width="w-12" height="h-5" />
        <SkeletonLine width="w-12" height="h-5" />
        <SkeletonLine width="w-12" height="h-5" />
      </div>
    </div>
  )
}

export function FolderCardSkeleton() {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <SkeletonLine width="w-8" height="h-8" />
        <SkeletonLine width="w-28" height="h-4" />
      </div>
      <SkeletonLine height="h-2" />
      <SkeletonLine width="w-full" height="h-8" />
    </div>
  )
}
