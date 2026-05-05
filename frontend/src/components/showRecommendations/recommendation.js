"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Play, ExternalLink, X, Info } from "lucide-react";

export default function Recommendation({ recommendationData: data }) {
	const [isMobileExpanded, setIsMobileExpanded] = useState(false);

	const malUrl = `https://myanimelist.net/anime/${data.id_mal}`;
	const animeAnilistUrl = `https://anilist.co/anime/${data.id}`;
	const mangaAnilistUrl = `https://anilist.co/manga/${data.id}`;
	return (
		<>
			<Card
				onClick={() => {
					if (window.innerWidth < 1024) setIsMobileExpanded(true);
				}}
				className={`group relative flex flex-col overflow-hidden transition-all duration-300 border-none
          ${
						isMobileExpanded
							? "fixed inset-2 z-50 bg-[#0f172a] overflow-y-auto p-4 ring-2 ring-purple-500 shadow-[0_0_40px_rgba(0,0,0,0.7)]"
							: "bg-[#1e293b]/50 hover:bg-[#1e293b] cursor-pointer lg:cursor-default shadow-lg"
					}`}
			>
				{isMobileExpanded && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							setIsMobileExpanded(false);
						}}
						className="absolute top-2 right-2 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full z-50 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				)}

				<div className="p-3 pb-0">
					<div className="flex justify-between items-start gap-1 mb-2">
						<h3 className="font-bold text-[11px] sm:text-[13px] lg:text-base text-slate-100 leading-tight line-clamp-2 tracking-wide uppercase">
							{data.title}
						</h3>
						<Badge className="bg-purple-600 hover:bg-purple-600 text-[10px] lg:text-xs text-white border-none shrink-0 shadow-sm shadow-purple-900/50">
							{(data.score * 100).toFixed(0)}%
						</Badge>
					</div>
				</div>

				<div className="p-3 pt-0 flex flex-col lg:flex-row gap-3">
					<div
						className={`relative shrink-0 rounded-md overflow-hidden shadow-2xl border border-slate-700/50
            ${isMobileExpanded ? "w-full h-64" : "w-full lg:w-44 lg:h-60 h-40"}`}
					>
						<img
							src={data.cover_image}
							alt={data.title}
							className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
						/>
						{data.trailer_id && (
							<div
								className="absolute inset-0 bg-purple-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
								onClick={(e) => {
									e.stopPropagation();
									window.open(
										`https://www.youtube.com/watch?v=${data.trailer_id}`,
										"_blank",
									);
								}}
							>
								<div className="bg-white/10 p-3 rounded-full border border-white/20">
									<Play className="w-8 h-8 text-white fill-white" />
								</div>
							</div>
						)}
					</div>

					<div
						className={`flex-1 flex flex-col gap-3 ${!isMobileExpanded ? "hidden lg:flex" : "flex"}`}
					>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1 text-amber-400 font-black text-sm bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
								<Star className="w-4 h-4 fill-amber-400" /> {data.mean_score}
							</div>
							<span className="text-[11px] text-slate-400 font-bold tracking-widest uppercase">
								{data.format} • {data.season_year}
							</span>
						</div>

						<div className="bg-[#0f172a]/80 p-3 rounded-lg border border-purple-500/20 shadow-inner">
							<p className="text-[10px] font-black text-purple-400 uppercase mb-2 flex items-center gap-1 tracking-tighter">
								<Info className="w-3 h-3" /> Recommended because you like:
							</p>
							<div className="flex flex-wrap gap-1.5">
								{Object.entries(data.why_recommended)
									.slice(0, 4)
									.map(([tag]) => (
										<span
											key={tag}
											className="text-[9px] font-bold bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 uppercase"
										>
											{tag}
										</span>
									))}
							</div>
						</div>

						<div className="text-[12px] text-slate-400 leading-relaxed line-clamp-5 overflow-y-auto">
							<div dangerouslySetInnerHTML={{ __html: data.description }} />
						</div>

						<div className="flex gap-4 mt-auto pt-3 border-t border-slate-700/50">
							<a
								href={
									["MANGA", "NOVEL", "ONE_SHOT"].includes(data.format)
										? mangaAnilistUrl
										: animeAnilistUrl
								}
								target="_blank"
								className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-blue-400 transition-all uppercase tracking-widest"
							>
								<ExternalLink className="w-3 h-3" /> Anilist
							</a>
							<a
								href={malUrl}
								target="_blank"
								className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-blue-500 transition-all uppercase tracking-widest"
							>
								<ExternalLink className="w-3 h-3" /> MAL
							</a>
						</div>
					</div>
				</div>
			</Card>

			{isMobileExpanded && (
				<div
					className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 lg:hidden"
					onClick={() => setIsMobileExpanded(false)}
				/>
			)}
		</>
	);
}
