"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";

const TagRow = ({ tag, scoreA, scoreB }) => {
	const max = Math.max(scoreA, scoreB, 0.01);
	return (
		<div className="space-y-0.5">
			<div className="flex items-center justify-between">
				<span className="text-[11px] text-slate-300 font-medium truncate max-w-[120px]">
					{tag}
				</span>
				<span className="text-[10px] text-slate-500">
					{(scoreA * 100).toFixed(0)} vs {(scoreB * 100).toFixed(0)}
				</span>
			</div>
			<div className="flex gap-1 h-1.5">
				<div className="flex-1 bg-white/[0.04] rounded-full overflow-hidden flex justify-end">
					<div
						className="h-full rounded-full"
						style={{
							width: `${(scoreA / max) * 100}%`,
							background: "#8b5cf6",
							boxShadow: `0 0 6px #8b5cf666`,
						}}
					/>
				</div>
				<div className="flex-1 bg-white/[0.04] rounded-full overflow-hidden">
					<div
						className="h-full rounded-full"
						style={{
							width: `${(scoreB / max) * 100}%`,
							background: "#06b6d4",
							boxShadow: `0 0 6px #06b6d466`,
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default function VersusShared({
	sharedTags,
	uniqueA,
	uniqueB,
	nameA,
	nameB,
}) {
	return (
		<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] text-slate-100 overflow-hidden shadow-xl backdrop-blur-md h-full">
			<CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.02]">
				<div className="flex items-center gap-2">
					<Heart size={14} className="text-violet-400" />
					<h3 className="text-sm font-bold text-white uppercase tracking-wider">
						Shared & Unique tags between {nameA} and {nameB}
					</h3>
				</div>
			</CardHeader>
			<CardContent className="px-6 py-4 space-y-4">
				<ScrollArea className="h-[180px] pr-2">
					<div className="space-y-3">
						{sharedTags.map((tag) => (
							<TagRow
								key={tag.name}
								tag={tag.name}
								scoreA={tag.scoreA}
								scoreB={tag.scoreB}
							/>
						))}
						{sharedTags.length == 0 && (
							<p className="text-xs text-slate-600 italic text-center py-4">
								No overlapping tags found.
							</p>
						)}
					</div>
				</ScrollArea>

				<Separator className="bg-white/[0.04]" />

				<div className="grid grid-cols-2 gap-4">
					<div>
						<p
							className="text-[10px] font-semibold mb-1.5 truncate"
							style={{ color: C_A }}
						>
							Only {nameA}
						</p>
						<div className="space-y-1">
							{uniqueA.map((tag) => (
								<div
									key={tag.name}
									className="flex items-center justify-between text-[11px]"
								>
									<span className="text-slate-400 truncate max-w-[80px]">
										{tag.name}
									</span>
									<span
										className="font-mono text-[10px]"
										style={{ color: C_A }}
									>
										{(tag.score * 100).toFixed(0)}%
									</span>
								</div>
							))}
						</div>
					</div>
					<div>
						<p
							className="text-[10px] font-semibold mb-1.5 truncate"
							style={{ color: C_B }}
						>
							Only {nameB}
						</p>
						<div className="space-y-1">
							{uniqueB.map((tag) => (
								<div
									key={tag.name}
									className="flex items-center justify-between text-[11px]"
								>
									<span className="text-slate-400 truncate max-w-[80px]">
										{tag.name}
									</span>
									<span
										className="font-mono text-[10px]"
										style={{ color: C_B }}
									>
										{(tag.score * 100).toFixed(0)}%
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
