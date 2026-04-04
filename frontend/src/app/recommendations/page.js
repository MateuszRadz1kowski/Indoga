"use client";
import FilterPage from "@/components/filters/filterPage";
import { useApiData } from "@/components/getApiData";
import Recommendation from "@/components/showRecommendations/recommendation";
import { useEffect, useState } from "react";

export default function Recommendations() {
	const [apiData, setApiData] = useState([]);

	return (
		<div className="flex min-h-screen bg-[#020617] text-slate-200 selection:bg-purple-500/30">
			<aside className="hidden lg:block w-96 border-r border-slate-800/50 bg-[#0f172a]/50 h-screen sticky top-0 overflow-y-auto custom-scrollbar">
				<div className="p-8">
					<FilterPage onDataUpdate={setApiData} />
				</div>
			</aside>

			<main className="flex-1 p-4 md:p-10 lg:p-16">
				<header className="mb-10 relative">
					<div className="absolute -left-4 top-0 w-1 h-12 bg-purple-600 rounded-full blur-sm"></div>
					<h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
						Anime Recommender
					</h1>
					<p className="text-slate-500 text-xs font-bold tracking-[0.2em] mt-2 ml-1">
						Personalized Discovery Engine
					</p>
				</header>

				<div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-8">
					{apiData &&
						apiData.map((item) => (
							<Recommendation key={item.id} recommendationData={item} />
						))}
				</div>
			</main>
		</div>
	);
}
