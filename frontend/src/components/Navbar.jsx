import { Sparkles, HelpCircle, Sun, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <header className="flex-shrink-0 bg-[#04090f]/80 backdrop-blur-md border-b border-violet-950/40 z-50">
      <div className="flex items-center px-6 h-[56px] justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-1.5 rounded-lg bg-violet-600/20 group-hover:bg-violet-600/30 transition-colors">
              <Sparkles size={16} className="text-violet-400 group-hover:animate-pulse" />
            </div>
            <span className="text-[16px] font-black text-white tracking-tight uppercase italic">
              Anime recommender
            </span>
          </div>

          <nav className="flex h-[56px]">
            {['discover', 'stats'].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-4 h-full text-[13px] font-medium transition-all relative capitalize
                  ${activeTab == tab ? 'text-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab == 'discover' ? 'Discover' : 'My Stats'}
                {activeTab == tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-amber-400 gap-2">
            <HelpCircle size={14} /> <span className="hidden sm:inline">Tooltips</span>
          </Button>
          <Separator orientation="vertical" className="h-4 bg-white/10" />
          <div className="flex items-center gap-2 pl-2">
             <div className="size-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-[#04090f] flex items-center justify-center text-[10px] font-bold">R</div>
             </div>
             <ChevronDown size={12} className="text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}