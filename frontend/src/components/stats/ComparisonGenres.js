"use client";

import { useMemo } from "react";
import {
	RadarChart,
	Radar,
	PolarGrid,
	PolarAngleAxis,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp } from "lucide-react";

export default function ComparisonGenres({ radarData, nameA, nameB }) {
	const maxVal = useMemo(() => {
		if (!radarData || radarData.length === 0) return 100;
		return Math.max(
			...radarData.flatMap((genre) => [genre.userA ?? 0, genre.userB ?? 0]),
			1,
		);
	}, [radarData]);

	return (
		<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] text-slate-100 overflow-hidden shadow-xl backdrop-blur-md h-full">
			<CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.02]">
				<div className="flex items-center gap-2">
					<TrendingUp size={14} className="text-violet-400" />
					<h3 className="text-sm font-bold text-white uppercase tracking-wider">
						Genre comparison
					</h3>
				</div>
			</CardHeader>

			<CardContent className="px-6 py-4 space-y-4">
				<div className="w-full flex justify-center py-1 bg-white/[0.01] rounded-xl border border-white/[0.02]">
					<ResponsiveContainer width="100%" height={170}>
						<RadarChart
							data={radarData}
							margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
						>
							<PolarGrid stroke="#1e293b" />
							<PolarAngleAxis
								dataKey="genre"
								tick={{ fill: "#64748b", fontSize: 9, fontWeight: 500 }}
							/>
							<Radar
								name={nameA}
								dataKey="userA"
								stroke={"#8b5cf6"}
								fill={"#8b5cf6"}
								fillOpacity={0.12}
								strokeWidth={2}
							/>
							<Radar
								name={nameB}
								dataKey="userB"
								stroke={"#06b6d4"}
								fill={"#06b6d4"}
								fillOpacity={0.12}
								strokeWidth={2}
							/>
							<Tooltip
								content={({ active, payload }) => {
									if (!active || !payload?.length) return null;
									return (
										<div className="bg-[#0d1829]/95 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs shadow-2xl backdrop-blur-md">
											<p className="text-slate-200 font-bold mb-1 border-b border-white/5 pb-0.5">
												{payload[0]?.payload?.genre}
											</p>
											{payload.map((p) => (
												<p
													key={p.name}
													className="font-mono"
													style={{ color: p.stroke }}
												>
													{p.name}: {p.value?.toFixed(0)}%
												</p>
											))}
										</div>
									);
								}}
							/>
						</RadarChart>
					</ResponsiveContainer>
				</div>

				<div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-slate-500 font-bold px-1 pt-1">
					<span style={{ color: "#8b5cf6" }}>{nameA}</span>
					<span className="text-slate-600">vs</span>
					<span className="text-right" style={{ color: "#06b6d4" }}>
						{nameB}
					</span>
				</div>

				<ScrollArea className="h-[180px] pr-2 custom-scrollbar">
					<div className="space-y-3.5 py-1">
						{radarData &&
							radarData.map((genre) => {
								const scoreA = genre.userA ?? 0;
								const scoreB = genre.userB ?? 0;

								return (
									<div key={genre.genre} className="space-y-1">
										<div className="flex items-center justify-between text-[11px]">
											<span
												className="font-mono text-[10px]"
												style={{
													color:
														scoreA > scoreB ? "#8b5cf6" : "rgb(148, 163, 184)",
												}}
											>
												{scoreA.toFixed(0)}%
											</span>
											<span className="text-slate-200 font-semibold tracking-wide text-center truncate max-w-[140px]">
												{genre.genre}
											</span>
											<span
												className="font-mono text-[10px] text-right"
												style={{
													color:
														scoreB > scoreA ? "#06b6d4" : "rgb(148, 163, 184)",
												}}
											>
												{scoreB.toFixed(0)}%
											</span>
										</div>

										<div className="flex gap-1 h-2 items-center">
											<div className="flex-1 bg-white/[0.03] rounded-l-full h-1.5 overflow-hidden flex justify-end">
												<div
													className="h-full rounded-l-full transition-all duration-500"
													style={{
														width: `${(scoreA / maxVal) * 100}%`,
														background: "#8b5cf6",
														boxShadow: `0 0 8px ${"#8b5cf6"}66`,
													}}
												/>
											</div>

											<div className="w-px h-3 bg-white/20 shrink-0" />

											<div className="flex-1 bg-white/[0.03] rounded-r-full h-1.5 overflow-hidden flex justify-start">
												<div
													className="h-full rounded-r-full transition-all duration-500"
													style={{
														width: `${(scoreB / maxVal) * 100}%`,
														background: "#06b6d4",
														boxShadow: `0 0 8px ${"#06b6d4"}66`,
													}}
												/>
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
