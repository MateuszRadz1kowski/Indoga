import { Github, Coffee, Mail, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  return (
    <footer className="shrink-0 bg-[#04090f] border-t border-white/6 z-30">
      <div className="flex items-center justify-center lg:justify-start px-4 py-2 min-h-[36px] h-auto gap-x-2 gap-y-1 flex-wrap">
        <span className="text-[10px] text-slate-600 mr-1">Indoga — open source</span>

        <Separator orientation="vertical" className="hidden sm:block h-3 bg-white/10" />

        <Button variant="link" size="sm" asChild
          className="h-auto p-0 px-2 text-[10px] text-slate-500 hover:text-violet-400 gap-1">
          <a href="https://github.com/MateuszRadz1kowski/Indoga"
            target="_blank" rel="noopener noreferrer">
            <Github size={11} />
            GitHub
            <Badge variant="outline"
              className="text-[8px] px-1 py-0 h-4 text-amber-500/80 border-amber-500/25
                           bg-transparent ml-0.5 gap-0.5">
              <Star size={7} />Star
            </Badge>
          </a>
        </Button>

        <Separator orientation="vertical" className="hidden sm:block h-3 bg-white/10" />

        <Button variant="link" size="sm" asChild
          className="h-auto p-0 px-2 text-[10px] text-slate-500 hover:text-amber-400 gap-1">
          <a href="https://ko-fi.com/indoga" target="_blank" rel="noopener noreferrer">
            <Coffee size={11} />Buy me a coffee
          </a>
        </Button>

        <Separator orientation="vertical" className="hidden sm:block h-3 bg-white/10" />

        <Button variant="link" size="sm" asChild className="h-auto p-0 px-2 text-[10px] text-slate-500 hover:text-violet-400 gap-1">
        <a href="mailto:radzikowski.mateusz@gmail.com" target="_blank" rel="noopener noreferrer">
          <Mail size={11} /> Contact
        </a>
      </Button>
      </div>
    </footer>
  );
}