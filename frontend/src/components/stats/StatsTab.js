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
	const [tagsUserA, genresUserA] = interestsUserA;
	const [tagsUserB, genresUserB] = interestsUserB;

	const tagSimilarity = calculateCosineSimilarity(tagsUserA, tagsUserB);
	const genreSimilarity = calculateCosineSimilarity(genresUserA, genresUserB);
	console.log("Tag similarity:", tagSimilarity);
	console.log("Genre similarity:", genreSimilarity);
	const matchPercentage = Math.round(
		(tagSimilarity * 0.7 + genreSimilarity * 0.3) * 100,
	);
	const sharedTags = Object.keys(tagsUserA)
		.filter((tagName) => tagsUserB[tagName])
		.map((tagName) => ({
			name: tagName,
			scoreA: tagsUserA[tagName],
			scoreB: tagsUserB[tagName],
			averageScore: (tagsUserA[tagName] + tagsUserB[tagName]) / 2,
		}))
		.sort((a, b) => b.averageScore - a.averageScore)
		.slice(0, 8);

	const uniqueTagsA = Object.entries(tagsUserA)
		.filter(([tagName]) => !tagsUserB[tagName])
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([tagName, score]) => ({ name: tagName, score }));

	const uniqueTagsB = Object.entries(tagsUserB)
		.filter(([tagName]) => !tagsUserA[tagName])
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([tagName, score]) => ({ name: tagName, score }));

	const difference = Object.entries(tagsUserA)
		.map(([name, scoreA]) => ({
			name: name,
			scoreA: scoreA,
			scoreB: tagsUserB[name] ?? 0,
			difference: scoreA - (tagsUserB[name] ?? 0),
		}))
		.concat(
			Object.entries(tagsUserB)
				.filter(([name]) => !tagsUserA[name])
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
		...new Set([...Object.keys(genresUserA), ...Object.keys(genresUserB)]),
	];
	console.log(genresUserA, genresUserB);
	const radarData = allGenres
		.map((genre) => ({
			genre: genre,
			userA: Math.round((genresUserA[genre] ?? 0) * 100),
			userB: Math.round((genresUserB[genre] ?? 0) * 100),
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

export default function StatsTab() {
	const [data, setData] = useState(null);
	const [dataUserInterests, setDataUserInterests] = useState(null);

	const [comparisonUsername, setComparisonUsername] = useState("");
	const [comparisonPlatform, setComparisonPlatform] = useState("AniList");
	const [comparisonInterests, setComparisonInterests] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const username = localStorage.getItem("username");
			const platform = localStorage.getItem("platform");
			if (!username) return;
			try {
				const res = await fetch(
					`https://${process.env.NEXT_PUBLIC_API_URL}/raw_data/?username=${encodeURIComponent(username)}&platform=${encodeURIComponent(platform)}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"ngrok-skip-browser-warning": "true",
						},
					},
				);
				setData(await res.json());
			} catch (err) {
				console.error(err);
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		async function fetchData() {
			const username = localStorage.getItem("username");
			const platform = localStorage.getItem("platform");
			if (!username) return;
			try {
				const res = await fetch(
					`https://${process.env.NEXT_PUBLIC_API_URL}/user_interests/?username=${encodeURIComponent(username)}&platform=${encodeURIComponent(platform)}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"ngrok-skip-browser-warning": "true",
						},
					},
				);
				setDataUserInterests(await res.json());
			} catch (err) {
				console.error(err);
			}
		}
		fetchData();
	}, []);

	const fetchComparison = useCallback(async () => {
		if (!comparisonUsername.trim()) return;
		setComparisonInterests(null);
		try {
			const res = await fetch(
				`https://${process.env.NEXT_PUBLIC_API_URL}/user_interests/?username=${encodeURIComponent(comparisonUsername.trim())}&platform=${encodeURIComponent(comparisonPlatform)}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"ngrok-skip-browser-warning": "true",
					},
				},
			);
			const json = await res.json();
			setComparisonInterests(json);
		} catch (e) {
			console.error(e);
		}
	}, [comparisonUsername, comparisonPlatform]);

	const comparison = useMemo(() => {
		if (!dataUserInterests || !comparisonInterests) return null;
		return buildComparison(dataUserInterests, comparisonInterests);
	}, [dataUserInterests, comparisonInterests]);

	return (
		<div className="p-4 h-full overflow-y-auto bg-[#060d1b] custom-scrollbar">
			{data && dataUserInterests ? (
				<>
					<ComparisonForm
						comparisonUsername={comparisonUsername}
						setComparisonUsername={setComparisonUsername}
						comparisonPlatform={comparisonPlatform}
						setComparisonPlatform={setComparisonPlatform}
						onFetch={fetchComparison}
					/>

					{comparison && (
						<div className="space-y-4">
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
								nameB={comparisonUsername}
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
				</>
			) : (
				<div className="flex items-center justify-center h-32 text-slate-500 text-xs animate-pulse uppercase tracking-widest">
					Loading stats...
				</div>
			)}
		</div>
	);
}
