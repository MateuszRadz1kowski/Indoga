"use client";

import { useEffect, useState } from "react";
import { HelpCircle, ChevronDown, LogOut, User, Settings } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useTooltipMode } from "@/components/tooltip/TooltipSystem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar({ activeTab, onTabChange, apiData }) {
  const router = useRouter();
  const [rendered, setRendered] = useState(false);
  const { tooltipsEnabled, setTooltipsEnabled } = useTooltipMode();

  useEffect(() => {
    setRendered(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("platform");
    window.location.href = "/";
  };

  if (!rendered) {
    return <header className="h-[56px] bg-[#04090f]/80" />;
  }

  return (
    <header className="flex-shrink-0 bg-[#04090f]/80 backdrop-blur-md border-b border-violet-950/40 z-50">
      <div className="flex items-center px-3 md:px-6 h-[56px] justify-between gap-1 sm:gap-4">
        
        <div
          className="flex items-center gap-1.5 sm:gap-2.5 group cursor-pointer shrink-0"
          onClick={() => onTabChange("discover")}
        >
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-violet-500/30 group-hover:border-violet-400/60 transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(139,92,246,0.4)] flex-shrink-0">
            <Image
              src="/indoga_image_logo.jpg"
              alt="Indoga logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="hidden min-[400px]:block text-[14px] sm:text-[16px] font-black text-white tracking-tight uppercase italic group-hover:text-violet-200 transition-colors">
            Indoga
          </span>
        </div>

        <nav className="flex h-[56px] flex-1 justify-center overflow-x-auto no-scrollbar">
          {['discover', 'stats', 'compare'].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-2.5 sm:px-4 h-full text-[11px] sm:text-[13px] font-medium transition-all relative capitalize whitespace-nowrap shrink-0
                ${activeTab == tab ? 'text-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {tab == 'discover' ? 'Discover' : tab == 'stats' ? 'My Stats' : 'Compare'}
              {activeTab == tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <button
            onClick={() => setTooltipsEnabled((value) => !value)}
            className={`hidden sm:flex items-center gap-2 h-8 px-3 rounded-md text-[11px] font-bold border transition-all duration-300
              ${tooltipsEnabled
                ? "bg-violet-500/10 border-violet-500/40 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                : "bg-transparent border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
          >
            <HelpCircle size={14} className={tooltipsEnabled ? "text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" : "opacity-70"} />
            {tooltipsEnabled ? "Tooltips: ON" : "Tooltips: OFF"}
          </button>
          
          <Separator orientation="vertical" className="hidden sm:block h-4 bg-white/10" />
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-1.5 sm:px-2 gap-1.5 sm:gap-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 focus-visible:ring-0"
                >
                  <div className="size-6 rounded-full overflow-hidden border border-white/10 flex-shrink-0 bg-violet-900/20">
                    <img
                      src={apiData[0]?.avatar_url || "/indoga_image_logo.jpg"}
                      alt="Profile"
                      className="w-full h-full object-cover shadow-inner"
                    />
                  </div>
                  <span className="text-[11px] font-medium hidden md:block">Profile</span>
                  <ChevronDown size={10} className="text-slate-600 hidden min-[350px]:block" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 bg-[#0d1829] border-white/10 text-slate-300">
                <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  className="text-xs cursor-pointer focus:bg-white/5 focus:text-white"
                  onClick={() => onTabChange("discover")}
                >
                  <Settings className="mr-2 size-3.5" /> Discovery Mode
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xs cursor-pointer focus:bg-white/5 focus:text-white"
                  onClick={() => onTabChange("stats")}
                >
                  <User className="mr-2 size-3.5" /> Profile Stats
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                
                <DropdownMenuItem
                  className="text-xs cursor-pointer focus:bg-violet-500/10 focus:text-violet-400 sm:hidden"
                  onClick={() => setTooltipsEnabled((value) => !value)}
                >
                  <HelpCircle className="mr-2 size-3.5" />
                  {tooltipsEnabled ? "Disable Tooltips" : "Enable Tooltips"}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 sm:hidden" />
                
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-xs focus:bg-red-500/10 focus:text-red-400 text-red-400/80 cursor-pointer"
                >
                  <LogOut className="mr-2 size-3.5" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}