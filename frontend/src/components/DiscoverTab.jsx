"use client";

import { useState } from "react";
import FilterPage from "@/components/filters/filterPage";
import Recommendation from "@/components/showRecommendations/recommendation";
import { ScrollArea } from "@/components/ui/scroll-area";
import Toolbar from "./Toolbar";
import RecommendationSkeleton from "./showRecommendations/recommendationSkeleton";
import { RecommendationsError } from "@/components/ErrorBanner";
import { useRouter } from "next/navigation";

export default function DiscoverTab({
  apiData, setApiData, isLoading, setIsLoading,
  sortBy, setSortBy, viewMode, setViewMode, filters, setFilters
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const router = useRouter();

  const gridClass = {
    grid:"grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
    wideGrid: "grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4",
    list:"flex flex-col gap-4",
  }[viewMode];

  const handleRetry = () => {
    setFetchError(null);
    setApiData([]);
    router.push("/dashboard");
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <aside className={`transition-all duration-300 border-r border-violet-950/40 bg-[#04090f]
        ${isFilterOpen ? "w-72 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>
        <div className="w-72 h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 shrink-0">
            <span className="text-[11px] font-semibold text-violet-300 uppercase tracking-widest">
              Filters
            </span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              <FilterPage
                apiData={apiData}
                onDataUpdate={setApiData}
                onLoadingChange={setIsLoading}
                onError={setFetchError}
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          </ScrollArea>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 mb-16">
        <Toolbar
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          count={apiData.length}
          isLoading={isLoading}
        />

        <ScrollArea className="flex-1 h-full">
        {isLoading ? (
          <div className={`${gridClass} px-4 py-4 animate-in fade-in duration-500`}>
            {[...Array(12)].map((_, i) => (
              <RecommendationSkeleton viewMode={viewMode} key={i} />
            ))}
          </div>
        ) : fetchError ? (
          <RecommendationsError
            errorCode={fetchError.code}
            message={fetchError.message}
            onRetry={handleRetry}
          />
        ) : apiData.length == 0 ? (
          <RecommendationsError
            errorCode={"no_recommendations"}
            onRetry={handleRetry}
          />
        ) : (
          <div className={`${gridClass} px-4 py-4 animate-in fade-in duration-500`}>
            {apiData.map((item, index) => (
              <Recommendation
                key={item.id || index}
                recommendationData={item}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </ScrollArea>
      </div>
    </div>
  );
}