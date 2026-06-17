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
import { TrendingUp } from "lucide-react";

export default function ComparisonGenres({ radarData, nameA, nameB }) {
	const maxVal = useMemo(() => {
		if (!radarData || radarData.length == 0) return 100;
		return Math.max(
			...radarData.flatMap((genre) => [genre.userA ?? 0, genre.userB ?? 0]),
			1,
		);
	}, [radarData]);

	return (
		<Card className="bg-[#0a0f1d]/85 border border-white/5 text-slate-100 overflow-hidden shadow-xl backdrop-blur-md flex flex-col">
			<CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.02] shrink-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<TrendingUp size={16} className="text-violet-400" />
						<h3 className="text-sm font-bold text-white uppercase tracking-wider">
							Genre comparison
						</h3>
					</div>
				</div>
			</CardHeader>

			<CardContent className="px-6 py-5 flex flex-col space-y-6">
				<div className="w-full flex justify-center py-4 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl border border-white/[0.02]">
					<ResponsiveContainer width="100%" height={220}>
						<RadarChart
							data={radarData}
							margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
						>
							<PolarGrid stroke="#1e293b" />
							<PolarAngleAxis
								dataKey="genre"
								tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
							/>
							<Radar
								name={nameA}
								dataKey="userA"
								stroke={"#8b5cf6"}
								fill={"#8b5cf6"}
								fillOpacity={0.15}
								strokeWidth={2}
							/>
							<Radar
								name={nameB}
								dataKey="userB"
								stroke={"#06b6d4"}
								fill={"#06b6d4"}
								fillOpacity={0.15}
								strokeWidth={2}
							/>
							<Tooltip
								content={({ active, payload }) => {
									if (!active || !payload?.length) return null;
									return (
										<div className="bg-[#0d1829]/95 border border-white/10 rounded-xl px-3 py-2 text-xs shadow-2xl backdrop-blur-md">
											<p className="text-slate-200 font-bold mb-1.5 border-b border-white/5 pb-1">
												{payload[0]?.payload?.genre}
											</p>
											{payload.map((p) => (
												<p
													key={p.name}
													className="font-mono flex justify-between gap-4"
													style={{ color: p.stroke }}
												>
													<span>{p.name}:</span>
													<span className="font-bold">
														{p.value?.toFixed(0)}%
													</span>
												</p>
											))}
										</div>
									);
								}}
							/>
						</RadarChart>
					</ResponsiveContainer>
				</div>

				<div className="flex items-center text-xs uppercase tracking-widest font-black px-2 border-b border-white/5 pb-2">
					<span
						className="flex-1 text-left truncate pr-2"
						style={{ color: "#8b5cf6" }}
					>
						{nameA}
					</span>
					<span className="text-slate-600 text-[10px] shrink-0">vs</span>
					<span
						className="flex-1 text-right truncate pl-2"
						style={{ color: "#06b6d4" }}
					>
						{nameB}
					</span>
				</div>

				<div className="pr-1">
					<div className="space-y-4 pb-2">
						{radarData &&
							radarData.map((genre) => {
								const scoreA = genre.userA ?? 0;
								const scoreB = genre.userB ?? 0;

								return (
									<div key={genre.genre} className="space-y-1.5">
										<div className="flex items-center justify-between text-xs">
											<span
												className="font-mono text-[10px] font-bold w-10"
												style={{
													color:
														scoreA > scoreB ? "#8b5cf6" : "rgb(100, 116, 139)",
												}}
											>
												{scoreA.toFixed(0)}%
											</span>
											<span className="text-slate-300 font-semibold tracking-wide text-center truncate max-w-[150px] flex-1">
												{genre.genre}
											</span>
											<span
												className="font-mono text-[10px] font-bold w-10 text-right"
												style={{
													color:
														scoreB > scoreA ? "#06b6d4" : "rgb(100, 116, 139)",
												}}
											>
												{scoreB.toFixed(0)}%
											</span>
										</div>

										<div className="flex gap-1 h-2 items-center">
											<div className="flex-1 bg-white/[0.03] rounded-l-full h-1.5 overflow-hidden flex justify-end min-w-0">
												<div
													className="h-full rounded-l-full transition-all duration-500"
													style={{
														width: `${(scoreA / maxVal) * 100}%`,
														background: "#8b5cf6",
														boxShadow: `0 0 10px ${"#8b5cf6"}66`,
													}}
												/>
											</div>

											<div className="w-[2px] h-3 bg-white/20 shrink-0 rounded-full" />

											<div className="flex-1 bg-white/[0.03] rounded-r-full h-1.5 overflow-hidden flex justify-start min-w-0">
												<div
													className="h-full rounded-r-full transition-all duration-500"
													style={{
														width: `${(scoreB / maxVal) * 100}%`,
														background: "#06b6d4",
														boxShadow: `0 0 10px ${"#06b6d4"}66`,
													}}
												/>
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
