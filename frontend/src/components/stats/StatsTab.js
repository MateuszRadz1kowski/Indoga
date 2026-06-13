"use client";

import { useEffect, useState, useCallback } from "react";
import GenreAffinityMap from "./GenreAffinityMap";
import HotTakes from "./HotTakes";
import TagAffinityMap from "./TagAffinityMap";
import TimelineDecades from "./TimelineDecades";
import { RecommendationsError } from "@/components/ErrorBanner";
import { Activity } from "lucide-react";

export const BASE_ENV_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StatsTab({
	data,
	setData,
	dataUserInterests,
	setDataUserInterests,
}) {
	const [isLoadingStats, setIsLoadingStats] = useState(true);
	const [statsError, setStatsError] = useState(null);

	const loadMainStats = useCallback(async () => {
		setIsLoadingStats(true);
		setStatsError(null);
		const username = localStorage.getItem("username");
		const platform = localStorage.getItem("platform");

		if (!username) {
			setStatsError({
				code: "unknown",
				message: "User not logged in",
			});
			setIsLoadingStats(false);
			return;
		}

		try {
			const rawUrl = new URL("/raw_data/", BASE_ENV_URL);
			const interestsUrl = new URL("/user_interests/", BASE_ENV_URL);

			const [rawRes, interestsRes] = await Promise.all([
				fetch(
					`${rawUrl.href}?username=${encodeURIComponent(username)}&platform=${encodeURIComponent(platform)}`,
					{
						headers: {
							"Content-Type": "application/json",
							"ngrok-skip-browser-warning": "true",
						},
					},
				),
				fetch(
					`${interestsUrl.href}?username=${encodeURIComponent(username)}&platform=${encodeURIComponent(platform)}`,
					{
						headers: {
							"Content-Type": "application/json",
							"ngrok-skip-browser-warning": "true",
						},
					},
				),
			]);

			if (!rawRes.ok) {
				const errorJson = await rawRes.json().catch(() => ({}));
				throw {
					code: errorJson.error_code || "server_error",
					message: errorJson.detail,
				};
			}
			if (!interestsRes.ok) {
				const errorJson = await interestsRes.json().catch(() => ({}));
				throw {
					code: errorJson.error_code || "server_error",
					message: errorJson.detail,
				};
			}

			const rawJson = await rawRes.json();
			const interestsJson = await interestsRes.json();

			setData(rawJson);
			setDataUserInterests(interestsJson);
		} catch (err) {
			console.error(err);
			setStatsError({
				code: err.code || "network_error",
				message: err.message || "Connection to server failed.",
			});
		} finally {
			setIsLoadingStats(false);
		}
	}, [setData, setDataUserInterests]);

	useEffect(() => {
		loadMainStats();
	}, [loadMainStats]);

	if (isLoadingStats) {
		return (
			<div className="flex items-center justify-center h-full text-slate-500 text-xs animate-pulse uppercase tracking-widest bg-[#060d1b]">
				Loading stats
			</div>
		);
	}

	if (statsError) {
		return (
			<div className="p-6 bg-[#060d1b] h-full flex items-center justify-center">
				<RecommendationsError
					errorCode={statsError.code}
					message={statsError.message}
					onRetry={loadMainStats}
				/>
			</div>
		);
	}

	return (
		<div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto bg-[#060d1b] custom-scrollbar">
			<div className="max-w-[1600px] w-full mx-auto space-y-6 pb-12">
				<div className="flex items-center gap-3 mb-6">
					<div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
						<Activity size={20} className="text-violet-400" />
					</div>
					<div>
						<h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
							Your Taste Analytics
						</h2>
						<p className="text-[13px] text-slate-400">
							Deep dive into your viewing habits and preferences.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="order-1 lg:order-none lg:col-span-2 lg:row-start-1 lg:col-start-1 h-[450px]">
						<GenreAffinityMap interests={dataUserInterests} />
					</div>

					<div className="order-2 lg:order-none lg:col-span-1 lg:row-start-2 lg:col-start-1 h-[450px] lg:h-[550px]">
						<TagAffinityMap interests={dataUserInterests} />
					</div>

					<div className="order-3 lg:order-none lg:col-span-1 lg:row-start-1 lg:col-start-3 h-[450px]">
						<HotTakes data={data} />
					</div>

					<div className="order-4 lg:order-none lg:col-span-2 lg:row-start-2 lg:col-start-2 h-auto lg:h-[550px]">
						<TimelineDecades apiData={data} />
					</div>
				</div>
			</div>
		</div>
	);
}
