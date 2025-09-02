import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-lg" />
            ))}
          </div>
      </div>
    </main>
  );
}
