import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function RecommendationSkeleton() {
	return (
		<Card className="bg-[#1e293b]/50 border-none p-3 overflow-hidden">
			<div className="flex justify-between items-start gap-1 mb-2">
				<Skeleton className="h-4 w-3/4 bg-slate-700/50" />
				<Skeleton className="h-5 w-10 bg-purple-600/30 rounded-full" />
			</div>

			<div className="flex flex-col lg:flex-row gap-3">
				<Skeleton className="w-full lg:w-44 lg:h-60 h-40 rounded-md bg-slate-700/50" />

				<div className="flex-1 flex flex-col gap-3">
					<div className="flex items-center gap-3">
						<Skeleton className="h-6 w-16 bg-amber-400/10" />
						<Skeleton className="h-4 w-24 bg-slate-700/50" />
					</div>

					<div className="bg-[#0f172a]/80 p-3 rounded-lg border border-purple-500/10">
						<Skeleton className="h-3 w-32 bg-purple-500/20 mb-2" />
						<div className="flex flex-wrap gap-1.5">
							<Skeleton className="h-4 w-12 rounded-full bg-purple-500/20" />
							<Skeleton className="h-4 w-16 rounded-full bg-purple-500/20" />
							<Skeleton className="h-4 w-14 rounded-full bg-purple-500/20" />
						</div>
					</div>

					<div className="space-y-2">
						<Skeleton className="h-3 w-full bg-slate-700/50" />
						<Skeleton className="h-3 w-full bg-slate-700/50" />
						<Skeleton className="h-3 w-2/3 bg-slate-700/50" />
					</div>

					<div className="flex gap-4 mt-auto pt-3 border-t border-slate-700/50">
						<Skeleton className="h-3 w-12 bg-slate-700/50" />
						<Skeleton className="h-3 w-12 bg-slate-700/50" />
						<Skeleton className="h-3 w-12 bg-slate-700/50" />
					</div>
				</div>
			</div>
		</Card>
	);
}
