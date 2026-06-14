"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";

const TagRow = ({ tag, scoreA, scoreB }) => {
	const max = Math.max(scoreA, scoreB, 0.01);
	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between">
				<span className="text-[11px] text-slate-300 font-medium truncate pr-2 flex-1">
					{tag}
				</span>
				<span className="text-[10px] text-slate-500 font-mono tracking-wider shrink-0">
					{(scoreA * 100).toFixed(0)}% vs {(scoreB * 100).toFixed(0)}%
				</span>
			</div>
			<div className="flex gap-1 h-1.5">
				<div className="flex-1 bg-white/[0.04] rounded-full overflow-hidden flex justify-end min-w-0">
					<div
						className="h-full rounded-full"
						style={{
							width: `${(scoreA / max) * 100}%`,
							background: "#8b5cf6",
						}}
					/>
				</div>
				<div className="flex-1 bg-white/[0.04] rounded-full overflow-hidden min-w-0">
					<div
						className="h-full rounded-full"
						style={{
							width: `${(scoreB / max) * 100}%`,
							background: "#06b6d4",
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default function ComparisonShared({
	sharedTags,
	uniqueA,
	uniqueB,
	nameA,
	nameB,
}) {
	return (
		<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] text-slate-100 overflow-hidden shadow-xl backdrop-blur-md h-full flex flex-col">
			<CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.02] shrink-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Heart size={14} className="text-violet-400" />
						<h3 className="text-sm font-bold text-white uppercase tracking-wider">
							Shared & Unique tags between {nameA} and {nameB}
						</h3>
					</div>
				</div>
			</CardHeader>

			<CardContent className="px-6 py-5 flex-1 flex flex-col min-h-0 space-y-5">
				<div className="flex-1 overflow-y-auto custom-scrollbar pr-4 min-h-0">
					<div className="space-y-4 pb-2">
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
				</div>

				<Separator className="bg-white/[0.04] shrink-0" />

				<div className="shrink-0 grid grid-cols-2 gap-6">
					<div>
						<p
							className="text-[10px] font-black mb-3 truncate uppercase tracking-widest border-l-2 pl-2"
							style={{ color: "#8b5cf6", borderColor: "#8b5cf6" }}
						>
							Only {nameA}
						</p>
						<div className="space-y-2">
							{uniqueA.map((tag) => (
								<div
									key={tag.name}
									className="flex items-center justify-between text-[11px]"
								>
									<span className="text-slate-400 truncate pr-2 flex-1">
										{tag.name}
									</span>
									<span
										className="font-mono text-[10px] shrink-0 font-bold"
										style={{ color: "#8b5cf6" }}
									>
										{(tag.score * 100).toFixed(0)}%
									</span>
								</div>
							))}
						</div>
					</div>
					<div>
						<p
							className="text-[10px] font-black mb-3 truncate uppercase tracking-widest border-r-2 pr-2 text-right"
							style={{ color: "#06b6d4", borderColor: "#06b6d4" }}
						>
							Only {nameB}
						</p>
						<div className="space-y-2">
							{uniqueB.map((tag) => (
								<div
									key={tag.name}
									className="flex items-center justify-between text-[11px]"
								>
									<span className="text-slate-400 truncate pr-2 flex-1">
										{tag.name}
									</span>
									<span
										className="font-mono text-[10px] shrink-0 font-bold"
										style={{ color: "#06b6d4" }}
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
