"use client";

import GenreAffinityMap from "./GenreAffinityMap";
import HotTakes from "./HotTakes";
import TagAffinityMap from "./TagAffinityMap";
import TimelineDecades from "./TimelineDecades";
import { RecommendationsError } from "@/components/ErrorBanner";
import { Activity } from "lucide-react";
import { InfoTooltip } from "@/components/tooltip/TooltipSystem";
import { TOOLTIPS } from "@/components/tooltip/TooltipData";

export default function StatsTab({
	data,
	dataUserInterests,
	isLoading,
	error,
	onRetry,
}) {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full text-slate-500 text-xs animate-pulse uppercase tracking-widest bg-[#060d1b]">
				Loading stats
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6 bg-[#060d1b] h-full flex items-center justify-center">
				<RecommendationsError
					errorCode={error.code}
					message={error.message}
					onRetry={onRetry}
				/>
			</div>
		);
	}

	return (
		<div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto bg-[#060d1b] custom-scrollbar">
			<div className="max-w-[1600px] w-full mx-auto space-y-6 pb-12">
				<div className="flex items-center gap-3 mb-6">
					<div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
						<Activity size={20} className="text-violet-400" />
					</div>
					<div>
						<h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
							Your Taste Analytics
						</h2>
						<p className="text-[13px] text-slate-400">
							Deep dive into your viewing habits and preferences.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="order-1 lg:order-none lg:col-span-2 lg:row-start-1 lg:col-start-1 h-[450px]">
						<SectionWrapper
							tooltipKey="favourite_genres"
							label="Favourite Genres"
						>
							<GenreAffinityMap interests={dataUserInterests} />
						</SectionWrapper>
					</div>

					<div className="order-2 lg:order-none lg:col-span-1 lg:row-start-2 lg:col-start-1 h-[450px] lg:h-[550px]">
						<SectionWrapper tooltipKey="favourite_tags" label="Favourite Tags">
							<TagAffinityMap interests={dataUserInterests} />
						</SectionWrapper>
					</div>

					<div className="order-3 lg:order-none lg:col-span-1 lg:row-start-1 lg:col-start-3 h-[450px]">
						<SectionWrapper tooltipKey="hot_takes" label="Hot Takes">
							<HotTakes data={data} />
						</SectionWrapper>
					</div>

					<div className="order-4 lg:order-none lg:col-span-2 lg:row-start-2 lg:col-start-2 h-auto lg:h-[550px]">
						<SectionWrapper
							tooltipKey="watched_timeline"
							label="Watched Timeline"
						>
							<TimelineDecades apiData={data} />
						</SectionWrapper>
					</div>
				</div>
			</div>
		</div>
	);
}

function SectionWrapper({ tooltipKey, label, children }) {
	return (
		<div className="relative h-full">
			{children}
			<div className="absolute top-4 right-12 z-10">
				<InfoTooltip tooltip={TOOLTIPS.stats[tooltipKey]} position="left" />
			</div>
		</div>
	);
}
