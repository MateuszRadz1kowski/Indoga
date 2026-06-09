"use client";

import { useEffect, useState } from "react";
import { HelpCircle, ChevronDown, LogOut, User, Settings } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
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
      <div className="flex items-center px-6 h-[56px] justify-between">
        <div className="flex items-center gap-8">

          <div
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={() => onTabChange("discover")}
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-violet-500/30 group-hover:border-violet-400/60 transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(139,92,246,0.4)] flex-shrink-0">
              <Image
                src="/indoga_image_logo.jpg"
                alt="Indoga logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-[16px] font-black text-white tracking-tight uppercase italic group-hover:text-violet-200 transition-colors">
              Indoga
            </span>
          </div>

          <nav className="flex h-[56px]">
            {['discover', 'stats', 'compare'].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-4 h-full text-[13px] font-medium transition-all relative capitalize
                  ${activeTab == tab ? 'text-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab == 'discover' ? 'Discover' : tab == 'stats' ? 'My Stats' : 'Compare'}
                {activeTab == tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-amber-400 gap-2">
            <HelpCircle size={14} />
            <span className="hidden sm:inline">Tooltips</span>
          </Button>
          <Separator orientation="vertical" className="h-4 bg-white/10" />
          <div className="flex items-center gap-2 pl-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 gap-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 focus-visible:ring-0"
                >
                  <div className="size-6 rounded-full overflow-hidden border border-white/10 flex-shrink-0 bg-violet-900/20">
                    <img
                      src={apiData[0]?.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover shadow-inner"
                    />
                  </div>
                  <span className="text-[11px] font-medium hidden md:block">Profile</span>
                  <ChevronDown size={10} className="text-slate-600" />
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