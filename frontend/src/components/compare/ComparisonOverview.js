"use client";

import { Card, CardContent } from "@/components/ui/card";

const MatchCircle = ({ percentage }) => {
	const radius = 54;
	const circumference = 2 * Math.PI * radius;
	const strokeDashOffset = (percentage / 100) * circumference;

	let statusColor = "#f43f5e";
	let statusLabel = "Opposites";

	if (percentage >= 85) {
		statusColor = "#10b981";
		statusLabel = "Soulmates";
	} else if (percentage >= 70) {
		statusColor = "#8b5cf6";
		statusLabel = "Similiar tastes";
	} else if (percentage >= 55) {
		statusColor = "#f59e0b";
		statusLabel = "Different tastes";
	}

	return (
		<div className="flex flex-col items-center gap-3">
			<div className="relative w-[140px] h-[140px]">
				<svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
					<circle
						cx="60"
						cy="60"
						r={radius}
						fill="none"
						stroke="#1e293b"
						strokeWidth="8"
					/>
					<circle
						cx="60"
						cy="60"
						r={radius}
						fill="none"
						stroke={statusColor}
						strokeWidth="8"
						strokeLinecap="round"
						strokeDasharray={`${strokeDashOffset} ${circumference}`}
						style={{
							filter: `drop-shadow(0 0 8px ${statusColor}88)`,
							transition: "stroke-dasharray 1.5s ease-out",
						}}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span
						className="text-4xl font-black tracking-tighter"
						style={{ color: statusColor }}
					>
						{percentage}%
					</span>
					<span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
						match
					</span>
				</div>
			</div>
			<span
				className="text-sm font-bold tracking-widest uppercase"
				style={{ color: statusColor }}
			>
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
		<Card className="bg-[#0a0f1d]/85 border border-white/[0.05] text-slate-100 overflow-hidden shadow-2xl backdrop-blur-md">
			<CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 relative overflow-hidden">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent -z-10" />

				<div className="flex flex-col items-center text-center">
					<div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner">
						<p className="text-2xl font-black" style={{ color: "#8b5cf6" }}>
							{formatToPercentage(tagSimilarity)}
						</p>
						<p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
							Tag Match
						</p>
					</div>
				</div>

				<div className="z-10 bg-[#0a0f1d] rounded-full p-2">
					<MatchCircle percentage={match} />
				</div>

				<div className="flex flex-col items-center text-center">
					<div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner">
						<p className="text-2xl font-black" style={{ color: "#06b6d4" }}>
							{formatToPercentage(genreSimilarity)}
						</p>
						<p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
							Genre Match
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
