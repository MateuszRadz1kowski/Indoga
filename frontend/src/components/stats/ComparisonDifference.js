"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function ComparisonDifference({ diffrence, nameA, nameB }) {
	return (
		<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] text-slate-100 overflow-hidden shadow-xl backdrop-blur-md h-full">
			<CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.02]">
				<div className="flex items-center gap-2">
					<Zap size={14} className="text-violet-400" />
					<h3 className="text-sm font-bold text-white uppercase tracking-wider">
						Taste diffrence
					</h3>
				</div>
			</CardHeader>
			<CardContent className="px-6 py-5 space-y-3">
				{diffrence.map((tag) => (
					<div key={tag.name} className="space-y-0.5">
						<div className="flex items-center justify-between">
							<span className="text-[11px] text-slate-300 font-medium truncate max-w-[130px]">
								{tag.name}
							</span>
							<span
								className="text-[10px]"
								style={{ color: tag.difference > 0 ? "#8b5cf6" : "#06b6d4" }}
							>
								{tag.difference > 0 ? `${nameA} favour` : `${nameB} favours`}
							</span>
						</div>
						<div className="flex gap-1 items-center">
							<div className="flex-1 flex justify-end">
								<div
									className="h-1.5 rounded-l-full"
									style={{
										width: `${(tag.scoreA / 0.35) * 100}%`,
										background: "#8b5cf6",
										opacity: 0.8,
									}}
								/>
							</div>
							<div className="w-px h-2.5 bg-white/10 shrink-0" />
							<div className="flex-1">
								<div
									className="h-1.5 rounded-r-full"
									style={{
										width: `${(tag.scoreB / 0.35) * 100}%`,
										background: "#06b6d4",
										opacity: 0.8,
									}}
								/>
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
