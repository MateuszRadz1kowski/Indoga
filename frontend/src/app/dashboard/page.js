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

	const [filters, setFilters] = useState({
		show_sequels: null,
		experimental_mode: null,
		show_18_rated: null,
		tag_importance: null,
		popularity_importance: null,
		min_number_episodes: null,
		max_number_episodes: null,
		min_release_year: null,
		max_release_year: null,
		min_mean_score: null,
		show_selected_studios: [],
		show_selected_tags: [],
		hide_selected_tags: [],
		show_selected_genres: [],
		hide_selected_genres: [],
		media_types: null,
		show_streaming_service: null,
		show_planning: null,
		show_high_popularity: null,
	});

	const [statsData, setStatsData] = useState(null);
	const [statsInterests, setStatsInterests] = useState(null);

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
							filters={filters}
							setFilters={setFilters}
						/>
					</TabsContent>

					<TabsContent
						value="stats"
						className="flex-1 m-0 p-0 border-none outline-none overflow-hidden data-[state=active]:block"
					>
						<StatsTab
							data={statsData}
							setData={setStatsData}
							dataUserInterests={statsInterests}
							setDataUserInterests={setStatsInterests}
						/>
					</TabsContent>
				</Tabs>
			</main>

			<Footer />
		</div>
	);
}
