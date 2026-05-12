"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const getHotTakes = (data, limit = 10) => {
	const lists = data?.data?.MediaListCollection?.lists;
	const entries = lists.map((list) => list.entries).flat();

	return entries
		.filter((e) => e.score > 0)
		.map((e) => {
			const userScore = e.score;
			const communityScore = e.media.meanScore / 10;
			return {
				title: e.media.title?.english,
				cover: e.media.coverImage?.large,
				userScore,
				communityScore,
				diff: userScore - communityScore,
			};
		})
		.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
		.slice(0, limit);
};

export default function HotTakes({ data }) {
	const takes = getHotTakes(data);
	if (!takes.length) return null;

	return (
		<Card className="border-violet-900/20 bg-[#0d111e]/80 backdrop-blur-md">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-bold tracking-widest text-[#7c6fa0] uppercase">
					Hot Takes - Score Difference
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[400px] pr-4">
					<div className="space-y-4">
						{takes.map((t, i) => (
							<div
								key={i}
								className="flex items-center gap-4 pb-3 border-b border-violet-900/10 last:border-0"
							>
								<div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-md border border-white/5">
									<img
										src={t.cover}
										alt={t.title}
										className="h-full w-full object-cover"
									/>
								</div>

								<div className="flex-1 min-w-0">
									<h4 className="text-sm font-semibold text-slate-200 truncate">
										{t.title}
									</h4>
									<div className="text-[11px] text-slate-500 flex items-center gap-2">
										<span>
											You:{" "}
											<b
												className={
													t.diff > 0 ? "text-green-400" : "text-red-400"
												}
											>
												{t.userScore}
											</b>
										</span>
										<span>•</span>
										<span>
											Community:{" "}
											<b className="text-violet-400">{t.communityScore}</b>
										</span>
									</div>
								</div>

								<Badge
									variant="outline"
									className={`font-black tracking-tighter ${
										t.diff > 0
											? "bg-green-500/10 text-green-400 border-green-500/20"
											: "bg-red-500/10 text-red-400 border-red-500/20"
									}`}
								>
									{t.diff > 0 ? "+" : ""}
									{t.diff.toFixed(1)}
								</Badge>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
