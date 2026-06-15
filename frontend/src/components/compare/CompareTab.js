"use client";

import { useState, useMemo, useCallback } from "react";
import ComparisonForm from "./ComparisonForm";
import ComparisonOverview from "./ComparisonOverview";
import ComparisonShared from "./ComparisonShared";
import ComparisonDifference from "./ComparisonDifference";
import ComparisonGenres from "./ComparisonGenres";
import { useToast } from "@/components/useToast";
import { InfoTooltip } from "../tooltip/TooltipSystem";
import { TOOLTIPS } from "../tooltip/TooltipData";

const BASE_ENV_URL = process.env.NEXT_PUBLIC_API_URL;

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
	if (!interestsUserA || !interestsUserB) return null;

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
		.map((genre) => {
			const scoreA = (genresUserA?.[genre] ?? 0) * 100;
			const scoreB = (genresUserB?.[genre] ?? 0) * 100;
			const mutualScore = Math.min(scoreA, scoreB);
			const totalScore = scoreA + scoreB;

			return {
				genre: genre,
				userA: Math.round(scoreA),
				userB: Math.round(scoreB),
				mutualScore,
				totalScore,
			};
		})
		.sort(
			(a, b) => b.mutualScore - a.mutualScore || b.totalScore - a.totalScore,
		)
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

export default function CompareTab({ dataUserInterests }) {
	const [comparisonUsername, setComparisonUsername] = useState("");
	const [comparisonPlatform, setComparisonPlatform] = useState("AniList");
	const [comparisonInterests, setComparisonInterests] = useState(null);
	const [isComparing, setIsComparing] = useState(false);
	const { toast } = useToast();

	const fetchComparison = useCallback(async () => {
		if (!comparisonUsername.trim()) return;
		setComparisonInterests(null);
		setIsComparing(true);

		if (comparisonUsername.trim() == localStorage.getItem("username")) {
			toast({
				type: "info",
				title: "Comparison",
				message: "You cannot compare your own profile with itself.",
			});
			setIsComparing(false);
			return;
		}

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

	if (!dataUserInterests) {
		return (
			<div className="flex items-center justify-center h-full text-slate-500 text-xs animate-pulse uppercase tracking-widest bg-[#060d1b]">
				Loading your profile data...
			</div>
		);
	}

	return (
		<div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto bg-[#060d1b] custom-scrollbar relative">
			<div className="max-w-[1200px] w-full mx-auto space-y-6 pb-12">
				<div className="max-w-2xl mx-auto transition-all duration-700">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
							Compare profiles
						</span>
						<InfoTooltip tooltip={TOOLTIPS.compare.form} position="right" />
					</div>
					<ComparisonForm
						comparisonUsername={comparisonUsername}
						setComparisonUsername={setComparisonUsername}
						comparisonPlatform={comparisonPlatform}
						setComparisonPlatform={setComparisonPlatform}
						onFetch={fetchComparison}
						isLoading={isComparing}
					/>
				</div>

				{comparison && (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
						<div className="w-full relative">
							<div className="absolute top-3 right-3 z-10">
								<InfoTooltip
									tooltip={TOOLTIPS.compare.overview}
									position="left"
								/>
							</div>
							<ComparisonOverview
								match={comparison.match}
								tagSimilarity={comparison.tagSim}
								genreSimilarity={comparison.genreSim}
							/>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start lg:h-[750px]">
							<div className="w-full relative">
								<div className="absolute top-4 right-12 z-10">
									<InfoTooltip
										tooltip={TOOLTIPS.compare.genre_comparison}
										position="left"
									/>
								</div>
								<ComparisonGenres
									radarData={comparison.radarData}
									nameA="You"
									nameB={comparisonUsername.trim()}
								/>
							</div>

							<div className="flex flex-col gap-6 h-[800px] lg:h-full">
								<div className="flex-1 min-h-0 relative">
									<div className="absolute top-4 right-12 z-10">
										<InfoTooltip
											tooltip={TOOLTIPS.compare.shared_unique_tags}
											position="left"
										/>
									</div>
									<ComparisonShared
										sharedTags={comparison.sharedTags}
										uniqueA={comparison.uniqueA}
										uniqueB={comparison.uniqueB}
										nameA="You"
										nameB={comparisonUsername.trim()}
									/>
								</div>

								<div className="flex-1 min-h-0 relative">
									<div className="absolute top-4 right-12 z-10">
										<InfoTooltip
											tooltip={TOOLTIPS.compare.taste_difference}
											position="left"
										/>
									</div>
									<ComparisonDifference
										difference={comparison.difference}
										nameA="You"
										nameB={comparisonUsername.trim()}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
