"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const TAG_COLOURS = [
	"#a855f7",
	"#8b5cf6",
	"#7c3aed",
	"#d946ef",
	"#c026d3",
	"#6366f1",
	"#4f46e5",
	"#06b6d4",
	"#0ea5e9",
	"#f43f5e",
];

export default function TagAffinityMap({ interests }) {
	const topTags = useMemo(() => {
		const tagsObj = interests?.[0] ?? {};

		return Object.entries(tagsObj)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 40)
			.map(([name, value]) => ({
				name,
				value,
				fill: TAG_COLOURS[Math.floor(Math.random() * TAG_COLOURS.length)],
				percentage: (value * 100).toFixed(1),
			}));
	}, [interests]);

	if (!interests || topTags.length == 0) {
		return (
			<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] mb-4">
				<CardHeader className="text-sm font-bold uppercase text-white tracking-wider">
					Favorite Tags
				</CardHeader>
				<CardContent>
					<SectionError
						errorCode="empty_list"
						message="No data available to display"
					/>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border border-white/[0.05] bg-[#0a0f1d]/85 backdrop-blur-md shadow-xl flex flex-col h-full overflow-hidden">
			<CardHeader className="pb-4 pt-5 px-6 border-b border-white/[0.02] shrink-0">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
						<Sparkles size={16} className="text-cyan-400" />
						Favorite Tags
					</h3>
				</div>
			</CardHeader>

			<CardContent className="p-6 flex-1 flex flex-col min-h-0">
				<div className="shrink-0 grid grid-cols-3 gap-2 sm:gap-3 mb-6">
					{topTags.slice(0, 3).map((tag, index) => (
						<div
							key={tag.name}
							className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border border-white/[0.03] text-center bg-white/[0.01]"
							style={{ borderColor: `${tag.fill}25` }}
						>
							<span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">
								Top #{index + 1}
							</span>
							<span
								className="text-[11px] sm:text-xs font-bold truncate px-1 max-w-full"
								style={{ color: tag.fill }}
							>
								{tag.name}
							</span>
							<span className="text-[11px] font-mono text-slate-400 mt-1 font-bold">
								{tag.percentage}%
							</span>
						</div>
					))}
				</div>

				<div className="flex-1 overflow-y-auto custom-scrollbar pr-4 min-h-0 w-full -mr-4">
					<div className="space-y-3 pb-2 pr-4">
						{topTags.slice(3).map((tag) => (
							<div key={tag.name} className="group flex items-center gap-3">
								<span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors w-[100px] sm:w-[120px] truncate shrink-0">
									{tag.name}
								</span>
								<div className="flex-1 min-w-0 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
									<div
										className="h-full rounded-full transition-all duration-1000 ease-out"
										style={{
											width: `${(tag.value / topTags[0].value) * 100}%`,
											background: `linear-gradient(90deg, ${tag.fill}66, ${tag.fill})`,
											boxShadow: `0 0 10px ${tag.fill}40`,
										}}
									/>
								</div>
								<span
									className="text-[10px] font-mono shrink-0 w-10 text-right font-bold"
									style={{ color: tag.fill }}
								>
									{tag.percentage}%
								</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
