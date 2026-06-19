"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function ComparisonDifference({
	difference = [],
	nameA,
	nameB,
}) {
	return (
		<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] text-slate-100 overflow-hidden shadow-xl backdrop-blur-md h-full flex flex-col">
			<CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.02] shrink-0">
				<div className="flex items-center gap-2">
					<Zap size={14} className="text-violet-400" />
					<h3 className="text-sm font-bold text-white uppercase tracking-wider">
						Taste Difference
					</h3>
				</div>
			</CardHeader>

			<CardContent className="flex-1 p-0 flex flex-col min-h-0">
				<div className="flex-1 overflow-y-auto lg:overflow-y-visible custom-scrollbar px-6 py-5 min-h-0">
					<div className="space-y-5">
						{(difference || []).map((tag) => {
							const scoreA = Math.abs(tag.scoreA ?? 0);
							const scoreB = Math.abs(tag.scoreB ?? 0);
							const maxScore = Math.max(scoreA, scoreB, 0.01);

							const widthA = (scoreA / maxScore) * 100;
							const widthB = (scoreB / maxScore) * 100;

							return (
								<div key={tag.name} className="space-y-1.5">
									<div className="flex items-center justify-between">
										<span className="text-xs text-slate-200 font-medium truncate flex-1 pr-2">
											{tag.name}
										</span>
										<span
											className="text-[10px] font-mono shrink-0 uppercase tracking-widest font-bold"
											style={{
												color: tag.difference > 0 ? "#8b5cf6" : "#06b6d4",
											}}
										>
											{tag.difference > 0
												? `${nameA} favour`
												: `${nameB} favours`}
										</span>
									</div>

									<div className="flex gap-1 items-center">
										<div className="flex-1 flex justify-end min-w-0 bg-white/[0.03] rounded-l-full overflow-hidden">
											<div
												className="h-2 rounded-l-full transition-all duration-500"
												style={{
													width: `${widthA}%`,
													background: "#8b5cf6",
												}}
											/>
										</div>

										<div className="w-px h-3 bg-white/10 shrink-0" />

										<div className="flex-1 min-w-0 bg-white/[0.03] rounded-r-full overflow-hidden">
											<div
												className="h-2 rounded-r-full transition-all duration-500"
												style={{
													width: `${widthB}%`,
													background: "#06b6d4",
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
