"use client";
import FilterPage from "@/components/filters/filterPage";
import { useApiData } from "@/components/getApiData";
import Recommendation from "@/components/showRecommendations/recommendation";
import { RecommendationSkeleton } from "@/components/showRecommendations/recommendationSkeleton";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";

export default function Recommendations() {
	const [apiData, setApiData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [sortBy, setSortBy] = useState("match");

	useEffect(() => {
		if (apiData.length > 0) {
			const sortedData = [...apiData].sort((a, b) => {
				if (sortBy == "match") {
					return b.score - a.score;
				} else if (sortBy == "score") {
					return b.mean_score - a.mean_score;
				} else if (sortBy == "popularity") {
					return b.popularity - a.popularity;
				} else if (sortBy == "year") {
					return b.season_year - a.season_year;
				}
			});
			setApiData(sortedData);
			console.log(sortedData);
		}
	}, [sortBy]);

	return (
		<div className="flex min-h-screen bg-[#020617] text-slate-200 selection:bg-purple-500/30">
			<aside className="hidden md:block md:w-70 lg:w-96 border-r border-slate-800/50 bg-[#0f172a]/50 h-screen sticky top-0 overflow-y-auto custom-scrollbar">
				<div className="p-8">
					<FilterPage
						onDataUpdate={setApiData}
						onLoadingChange={setIsLoading}
					/>
				</div>
			</aside>

			<main className="flex-1 p-4 md:p-10 lg:p-16">
				<header className="mb-10 relative text-left">
					<div className="absolute -left-4 top-0 w-2 h-12 bg-purple-500 rounded-full blur-sm rotate-30"></div>
					<h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
						Anime Recommender
					</h1>
					<p className="text-slate-500 text-xs font-bold tracking-[0.2em] mt-2 -ml-1">
						Personalized Discovery Engine
					</p>

					<div className="space-y-2">
						<Label className="text-slate-400 text-xs uppercase tracking-wider">
							Sort by
						</Label>
						<ToggleGroup
							type="single"
							variant="outline"
							value={sortBy ?? "match"}
							onValueChange={(value) => {
								setSortBy(value);
							}}
							className="justify-start gap-2"
						>
							<ToggleGroupItem
								value="match"
								className="flex-1 bg-slate-900 border-slate-700 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-slate-800"
							>
								Match%
							</ToggleGroupItem>
							<ToggleGroupItem
								value="score"
								className="flex-1 bg-slate-900 border-slate-700 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-slate-800"
							>
								Score
							</ToggleGroupItem>
							<ToggleGroupItem
								value="popularity"
								className="flex-1 bg-slate-900 border-slate-700 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-slate-800"
							>
								Popularity
							</ToggleGroupItem>
							<ToggleGroupItem
								value="year"
								className="flex-1 bg-slate-900 border-slate-700 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-slate-800"
							>
								Release year
							</ToggleGroupItem>
						</ToggleGroup>
					</div>
				</header>

				<div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-8">
					{isLoading
						? [...Array(12)].map((_, index) => (
								<RecommendationSkeleton key={index} />
							))
						: apiData.map((item) => (
								<Recommendation key={item.id} recommendationData={item} />
							))}
				</div>
			</main>
		</div>
	);
}
