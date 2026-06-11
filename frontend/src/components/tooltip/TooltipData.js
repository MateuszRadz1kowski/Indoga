export const TOOLTIPS = {
	filters: {
		media_types: {
			title: "Media Type",
			description:
				"Switch between Anime (TV, TV_short, movies, OVA, ONA, special, music ) and Manga (manga, light novels, one-shots).",
		},
		show_planning: {
			title: "Show Planning",
			description:
				"Include titles from your 'Plan to Watch/Read' list in the recommendations. By default these are hidden so you see only fresh discoveries.",
		},
		show_sequels: {
			title: "Show Sequels",
			description:
				"When disabled, sequels are filtered out — you'll only see standalone titles or first entries in a series. Be wary that its not possible to detect a sequel with 100% accuracy, so there may be some wrong exclusions/inclusions",
		},
		show_18_rated: {
			title: "Show 18+ Content",
			description:
				"Toggle adult-rated titles. Disable to keep results family-friendly. Enabling shows all content regardless of age rating.",
		},
		show_high_popularity: {
			title: "Show High Popularity",
			description:
				"When disabled, mainstream mega-hits (very high popularity + favourites) are filtered out, surfacing less popular titles that better match your taste profile.",
		},
		popularity_importance: {
			title: "Popularity Influence",
			description:
				"Controls how much a title's popularity affects its ranking. 'Low' slightly boosts niche anime, 'High' favours well-known titles, 'Medium' balances both. Note: This doesn't filter out titles, just adjusts their position in the results.",
		},
		episodes_range: {
			title: "Episodes / Chapters Range",
			description:
				"Filter by episode/chapter count. Set a minimum and maximum rangeto find short series, long-runners, or anything in between.",
		},
		release_year: {
			title: "Release Year",
			description:
				"Filter by release year. Set a minimum and maximum year to find titles from a specific era.",
		},
		min_score: {
			title: "Minimum Community Score",
			description:
				"Only show titles rated at or above mean score by the community on AniList. Set to 0 to include all titles regardless of score.",
		},
		tags_selection: {
			title: "Tags Selection",
			description:
				"Use the toggle to switch between 'Show' and 'Hide' mode. In Show mode, only titles containing all selected tags appear. In Hide mode, titles with any of the selected tags are excluded.",
		},
		genres_selection: {
			title: "Genres Selection",
			description:
				"Use the toggle to switch between 'Show' and 'Hide' mode. In Show mode, only titles containing all selected genres appear. In Hide mode, titles with any of the selected genres are excluded.",
		},
		streaming_services: {
			title: "Streaming Services",
			description:
				"Filter recommendations to titles available on your preferred streaming platforms. When disabled, it shows everything regardless of availability. Note: Many Netflix titles are region-locked and may not be available in your country.",
		},
	},

	toolbar: {
		match_percent: {
			title: "Match %",
			description:
				"Sorts by how closely a title aligns with your personal taste profile — calculated using cosine similarity between your tag/genre preferences and the anime's profile. Higher = better match.",
		},
		score: {
			title: "Community Score",
			description:
				"Sorts by the average community rating on AniList (0–100). Use this to surface the most critically acclaimed titles in your recommendations.",
		},
		popularity: {
			title: "Popularity",
			description:
				"Sorts by how many users have this title in their list. Higher popularity means more people have watched/read it.",
		},
		year: {
			title: "Release Year",
			description:
				"Sorts by the year the title aired or was published. Use ascending to find oldest titles, descending for the most recent.",
		},
	},

	stats: {
		favourite_genres: {
			title: "Favourite Genres",
			description:
				"Shows the genres you engage with most based on your scores, repeat watches, and favourites. The bars represent your weighted affinity — higher means you consistently enjoy this genre.",
		},
		favourite_tags: {
			title: "Favourite Tags",
			description:
				"Your top content tags derived from everything you've rated. Tags are weighted by how often they appear in titles you love, adjusted for tag rarity — so a niche tag you love scores higher than a common one.",
		},
		watched_timeline: {
			title: "Watched Timeline",
			description:
				"A visual archive of your completed titles organised by the decade and year they aired. Scroll horizontally within each year to browse titles. Click any card to open it on AniList.",
		},
		hot_takes: {
			title: "Hot Takes",
			description:
				"Titles where your personal score differs most from the community average. A positive difference means you rated it higher than most; negative means you're a harsh critic for that title.",
		},
	},

	compare: {
		form: {
			title: "Compare Profiles",
			description:
				"Enter any AniList or MyAnimeList username to compare taste profiles. The comparison is based on tag and genre vectors — no data is shared with the other user.",
		},
		overview: {
			title: "Match Overview",
			description:
				"The overall compatibility score (0–100%) is a weighted average of tag similarity (70%) and genre similarity (30%). Soulmates share deep tag-level preferences, not just broad genre tastes.",
		},
		shared_unique_tags: {
			title: "Shared & Unique Tags",
			description:
				"Shared tags appear in both profiles — the bars show each person's affinity strength. Unique tags exist in only one profile, revealing what makes each taste distinct.",
		},
		taste_difference: {
			title: "Taste Difference",
			description:
				"The tags where your preferences diverge most. The side with the larger bar is the person who favours that tag more strongly. Longer bars = stronger preference difference.",
		},
		genre_comparison: {
			title: "Genre Comparison",
			description:
				"A radar chart mapping genre affinities for both users. Each axis is a genre; the further from the centre, the stronger the preference. Overlapping areas indicate shared taste.",
		},
	},
};
