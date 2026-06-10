import { SlidersHorizontal, LayoutGrid, Columns2, List, ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const SORT_OPTIONS = [
  { id: "match", label: "Match %" },
  { id: "score", label: "Score" },
  { id: "popularity", label: "Popularity" },
  { id: "year", label: "Year" },
];

const VIEW_OPTIONS = [
  { id: "grid", Icon: LayoutGrid, title: "Standard Grid" },
  { id: "wideGrid", Icon: Columns2, title: "Wide Grid" },
  { id: "list", Icon: List, title: "List View" },
];

export default function Toolbar({
  isFilterOpen, setIsFilterOpen,
  sortBy, setSortBy,
  sortDirection, setSortDirection,
  viewMode, setViewMode,
  count, isLoading
}) {
  return (
    <div className="shrink-0 flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-6 py-3 gap-3 bg-[#060d1b]/80 backdrop-blur-sm border-b border-white/4">
      
      <div className="flex flex-wrap items-center gap-2 lg:gap-4 w-full lg:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`h-8 px-3 text-[11px] gap-2 transition-all duration-300
            ${isFilterOpen
              ? 'bg-violet-500/10 border-violet-500/40 text-violet-300'
              : 'bg-transparent border-white/10 text-slate-400 '}`}
        >
          <SlidersHorizontal size={14} />
          {isFilterOpen ? "Hide Filters" : "Filters"}
        </Button>

        <Separator orientation="vertical" className="hidden lg:block h-4 bg-white/10" />

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 lg:pt-0 w-full lg:w-auto">
          <span className="text-[11px] text-slate-500 font-medium mr-1 uppercase tracking-wider shrink-0">Sort:</span>
          
          <div className="flex gap-1">
            {SORT_OPTIONS.map((option) => {
              const isActive = sortBy == option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    if (isActive) {
                      setSortDirection(prev => prev == "desc" ? "asc" : "desc");
                    } else {
                      setSortBy(option.id);
                      setSortDirection("desc"); 
                    }
                  }}
                  className={`flex items-center gap-1.5 h-7 px-3 text-[10px] font-medium rounded-full border transition-all shrink-0 ${
                    isActive 
                      ? "border-violet-500/50 bg-violet-500/10 text-violet-300" 
                      : "border-transparent text-slate-400 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {option.label}
                  {isActive && (
                    sortDirection == "desc" 
                      ? <ArrowDown size={12} className="opacity-70" /> 
                      : <ArrowUp size={12} className="opacity-70" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto border-t border-white/5 lg:border-none pt-2 lg:pt-0 mt-1 lg:mt-0">
        <Badge variant="outline" className="h-6 px-3 text-[10px] bg-white/5 border-white/10 text-slate-400 font-mono shrink-0">
          {isLoading ? "Loading..." : `${count} results`}
        </Badge>

        <Separator orientation="vertical" className="hidden lg:block h-4 bg-white/10" />

        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} className="gap-1 shrink-0">
          {VIEW_OPTIONS.map(({ id, Icon, title }) => (
            <ToggleGroupItem
              key={id}
              value={id}
              title={title}
              className="size-8 p-0 rounded-lg border border-transparent data-[state=on]:bg-violet-500/20 data-[state=on]:text-violet-400 text-slate-500 hover:text-slate-300"
            >
              <Icon size={16} />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}