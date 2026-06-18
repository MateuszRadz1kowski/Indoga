"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
			.filter(([_, value]) => value >= 0)
			.sort((a, b) => b[1] - a[1])
			.map(([genre, value]) => ({
				genre,
				value,
				fill: GENRE_COLOURS[Math.floor(Math.random() * GENRE_COLOURS.length)],
				percentage: (value * 100).toFixed(1),
			}));
	}, [interests]);

	if (!interests || topGenres.length == 0) {
		return (
			<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] mb-4">
				<CardHeader className="text-sm font-bold uppercase text-white tracking-wider">
					Genre Affinity Map
				</CardHeader>
				<CardContent>
					<SectionError
						errorCode="empty_list"
						message="Brak danych gatunków do wyświetlenia."
					/>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border border-white/[0.05] bg-[#0a0f1d]/85 backdrop-blur-md shadow-xl flex flex-col h-full overflow-hidden">
			<CardHeader className="pb-4 pt-5 px-6 border-b border-white/[0.02] shrink-0">
				<h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
					<BarChart3 size={16} className="text-violet-400" />
					Favorite Genres
				</h3>
			</CardHeader>

			<CardContent className="p-6 flex-1 flex flex-col min-h-0">
				<div className="flex-1 overflow-y-auto custom-scrollbar pr-4 min-h-0 w-full">
					<div className="space-y-4 pb-2">
						{topGenres.map((genre) => (
							<div key={genre.genre} className="group flex items-center gap-3">
								<span className="text-[12px] font-semibold text-slate-300 group-hover:text-white transition-colors w-[120px] truncate shrink-0">
									{genre.genre}
								</span>
								<div className="flex-1 h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.02] min-w-0">
									<div
										className="h-full rounded-full transition-all duration-1000 ease-out"
										style={{
											width: `${(genre.value / (topGenres[0]?.value || 1)) * 100}%`,
											background: `linear-gradient(90deg, ${genre.fill}44, ${genre.fill})`,
											boxShadow: `0 0 12px ${genre.fill}55`,
										}}
									/>
								</div>
								<span
									className="text-[11px] font-mono shrink-0 w-12 text-right font-bold"
									style={{ color: genre.fill }}
								>
									{genre.percentage}%
								</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
