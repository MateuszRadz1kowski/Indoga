import { SlidersHorizontal, LayoutGrid, Columns2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

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
  viewMode, setViewMode,
  count, isLoading
}) {
  return (
    <div className="shrink-0 flex items-center justify-between px-6 py-3 bg-[#060d1b]/80 backdrop-blur-sm border-b border-white/4">
      <div className="flex items-center gap-4">
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
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </Button>

        <Separator orientation="vertical" className="h-4 bg-white/10" />

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium mr-1 uppercase tracking-wider">Sort:</span>
          <ToggleGroup type="single" value={sortBy} onValueChange={(value) => value && setSortBy(value)} className="gap-1">
            {SORT_OPTIONS.map((option) => (
              <ToggleGroupItem
                key={option.id}
                value={option.id}
                className="h-7 px-3 text-[10px] rounded-full border border-transparent data-[state=on]:border-violet-500/50 data-[state=on]:bg-violet-500/10 data-[state=on]:text-violet-300"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="h-6 px-3 text-[10px] bg-white/5 border-white/10 text-slate-400 font-mono">
          {isLoading ? "Loading..." : `${count} results`}
        </Badge>

        <Separator orientation="vertical" className="h-4 bg-white/10" />

        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} className="gap-1">
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