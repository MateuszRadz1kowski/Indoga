"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiscoverTab from "@/components/DiscoverTab";
import StatsTab from "@/components/stats/StatsTab";

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState("discover");
	const [apiData, setApiData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [sortBy, setSortBy] = useState("match");
	const [viewMode, setViewMode] = useState("grid");

	const sortedAnimeData = useMemo(() => {
		if (!apiData || apiData.length == 0) return [];

		return [...apiData].sort((a, b) => {
			if (sortBy == "match") return b.score - a.score;
			if (sortBy == "score") return b.mean_score - a.mean_score;
			if (sortBy == "popularity") return b.popularity - a.popularity;
			if (sortBy == "year") return b.season_year - a.season_year;
			return 0;
		});
	}, [apiData, sortBy]);

	return (
		<div className="flex flex-col h-screen w-full bg-[#060d1b] text-slate-200 overflow-hidden">
			<Navbar
				activeTab={activeTab}
				onTabChange={setActiveTab}
				apiData={sortedAnimeData}
			/>

			<main className="flex-1 min-h-0 relative">
				<Tabs value={activeTab} className="h-full w-full flex flex-col">
					<TabsContent
						value="discover"
						className="flex-1 m-0 p-0 border-none outline-none overflow-hidden data-[state=active]:flex"
					>
						<DiscoverTab
							apiData={sortedAnimeData}
							setApiData={setApiData}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
							sortBy={sortBy}
							setSortBy={setSortBy}
							viewMode={viewMode}
							setViewMode={setViewMode}
						/>
					</TabsContent>

					<TabsContent
						value="stats"
						className="flex-1 m-0 p-0 border-none outline-none overflow-hidden data-[state=active]:block"
					>
						<StatsTab apiData={sortedAnimeData} />
					</TabsContent>
				</Tabs>
			</main>

			<Footer />
		</div>
	);
}
