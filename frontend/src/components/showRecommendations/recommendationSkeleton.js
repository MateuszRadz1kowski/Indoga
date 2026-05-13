import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function GridSkeleton() {
	return (
		<Card className="bg-[#0d1829] border border-white/[0.06] flex flex-col gap-0 p-0 overflow-hidden">
			<div className="relative overflow-hidden aspect-[2/3] w-full bg-slate-800/50">
				<Skeleton className="absolute top-2 right-2 h-5 w-10 bg-purple-600/30 rounded-full" />
				<Skeleton className="absolute bottom-2 left-2 h-5 w-14 bg-amber-400/10 rounded" />
			</div>

			<div className="p-2.5 flex flex-col gap-2">
				<div className="space-y-1">
					<Skeleton className="h-3 w-full bg-slate-700/50" />
					<Skeleton className="h-3 w-2/3 bg-slate-700/50" />
				</div>
				<Skeleton className="h-3 w-24 bg-slate-700/50" />
				<div className="flex flex-wrap gap-1">
					<Skeleton className="h-4 w-12 rounded-full bg-purple-500/10" />
					<Skeleton className="h-4 w-16 rounded-full bg-purple-500/10" />
					<Skeleton className="h-4 w-16 rounded-full bg-purple-500/10" />
					<Skeleton className="h-4 w-16 rounded-full bg-purple-500/10" />
				</div>
			</div>
		</Card>
	);
}

function WideGridSkeleton() {
	return (
		<Card className="bg-[#0d1829] border border-white/[0.06] p-3 flex flex-row gap-3 overflow-hidden">
			<Skeleton className="w-28 h-40 rounded-md bg-slate-800/50 shrink-0" />

			<div className="flex-1 flex flex-col gap-3 min-w-0">
				<div className="flex items-start justify-between gap-2">
					<div className="space-y-1 flex-1">
						<Skeleton className="h-4 w-3/4 bg-slate-700/50" />
						<Skeleton className="h-4 w-1/2 bg-slate-700/50" />
					</div>
					<Skeleton className="h-5 w-10 bg-purple-600/30 rounded-full shrink-0" />
				</div>

				<div className="flex items-center gap-2">
					<Skeleton className="h-5 w-14 bg-amber-400/10 rounded" />
					<Skeleton className="h-3 w-24 bg-slate-700/50" />
				</div>

				<div className="space-y-1.5">
					<Skeleton className="h-3 w-32 bg-purple-500/10" />
					<div className="flex flex-wrap gap-1">
						<Skeleton className="h-4 w-12 rounded-full bg-purple-500/10" />
						<Skeleton className="h-4 w-16 rounded-full bg-purple-500/10" />
						<Skeleton className="h-4 w-12 rounded-full bg-purple-500/10" />
						<Skeleton className="h-4 w-16 rounded-full bg-purple-500/10" />
					</div>
				</div>

				<div className="space-y-1.5 mt-auto">
					<Skeleton className="h-3 w-full bg-slate-800/50" />
					<Skeleton className="h-3 w-4/5 bg-slate-800/50" />
				</div>
			</div>
		</Card>
	);
}

function ListSkeleton() {
	return (
		<Card className="bg-[#0d1829] border border-white/[0.06] flex flex-row items-center gap-0 p-0 overflow-hidden h-20">
			<Skeleton className="w-20 h-full bg-slate-800/50 shrink-0 rounded-none" />

			<div className="flex-1 min-w-0 px-4 py-2 flex flex-col gap-1.5">
				<div className="flex items-center gap-3">
					<Skeleton className="h-3 w-1/8 bg-slate-700/50" />
					<Skeleton className="h-5 w-10 bg-purple-600/30 rounded-full" />
				</div>
				<Skeleton className="h-3 w-3/4 bg-slate-800/50 italic" />

				<div className="flex items-center gap-3">
					<div className="flex flex-wrap gap-1">
						<Skeleton className="h-3.5 w-10 rounded-full bg-purple-500/10" />
						<Skeleton className="h-3.5 w-14 rounded-full bg-purple-500/10" />
						<Skeleton className="h-3.5 w-10 rounded-full bg-purple-500/10" />
						<Skeleton className="h-3.5 w-14 rounded-full bg-purple-500/10" />
					</div>
					<Skeleton className="h-3 w-20 bg-slate-700/50 ml-auto" />
				</div>
			</div>

			<div className="shrink-0 pr-4 flex items-center gap-3">
				<Skeleton className="h-3 w-12 bg-slate-700/50" />
				<Skeleton className="h-3 w-12 bg-slate-700/50" />
				<Skeleton className="h-3 w-12 bg-slate-700/50" />
			</div>
		</Card>
	);
}

export default function RecommendationSkeleton({ viewMode = "grid" }) {
	switch (viewMode) {
		case "list":
			return <ListSkeleton />;
		case "wideGrid":
			return <WideGridSkeleton />;
		case "grid":
		default:
			return <GridSkeleton />;
	}
}
