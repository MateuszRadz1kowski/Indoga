"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

const GENRE_COLOURS = [
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

export default function GenreAffinityMap({ interests }) {
	const topGenres = useMemo(() => {
		const genresObj = interests?.[1] ?? {};

		return Object.entries(genresObj)
			.sort((a, b) => b[1] - a[1])
			.map(([genre, value]) => ({
				genre,
				value,
				fill: GENRE_COLOURS[Math.floor(Math.random() * GENRE_COLOURS.length)],
				percentage: (value * 100).toFixed(1),
			}));
	}, [interests]);

	return (
		<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] text-slate-100 overflow-hidden shadow-xl backdrop-blur-md h-full">
			<CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.02]">
				<div className="flex items-center gap-2">
					<BarChart3 size={14} className="text-violet-400" />
					<h3 className="text-sm font-bold text-white uppercase tracking-wider">
						Favourite Genres
					</h3>
				</div>
			</CardHeader>

			<CardContent className="px-6 py-6 space-y-5">
				<div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
					{topGenres.map((genre) => (
						<div key={genre.genre} className="group flex items-center gap-3">
							<span className="text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors w-[130px] truncate shrink-0">
								{genre.genre}
							</span>
							<div className="flex-1 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
								<div
									className="h-full rounded-full transition-all duration-1000 ease-out"
									style={{
										width: `${(genre.value / topGenres[0].value) * 100}%`,
										background: `linear-gradient(90deg, ${genre.fill}88, ${genre.fill})`,
									}}
								/>
							</div>
							<span
								className="text-[10px] font-mono shrink-0 w-10 text-right"
								style={{ color: genre.fill }}
							>
								{genre.percentage}%
							</span>
						</div>
					))}
				</div>

				<div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.04]">
					{topGenres.slice(0, 8).map((genre) => (
						<div
							key={genre.genre}
							className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium bg-white/[0.01]"
							style={{
								borderColor: `${genre.fill}20`,
								color: genre.fill,
							}}
						>
							<span
								className="w-1.5 h-1.5 rounded-full"
								style={{ background: genre.fill }}
							/>
							{genre.genre}
							<span className="font-mono text-[10px] text-slate-500 font-bold ml-0.5">
								{genre.percentage}%
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
