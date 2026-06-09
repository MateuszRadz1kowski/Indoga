"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const MatchCircle = ({ percentage }) => {
	const radius = 42;
	const circumference = 2 * Math.PI * radius;
	const strokeDashOffset = (percentage / 100) * circumference;

	let statusColor = "#f43f5e";
	let statusLabel = "Opposites";

	if (percentage >= 75) {
		statusColor = "#10b981";
		statusLabel = "Soulmates";
	} else if (percentage >= 50) {
		statusColor = "#8b5cf6";
		statusLabel = "Similiar tastes";
	} else if (percentage >= 25) {
		statusColor = "#f59e0b";
		statusLabel = "Diffrent tastes";
	}

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="relative w-[110px] h-[110px]">
				<svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
					<circle
						cx="50"
						cy="50"
						r={radius}
						fill="none"
						stroke="#1e293b"
						strokeWidth="8"
					/>
					<circle
						cx="50"
						cy="50"
						r={radius}
						fill="none"
						stroke={statusColor}
						strokeWidth="8"
						strokeLinecap="round"
						strokeDasharray={`${strokeDashOffset} ${circumference}`}
						style={{
							filter: `drop-shadow(0 0 6px ${statusColor}88)`,
							transition: "stroke-dasharray 1s ease",
						}}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-2xl font-black" style={{ color: statusColor }}>
						{percentage}%
					</span>
					<span className="text-[9px] text-slate-500 uppercase tracking-widest">
						match
					</span>
				</div>
			</div>
			<span className="text-xs font-semibold" style={{ color: statusColor }}>
				{statusLabel}
			</span>
		</div>
	);
};

export default function ComparisonOverview({
	match,
	tagSimilarity,
	genreSimilarity,
}) {
	const formatToPercentage = (value) => `${(value * 100).toFixed(1)}%`;

	return (
		<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] text-slate-100 overflow-hidden shadow-xl backdrop-blur-md h-full">
			<CardHeader className="px-6 pt-5 pb-4 border-b border-white/[0.02]">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-bold text-white uppercase tracking-wider">
						Overview
					</h3>
				</div>
			</CardHeader>
			<CardContent className="px-6 py-6 flex flex-col items-center gap-4">
				<MatchCircle percentage={match} />

				<div className="grid grid-cols-2 gap-3 w-full">
					<div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-2.5 text-center">
						<p className="text-base font-black" style={{ color: "#8b5cf6" }}>
							{formatToPercentage(tagSimilarity)}
						</p>
						<p className="text-[9px] text-slate-500 mt-0.5">Tag similarity</p>
					</div>

					<div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-2.5 text-center">
						<p className="text-base font-black" style={{ color: "#06b6d4" }}>
							{formatToPercentage(genreSimilarity)}
						</p>
						<p className="text-[9px] text-slate-500 mt-0.5">Genre similarity</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
