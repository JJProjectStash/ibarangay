import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 bg-white/20" />
        <Skeleton className="h-4 w-1/2 bg-white/10 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full bg-white/20" />
        <Skeleton className="h-4 w-5/6 bg-white/20" />
        <Skeleton className="h-4 w-4/6 bg-white/20" />
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 w-24 bg-white/20" />
          <Skeleton className="h-10 w-24 bg-white/20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card
          key={i}
          className="bg-white/10 backdrop-blur-xl border-2 border-white/20"
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-white/20" />
                <Skeleton className="h-3 w-1/2 bg-white/10" />
              </div>
              <Skeleton className="h-8 w-20 bg-white/20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card
          key={i}
          className="bg-white/10 backdrop-blur-xl border-2 border-white/20"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 bg-white/20" />
              <Skeleton className="h-8 w-8 rounded-lg bg-white/20" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 bg-white/20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
