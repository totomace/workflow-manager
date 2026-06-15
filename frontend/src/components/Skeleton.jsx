const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const TaskSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-gray-100">
    <div className="flex items-center gap-2 flex-1">
      <Skeleton className="w-4 h-4 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  </div>
);

export default Skeleton;