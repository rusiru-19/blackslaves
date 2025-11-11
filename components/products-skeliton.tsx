"use client";

export default function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse flex flex-col gap-4 rounded-lg overflow-hidden bg-card/30 border border-border/40"
        >
          <div className="bg-gray-700 h-48 w-full rounded-t-lg"></div>

          <div className="p-4 flex flex-col gap-2">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
            <div className="h-4 bg-gray-600 rounded w-full"></div>
            <div className="h-10 bg-gray-600 rounded w-full mt-2"></div>
          </div>
        </div>
      ))}
    </>
  );
}
