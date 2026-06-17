"use client";

import { useState, useEffect } from "react";
import FilterPage from "@/components/filters/filterPage";
import Recommendation from "@/components/showRecommendations/recommendation";
import { ScrollArea } from "@/components/ui/scroll-area";
import Toolbar from "./Toolbar";
import RecommendationSkeleton from "./showRecommendations/recommendationSkeleton";
import { RecommendationsError } from "@/components/ErrorBanner";

export default function DiscoverTab({
  apiData, setApiData, isLoading, setIsLoading,
  sortBy, setSortBy, viewMode, setViewMode, filters, setFilters, sortDirection, setSortDirection
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsFilterOpen(true);
    }
  }, []);

 const gridClass = {
    grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4",
    wideGrid: "flex flex-col sm:grid sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-4",
    list: "flex flex-col gap-2 sm:gap-4",
  }[viewMode];

  const handleRetry = () => {
    setFetchError(null);
    setApiData([]);
    window.location.href = "/"
  };

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      {isFilterOpen && (
        <div 
          className="absolute inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-[2px]"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <aside className={`transition-all duration-300 border-r border-violet-950/40 bg-[#04090f]
        absolute lg:relative z-40 h-full shrink-0
        ${isFilterOpen ? "w-[280px] lg:w-72 translate-x-0 opacity-100" : "w-[280px] lg:w-0 -translate-x-full lg:translate-x-0 opacity-0 lg:opacity-0 overflow-hidden"}`}>
        <div className="w-[280px] lg:w-72 h-full flex flex-col">
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

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Toolbar
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          viewMode={viewMode}
          setViewMode={setViewMode}
          count={apiData.length}
          isLoading={isLoading}
        />

        <ScrollArea className="flex-1 h-full pb-6">
        {isLoading ? (
              <div className={`${gridClass} p-2 sm:p-4 animate-in fade-in duration-500`}>
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