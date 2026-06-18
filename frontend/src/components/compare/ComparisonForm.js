"use client";

import { Input } from "@/components/ui/input";
import { Button as UIButton } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ComparisonForm({
	comparisonUsername,
	setComparisonUsername,
	comparisonPlatform,
	setComparisonPlatform,
	onFetch,
	isLoading,
}) {
	return (
		<Card className="bg-[#0a0f1d]/80 border border-white/[0.06] text-slate-100 shadow-xl backdrop-blur-md overflow-hidden">
			<CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
				<div className="flex items-center gap-3 w-full sm:w-auto shrink-0 pr-4 sm:border-r border-white/10">
					<div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
						<Users size={18} className="text-violet-400" />
					</div>
					<div className="text-left">
						<h3 className="text-sm font-bold text-white tracking-tight leading-tight">
							Comparison Mode
						</h3>
						<p className="text-[10px] text-slate-500 uppercase tracking-widest">
							Compare your taste with any user
						</p>
					</div>
				</div>

				<div className="flex flex-1 gap-2 w-full">
					<Select
						value={comparisonPlatform}
						onValueChange={setComparisonPlatform}
					>
						<SelectTrigger className="w-[100px] h-10 text-xs bg-white/[0.03] border-white/[0.08] text-slate-300">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-[#0d1829] border-white/10 text-slate-300 text-xs">
							<SelectItem value="AniList">AniList</SelectItem>
							<SelectItem value="MyAnimeList">MyAnimeList</SelectItem>
						</SelectContent>
					</Select>

					<Input
						placeholder="Enter username..."
						value={comparisonUsername}
						onChange={(e) => setComparisonUsername(e.target.value)}
						onKeyDown={(e) => e.key == "Enter" && onFetch()}
						className="flex-1 min-w-0 h-10 text-sm bg-white/[0.03] border-white/[0.08] text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50"
					/>

					<UIButton
						onClick={onFetch}
						disabled={!comparisonUsername.trim() || isLoading}
						className="h-10 px-5 text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
					>
						Compare
					</UIButton>
				</div>
			</CardContent>
		</Card>
	);
}
