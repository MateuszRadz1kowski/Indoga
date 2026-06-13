"use client";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CalendarDays, Star } from "lucide-react";
import { SectionError } from "@/components/ErrorBanner";

const groupByDecade = (rawData) => {
	if (!rawData?.data?.MediaListCollection?.lists) return {};

	const completedListObj = rawData.data.MediaListCollection.lists.find(
		(list) => list.entries?.[0]?.status == "COMPLETED",
	);

	if (!completedListObj) return {};

	const completedList = completedListObj.entries;
	const grouped = {};

	completedList.forEach((entry) => {
		if (!entry?.media?.startDate?.year) return;
		const year = entry.media.startDate.year;

		const decade = Math.floor(year / 10) * 10;
		const decadeLabel = `${decade}s`;

		grouped[decadeLabel] = grouped[decadeLabel] || {};
		grouped[decadeLabel][year] = grouped[decadeLabel][year] || [];
		grouped[decadeLabel][year].push(entry);
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
	const decadesData = useMemo(() => groupByDecade(apiData), [apiData]);

	if (!apiData || Object.keys(decadesData).length == 0) {
		return (
			<Card className="p-6 bg-[#0a0f1d]/85 border border-white/5 mb-4 h-full">
				<div className="flex items-center gap-2 mb-4">
					<Calendar size={14} className="text-violet-400" />
					<h3 className="text-sm font-bold text-white uppercase tracking-wider">
						Watched Timeline
					</h3>
				</div>
				<SectionError
					errorCode="empty_list"
					message="No completed anime found in your list to display the timeline."
				/>
			</Card>
		);
	}

	return (
		<Card className="border border-white/[0.05] bg-[#0a0f1d]/85 backdrop-blur-md shadow-xl flex flex-col h-full overflow-hidden">
			<div className="pb-4 pt-5 px-6 border-b border-white/[0.02] shrink-0">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
						<Calendar size={16} className="text-fuchsia-400" />
						Watched Timeline
					</h3>
				</div>
			</div>

			<CardContent className="flex-1 p-0 min-h-0 flex flex-col">
				<div className="flex-1 lg:overflow-y-auto custom-scrollbar w-full">
					<div className="px-6 md:px-10 pt-6 space-y-10 pb-12 max-w-full mx-auto animate-in fade-in duration-1000">
						<header className="relative">
							<h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-800 tracking-tighter italic uppercase">
								Your Watched Anime Through the Decades
							</h2>
							<div className="h-1 w-16 bg-violet-600 mt-2 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
						</header>

						<div className="relative pl-8 md:pl-12 border-l border-white/5 ml-2 md:ml-4">
							{Object.keys(decadesData).map((decadeLabel) => (
								<section key={decadeLabel} className="relative mb-12 last:mb-0">
									<div className="absolute -left-[41px] md:-left-[57px] top-0 flex flex-col items-center">
										<div className="size-8 md:size-9 rounded-full bg-[#060d1b] border-2 border-violet-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
											<CalendarDays size={14} className="text-violet-400" />
										</div>
										<span className="mt-2 text-[9px] font-black text-violet-500/50 rotate-[-90deg] uppercase tracking-[0.2em]">
											{decadeLabel}
										</span>
									</div>

									<div className="space-y-8">
										{Object.keys(decadesData[decadeLabel]).map((year) => (
											<div key={year} className="relative group">
												<div className="absolute -left-8 md:-left-12 top-4 w-6 md:w-8 h-px bg-white/10 group-hover:bg-fuchsia-500 transition-colors" />

												<div className="flex items-center gap-4 mb-4">
													<h3 className="text-xl md:text-2xl font-black text-white italic tracking-tighter group-hover:text-fuchsia-400 transition-colors">
														{year}
													</h3>
													<div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
												</div>

												<div className="w-full overflow-x-auto custom-scrollbar pb-3">
													<div className="flex gap-4 md:gap-5 w-max pr-6">
														{decadesData[decadeLabel][year].map((entry) => (
															<AnimeHistoryCard
																key={entry.media.id}
																entry={entry}
															/>
														))}
													</div>
												</div>
											</div>
										))}
									</div>
								</section>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function AnimeHistoryCard({ entry }) {
	const { media, score } = entry;
	const imgUrl = media?.coverImage?.extraLarge || media?.coverImage?.large;
	const title =
		media?.title?.english || media?.title?.romaji || "Unknown Title";

	return (
		<Card
			className="relative flex-shrink-0 w-32 md:w-36 h-48 md:h-52 rounded-2xl overflow-hidden bg-[#0d1829] border-none group/card transition-all duration-300 hover:scale-[1.02] cursor-pointer"
			onClick={() =>
				window.open(`https://anilist.co/anime/${media.id}`, "_blank")
			}
		>
			<img
				src={imgUrl}
				alt={title}
				className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-[#060d1b] via-transparent to-transparent opacity-90 transition-opacity group-hover/card:opacity-100" />
			{score > 0 && (
				<div className="absolute top-2 right-2 z-20">
					<div className="bg-black/80 backdrop-blur-xl px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-xl">
						<Star size={10} className="text-amber-400 fill-amber-400" />
						<span className="text-[10px] font-black text-white tabular-nums">
							{score}
						</span>
					</div>
				</div>
			)}
			<div className="absolute inset-x-0 bottom-0 p-3 translate-y-1 group-hover/card:translate-y-0 transition-transform duration-300">
				<p className="text-[10px] font-black text-white leading-tight uppercase italic line-clamp-2">
					{title}
				</p>
				<div className="h-0.5 w-0 group-hover/card:w-full bg-fuchsia-500 mt-1.5 transition-all duration-500 opacity-0 group-hover/card:opacity-100" />
			</div>
		</Card>
	);
}
