import GlassCard from "@/components/ui/GlassCard";

export function RecipeCardSkeleton() {
  return (
    <GlassCard className="overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-48 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-5/6" />
        </div>
        
        {/* Badges */}
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
          <div className="h-5 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between pt-2">
          <div className="flex gap-3">
            <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-4 w-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse flex-shrink-0" />
      
      {/* Message */}
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse" />
        <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function ScannerSkeleton() {
  return (
    <GlassCard className="p-8 text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Icon Skeleton */}
        <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse mx-auto" />
        
        {/* Title */}
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-48 mx-auto" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-3/4 mx-auto" />
        </div>
        
        {/* Camera Preview */}
        <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
        
        {/* Button */}
        <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
      </div>
    </GlassCard>
  );
}

export function ChartSkeleton({ height = "300px" }: { height?: string }) {
  return (
    <div className="w-full" style={{ height }}>
      <div className="h-full bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse flex items-end justify-around p-4 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-neutral-300 dark:bg-neutral-700 rounded-t w-full animate-pulse"
            style={{
              height: `${Math.random() * 60 + 40}%`,
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        {/* Title */}
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-48" />
        
        {/* Input Field 1 */}
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-24" />
          <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        </div>
        
        {/* Input Field 2 */}
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-32" />
          <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        </div>
        
        {/* Textarea */}
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-28" />
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        </div>
        
        {/* Button */}
        <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
      </div>
    </GlassCard>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <div className="bg-neutral-100 dark:bg-neutral-900 p-4 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse flex-1"
          />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="p-4 flex gap-4 border-t border-neutral-200 dark:border-neutral-800"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse flex-1"
              style={{ animationDelay: `${(rowIdx * columns + colIdx) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Grid of Recipe Card Skeletons
 */
export function RecipeGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Chat Messages Loading State
 */
export function ChatLoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ChatMessageSkeleton key={i} />
      ))}
    </div>
  );
}
