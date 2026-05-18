"use client";

import { Button } from "@/components/ui/card"; // lub z ui/button, zależy od struktury
import { Input } from "@/components/ui/input";
import { Button as UIButton } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function VersusSearch({
	comparisonUsername,
	setComparisonUsername,
	comparisonPlatform,
	setComparisonPlatform,
	onFetch,
	isLoading,
}) {
	return (
		<Card className="bg-[#0a0f1d]/80 border border-white/[0.06] text-slate-100">
			<CardHeader className="px-6 pt-5 pb-4">
				<div className="flex items-center gap-2.5">
					<div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
						<Users size={15} className="text-violet-400" />
					</div>
					<div>
						<h3 className="text-sm font-bold text-white tracking-tight">
							Versus Mode
						</h3>
						<p className="text-[11px] text-slate-500">
							Compare your taste with any user
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-6 pb-6 flex gap-2">
				<Select
					value={comparisonPlatform}
					onValueChange={setComparisonPlatform}
				>
					<SelectTrigger className="w-[110px] h-9 text-xs bg-white/[0.03] border-white/[0.08] text-slate-300">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="bg-[#0d1829] border-white/10 text-slate-300 text-xs">
						<SelectItem value="AniList">AniList</SelectItem>
						<SelectItem value="MyAnimeList">MAL</SelectItem>
					</SelectContent>
				</Select>

				<Input
					placeholder="Enter username..."
					value={comparisonUsername}
					onChange={(e) => setComparisonUsername(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && onFetch()}
					className="flex-1 h-9 text-xs bg-white/[0.03] border-white/[0.08] text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50"
				/>

				<UIButton
					onClick={onFetch}
					disabled={!comparisonUsername.trim() || isLoading}
					className="h-9 px-4 text-xs bg-violet-600 hover:bg-violet-500 text-white gap-2 shrink-0"
				>
					Compare
				</UIButton>
			</CardContent>
		</Card>
	);
}
