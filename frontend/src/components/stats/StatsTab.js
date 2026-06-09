"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import GenreAffinityMap from "./GenreAffinityMap";
import HotTakes from "./HotTakes";
import TagAffinityMap from "./TagAffinityMap";
import TimelineDecades from "./TimelineDecades";
import { RecommendationsError } from "@/components/ErrorBanner";

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
			<div className="flex items-center justify-center h-64 text-slate-500 text-xs animate-pulse uppercase tracking-widest bg-[#060d1b]">
				Loading stats...
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
		<div className="p-4 h-full overflow-y-auto bg-[#060d1b] custom-scrollbar space-y-4">
			<GenreAffinityMap interests={dataUserInterests} />
			<TagAffinityMap interests={dataUserInterests} />
			<TimelineDecades apiData={data} />
			<HotTakes data={data} />
		</div>
	);
}
