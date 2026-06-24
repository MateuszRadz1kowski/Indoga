"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

const getHotTakes = (data, limit = 15) => {
	const lists = data?.data?.MediaListCollection?.lists;
	const scoreFormat = data?.data?.User?.mediaListOptions?.scoreFormat;
	if (!lists) return [];
	const entries = lists.map((list) => list.entries).flat();

	return entries
		.filter((e) => e.score > 0)
		.map((e) => {
			let userScore = e.score;
			let communityScore = e.media.meanScore;

			if (scoreFormat === "POINT_10" || scoreFormat === "POINT_10_DECIMAL") {
				communityScore = communityScore / 10;
			} else if (scoreFormat === "POINT_100") {
				communityScore = Math.round(communityScore);
			} else if (scoreFormat === "POINT_5") {
				communityScore = communityScore / 20;
			} else if (scoreFormat === "POINT_3") {
				communityScore = (communityScore / 100) * 3;
			} else {
				communityScore = communityScore / 10;
			}

			return {
				title: e.media.title?.english || e.media.title?.romaji,
				cover: e.media.coverImage?.large,
				userScore,
				communityScore,
				diff: userScore - communityScore,
				isPoint100: scoreFormat === "POINT_100",
			};
		})
		.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
		.slice(0, limit);
};

export default function HotTakes({ data }) {
	const takes = getHotTakes(data);
	if (!takes.length) return null;

	return (
		<Card className="border border-white/[0.05] bg-[#0a0f1d]/85 backdrop-blur-md shadow-xl flex flex-col h-full overflow-hidden">
			<CardHeader className="pb-4 pt-5 px-6 border-b border-white/[0.02] shrink-0">
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
						<Flame size={16} className="text-orange-500" />
						Hot Takes - Biggest rating Differences
					</CardTitle>
					<span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase hidden sm:inline-block">
						You Vs Community
					</span>
				</div>
			</CardHeader>

			<CardContent className="flex-1 p-0 flex flex-col min-h-0">
				<div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6">
					<div className="py-4 space-y-4">
						{takes.map((t, i) => (
							<div
								key={i}
								className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-white/[0.03] last:border-0 last:pb-0"
							>
								<div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-md border border-white/10 shadow-sm">
									<img
										src={t.cover}
										alt={t.title}
										className="h-full w-full object-cover"
									/>
								</div>

								<div className="flex-1 min-w-0">
									<h4 className="text-xs font-semibold text-slate-200 truncate mb-1">
										{t.title}
									</h4>
									<div className="text-[10px] text-slate-500 flex items-center gap-2">
										<span>
											You:{" "}
											<b
												className={
													t.diff > 0 ? "text-emerald-400" : "text-rose-400"
												}
											>
												{t.userScore}
											</b>
										</span>
										<span className="text-slate-700">•</span>
										<span>
											Community average:{" "}
											<b className="text-violet-400">
												{t.isPoint100
													? t.communityScore.toFixed(0)
													: t.communityScore.toFixed(1)}
											</b>
										</span>
									</div>
								</div>

								<Badge
									variant="outline"
									className={`font-black tracking-tighter shrink-0 border-0 ${
										t.diff > 0
											? "bg-emerald-500/10 text-emerald-400"
											: "bg-rose-500/10 text-rose-400"
									}`}
								>
									{t.diff > 0 ? "+" : ""}
									{t.isPoint100 ? t.diff.toFixed(0) : t.diff.toFixed(1)}
								</Badge>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
