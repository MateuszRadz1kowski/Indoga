"use client";
import { useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Calendar, CalendarDays, Star, Trophy } from "lucide-react";

const groupByDecade = (rawData) => {
	if (!rawData?.data?.MediaListCollection?.lists) return {};

	const completedListObj = rawData.data.MediaListCollection.lists.find(
		(list) => list.entries?.[0]?.status == "COMPLETED",
	);

	if (!completedListObj) return {};

	const completedList = completedListObj.entries;
	const grouped = {};

	completedList.forEach((entry) => {
		const year = entry.media.startDate.year;

		if (year) {
			const decade = Math.floor(year / 10) * 10;
			const decadeLabel = `${decade}s`;

			grouped[decadeLabel] = grouped[decadeLabel] || {};
			grouped[decadeLabel][year] = grouped[decadeLabel][year] || [];
			grouped[decadeLabel][year].push(entry);
		}
	});

	return Object.fromEntries(
		Object.entries(grouped)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([label, years]) => [
				label,
				Object.fromEntries(Object.entries(years).sort((a, b) => a[0] - b[0])),
			]),
	);
};

export default function TimelineDecades({ apiData }) {
	const groupedData = useMemo(() => groupByDecade(apiData), [apiData]);
	const decades = Object.keys(groupedData);

	return (
		<div className="space-y-16 pb-24 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
			<header className="relative px-4">
				<h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-800 tracking-tighter italic uppercase">
					Watched Timeline
				</h2>
				<div className="h-1 w-24 bg-violet-600 mt-2 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
				<p className="text-[10px] text-slate-500 mt-4 uppercase tracking-[0.3em] font-bold">
					Chronological Archive
				</p>
			</header>

			<div className="relative pl-12 border-l border-white/5 ml-8">
				{decades.map((decadeLabel) => (
					<section key={decadeLabel} className="relative mb-24">
						<div className="absolute -left-[61px] top-0 flex flex-col items-center">
							<div className="size-10 rounded-full bg-[#060d1b] border-2 border-violet-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform">
								<CalendarDays size={16} className="text-violet-400" />
							</div>
							<span className="mt-4 text-[10px] font-black text-violet-500/50 rotate-[-90deg] uppercase tracking-[0.2em] whitespace-nowrap">
								{decadeLabel}
							</span>
						</div>

						<div className="space-y-12">
							{Object.keys(groupedData[decadeLabel]).map((year) => (
								<div key={year} className="relative group">
									<div className="absolute -left-12 top-4 w-8 h-px bg-white/10 group-hover:w-10 group-hover:bg-fuchsia-500 transition-all duration-500" />

									<div className="flex items-center gap-4 mb-6">
										<h3 className="text-3xl font-black text-white italic tracking-tighter group-hover:text-fuchsia-400 transition-colors">
											{year}
										</h3>
										<div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
									</div>

									<ScrollArea className="w-full whitespace-nowrap pb-4">
										<div className="flex gap-6">
											{groupedData[decadeLabel][year].map((entry) => (
												<AnimeHistoryCard key={entry.media.id} entry={entry} />
											))}
										</div>
										<ScrollBar
											orientation="horizontal"
											className="h-1.5 bg-white/5"
										/>
									</ScrollArea>
								</div>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}

function AnimeHistoryCard({ entry }) {
	const { media, score } = entry;
	const imgUrl = media?.coverImage?.extraLarge || media?.coverImage?.large;
	const title =
		media?.title?.english || media?.title?.romaji || "Unknown Title";

	return (
		<Card
			className="relative flex-shrink-0 w-40 h-56 rounded-2xl overflow-hidden bg-[#0d1829] border-none group/card transition-all duration-500 hover:scale-105 hover:shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
			onClick={() =>
				window.open(`https://anilist.co/anime/${media.id}`, "_blank")
			}
		>
			<img
				src={imgUrl}
				alt={title}
				className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-[#060d1b] via-transparent to-transparent opacity-90 transition-opacity group-hover/card:opacity-100" />

			{score > 0 && (
				<div className="absolute top-3 right-3 z-20">
					<div className="bg-black/80 backdrop-blur-xl px-2 py-1 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-2xl">
						<Star size={10} className="text-amber-400 fill-amber-400" />
						<span className="text-[11px] font-black text-white tabular-nums">
							{score}
						</span>
					</div>
				</div>
			)}

			<div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
				<p className="text-[11px] font-black text-white leading-tight uppercase italic line-clamp-2 drop-shadow-md">
					{title}
				</p>
				<div className="h-0.5 w-0 group-hover/card:w-full bg-fuchsia-500 mt-2 transition-all duration-700 opacity-0 group-hover/card:opacity-100" />
			</div>
		</Card>
	);
}
