"use client";

import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiscoverTab from "@/components/DiscoverTab";
import StatsTab from "@/components/stats/StatsTab";
import CompareTab from "@/components/compare/CompareTab";

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState("discover");
	const [apiData, setApiData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [sortBy, setSortBy] = useState("match");
	const [sortDirection, setSortDirection] = useState("desc");
	const [viewMode, setViewMode] = useState("grid");

	const [filters, setFilters] = useState({
		show_sequels: null,
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

	useEffect(() => {
		if (typeof window !== "undefined" && window.innerWidth < 1024) {
			setViewMode("wideGrid");
		}
	}, []);

	const sortedAnimeData = useMemo(() => {
		if (!apiData || apiData.length == 0) return [];

		return [...apiData].sort((a, b) => {
			let valA = 0;
			let valB = 0;

			if (sortBy == "match") {
				valA = a.score || 0;
				valB = b.score || 0;
			} else if (sortBy == "score") {
				valA = a.mean_score || 0;
				valB = b.mean_score || 0;
			} else if (sortBy == "popularity") {
				valA = a.popularity || 0;
				valB = b.popularity || 0;
			} else if (sortBy == "year") {
				valA = a.season_year || 0;
				valB = b.season_year || 0;
			}

			if (sortDirection == "asc") {
				return valA - valB;
			} else {
				return valB - valA;
			}
		});
	}, [apiData, sortBy, sortDirection]);

	useEffect(() => {
		if (
			localStorage.getItem("username") == null &&
			localStorage.getItem("platform") == null
		) {
			window.location.href = "/";
		}
	}, []);

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
							sortDirection={sortDirection}
							setSortDirection={setSortDirection}
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

					<TabsContent
						value="compare"
						className="flex-1 m-0 p-0 border-none outline-none overflow-hidden data-[state=active]:block"
					>
						<CompareTab dataUserInterests={statsInterests} />
					</TabsContent>
				</Tabs>
			</main>

			<Footer />
		</div>
	);
}
