import React, { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import SkeletonLoader from "./SkeletonLoader";

/**
 * Lazy wrapper for route components with skeleton loading
 */
export function LazyRoute({
  children,
  skeleton = false,
}: {
  children: React.ReactNode;
  skeleton?: boolean;
}) {
  const fallback = skeleton ? (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <SkeletonLoader />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="large" />
    </div>
  );

  return <Suspense fallback={fallback}>{children}</Suspense>;
}

export default LazyRoute;
