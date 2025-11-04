import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingRecipes() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-3">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
