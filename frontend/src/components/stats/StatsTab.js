"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import GenreAffinityMap from "./GenreAffinityMap";
import HotTakes from "./HotTakes";
import TagAffinityMap from "./TagAffinityMap";
import TimelineDecades from "./TimelineDecades";
import ComparisonForm from "./ComparisonForm";
import ComparisonOverview from "./ComparisonOverview";
import ComparisonShared from "./ComparisonShared";
import ComparisonDifference from "./ComparisonDifference";
import ComparisonGenres from "./ComparisonGenres";

import { RecommendationsError } from "@/components/ErrorBanner";
import { useToast } from "@/components/useToast";

function calculateCosineSimilarity(userAScores, userBScores) {
	const allKeys = new Set([
		...Object.keys(userAScores),
		...Object.keys(userBScores),
	]);

	let dotProduct = 0;
	let magnitudeA = 0;
	let magnitudeB = 0;

	allKeys.forEach((tagOrGenreName) => {
		const scoreA = userAScores[tagOrGenreName] ?? 0;
		const scoreB = userBScores[tagOrGenreName] ?? 0;

		dotProduct += scoreA * scoreB;
		magnitudeA += scoreA * scoreA;
		magnitudeB += scoreB * scoreB;
	});
	if (!magnitudeA || !magnitudeB) return 0;
	return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

function buildComparison(interestsUserA, interestsUserB) {
	if (!interestsUserA || !interestsUserB) {
		return null;
	}

	const [tagsUserA, genresUserA] = interestsUserA;
	const [tagsUserB, genresUserB] = interestsUserB;

	const tagSimilarity = calculateCosineSimilarity(
		tagsUserA ?? {},
		tagsUserB ?? {},
	);
	const genreSimilarity = calculateCosineSimilarity(
		genresUserA ?? {},
		genresUserB ?? {},
	);

	const matchPercentage = Math.round(
		(tagSimilarity * 0.7 + genreSimilarity * 0.3) * 100,
	);

	const sharedTags = Object.keys(tagsUserA ?? {})
		.filter((tagName) => tagsUserB?.[tagName])
		.map((tagName) => ({
			name: tagName,
			scoreA: tagsUserA[tagName],
			scoreB: tagsUserB[tagName],
			averageScore: (tagsUserA[tagName] + tagsUserB[tagName]) / 2,
		}))
		.sort((a, b) => b.averageScore - a.averageScore)
		.slice(0, 8);

	const uniqueTagsA = Object.entries(tagsUserA ?? {})
		.filter(([tagName]) => !tagsUserB?.[tagName])
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([tagName, score]) => ({ name: tagName, score }));

	const uniqueTagsB = Object.entries(tagsUserB ?? {})
		.filter(([tagName]) => !tagsUserA?.[tagName])
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([tagName, score]) => ({ name: tagName, score }));

	const difference = Object.entries(tagsUserA ?? {})
		.map(([name, scoreA]) => ({
			name: name,
			scoreA: scoreA,
			scoreB: tagsUserB?.[name] ?? 0,
			difference: scoreA - (tagsUserB?.[name] ?? 0),
		}))
		.concat(
			Object.entries(tagsUserB ?? {})
				.filter(([name]) => !tagsUserA?.[name])
				.map(([name, scoreB]) => ({
					name: name,
					scoreA: 0,
					scoreB: scoreB,
					difference: -scoreB,
				})),
		)
		.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
		.slice(0, 10);

	const allGenres = [
		...new Set([
			...Object.keys(genresUserA ?? {}),
			...Object.keys(genresUserB ?? {}),
		]),
	];

	const radarData = allGenres
		.map((genre) => ({
			genre: genre,
			userA: Math.round((genresUserA?.[genre] ?? 0) * 100),
			userB: Math.round((genresUserB?.[genre] ?? 0) * 100),
		}))
		.slice(0, 10);

	return {
		match: matchPercentage,
		tagSim: tagSimilarity,
		genreSim: genreSimilarity,
		sharedTags: sharedTags,
		uniqueA: uniqueTagsA,
		uniqueB: uniqueTagsB,
		difference: difference,
		radarData: radarData,
	};
}

export const BASE_ENV_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StatsTab({
	data,
	setData,
	dataUserInterests,
	setDataUserInterests,
}) {
	const [comparisonUsername, setComparisonUsername] = useState("");
	const [comparisonPlatform, setComparisonPlatform] = useState("AniList");
	const [comparisonInterests, setComparisonInterests] = useState(null);
	const [isComparing, setIsComparing] = useState(false);
	const [isLoadingStats, setIsLoadingStats] = useState(true);
	const [statsError, setStatsError] = useState(null);
	const { toast } = useToast();

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
	}, []);

	useEffect(() => {
		loadMainStats();
	}, [loadMainStats]);

	const fetchComparison = useCallback(async () => {
		if (!comparisonUsername.trim()) return;
		setComparisonInterests(null);
		setIsComparing(true);

		try {
			const verifyUrl = new URL("/verify_user/", BASE_ENV_URL);
			verifyUrl.searchParams.append("username", comparisonUsername.trim());
			verifyUrl.searchParams.append("platform", comparisonPlatform);

			const verifyRes = await fetch(verifyUrl.href, {
				headers: {
					"Content-Type": "application/json",
					"ngrok-skip-browser-warning": "true",
				},
			});
			const verifyData = await verifyRes.json();

			if (!verifyData.exists) {
				toast({
					type: "error",
					title: "User Not Found",
					message: `User '${comparisonUsername}' does not exist.`,
				});
				setIsComparing(false);
				return;
			}

			if (verifyData.is_private) {
				toast({
					type: "warning",
					title: "Private Profile",
					message: `Profile '${comparisonUsername}' is private.`,
				});
				setIsComparing(false);
				return;
			}

			const interestsUrl = new URL("/user_interests/", BASE_ENV_URL);
			const interestsRes = await fetch(
				`${interestsUrl.href}?username=${encodeURIComponent(comparisonUsername.trim())}&platform=${encodeURIComponent(comparisonPlatform)}`,
				{
					headers: {
						"Content-Type": "application/json",
						"ngrok-skip-browser-warning": "true",
					},
				},
			);

			if (!interestsRes.ok) throw new Error("Failed to fetch user data.");

			const interestsData = await interestsRes.json();
			setComparisonInterests(interestsData);

			toast({
				type: "success",
				title: "Comparison generated",
				message: `Successfully matched preferences with ${comparisonUsername}`,
			});
		} catch (e) {
			console.error(e);
			toast({
				type: "error",
				title: "Error",
				message: "Failed to fetch user data for comparison.",
			});
		} finally {
			setIsComparing(false);
		}
	}, [comparisonUsername, comparisonPlatform, toast]);

	const comparison = useMemo(() => {
		if (!dataUserInterests || !comparisonInterests) return null;
		return buildComparison(dataUserInterests, comparisonInterests);
	}, [dataUserInterests, comparisonInterests]);

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
		<div className="p-4 h-full overflow-y-auto bg-[#060d1b] custom-scrollbar">
			<ComparisonForm
				comparisonUsername={comparisonUsername}
				setComparisonUsername={setComparisonUsername}
				comparisonPlatform={comparisonPlatform}
				setComparisonPlatform={setComparisonPlatform}
				onFetch={fetchComparison}
				isLoading={isComparing}
			/>

			{comparison && (
				<div className="space-y-4 mb-6">
					<ComparisonOverview
						match={comparison.match}
						tagSimilarity={comparison.tagSim}
						genreSimilarity={comparison.genreSim}
					/>

					<ComparisonShared
						sharedTags={comparison.sharedTags}
						uniqueA={comparison.uniqueA}
						uniqueB={comparison.uniqueB}
						nameA="You"
						nameB={comparisonUsername.trim()}
					/>

					<ComparisonDifference
						difference={comparison.difference}
						nameA="You"
						nameB={comparisonUsername.trim()}
					/>

					<ComparisonGenres
						radarData={comparison.radarData}
						nameA="You"
						nameB={comparisonUsername.trim()}
					/>
				</div>
			)}

			<GenreAffinityMap interests={dataUserInterests} />
			<TagAffinityMap interests={dataUserInterests} />
			<TimelineDecades apiData={data} />
			<HotTakes data={data} />
		</div>
	);
}
