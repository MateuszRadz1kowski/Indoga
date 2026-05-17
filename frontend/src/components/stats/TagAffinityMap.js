"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
			.slice(0, 20)
			.map(([name, value]) => ({
				name,
				value,
				fill: TAG_COLOURS[Math.floor(Math.random() * TAG_COLOURS.length)],
				percentage: (value * 100).toFixed(1),
			}));
	}, [interests]);

	return (
		<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] text-slate-100 overflow-hidden shadow-xl backdrop-blur-md h-full">
			<CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.02]">
				<div className="flex items-center gap-2">
					<Sparkles size={14} className="text-violet-400" />
					<h3 className="text-sm font-bold text-white uppercase tracking-wider">
						Favourite Tags
					</h3>
				</div>
			</CardHeader>

			<CardContent className="px-6 py-6 space-y-5">
				<div className="grid grid-cols-3 gap-2">
					{topTags.slice(0, 3).map((tag, index) => (
						<div
							key={tag.name}
							className="flex flex-col p-2.5 rounded-xl border text-center bg-white/[0.01]"
							style={{ borderColor: `${tag.fill}25` }}
						>
							<span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">
								Tag #{index + 1}
							</span>
							<span
								className="text-xs font-bold truncate px-1"
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

				<div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
					{topTags.map((tag) => (
						<div key={tag.name} className="group flex items-center gap-3">
							<span className="text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors w-[130px] truncate shrink-0">
								{tag.name}
							</span>
							<div className="flex-1 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
								<div
									className="h-full rounded-full transition-all duration-1000 ease-out"
									style={{
										width: `${(tag.value / topTags[0].value) * 100}%`,
										background: `linear-gradient(90deg, ${tag.fill}88, ${tag.fill})`,
									}}
								/>
							</div>
							<span
								className="text-[10px] font-mono shrink-0 w-10 text-right"
								style={{ color: tag.fill }}
							>
								{tag.percentage}%
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
