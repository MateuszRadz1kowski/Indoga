export const TOOLTIPS = {
	filters: {
		media_types: {
			title: "Media Type",
			description:
				"Switch between searching for Anime (TV, TV_short, movies, OVA, ONA, special, music) or Manga (manga, light novels, one-shots).",
		},
		show_planning: {
			title: "Show Planning",
			description:
				"Toggle whether to include titles from your 'Plan to Watch/Read' list. By default, these are hidden to keep your recommendations focused purely on new discoveries",
		},
		show_sequels: {
			title: "Show Sequels",
			description:
				"When disabled, sequels are filtered out so you only see standalone titles or first entries in a series. Please note that its not possible to detect a sequel with 100% accuracy, so there may be some wrong exclusions/inclusions",
		},
		show_18_rated: {
			title: "Show 18+ Content",
			description:
				"Toggle adult-rated titles. Disable to keep results family-friendly. Enabling shows all content regardless of age rating.",
		},
		show_high_popularity: {
			title: "Show High Popularity",
			description:
				"Disable to filter out mainstream mega-hits (titles with high popularity and favorites), surfacing lesser-known gems that are more uniquely tailored to your taste profile",
		},
		popularity_importance: {
			title: "Popularity Influence",
			description:
				"Adjusts how heavily a title's popularity impacts its rank. 'Low' gives niche titles a slight boost, 'High' prioritizes mainstream hits, and 'Medium' strikes a balance. Note: This reorders your results without filtering any titles out.",
		},
		episodes_range: {
			title: "Episodes / Chapters Range",
			description:
				"Filter by episode/chapter count. Set a minimum and maximum range to find short series, long-runners, or anything in between.",
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
				"Use the switch to toggle between 'Show' and 'Hide' modes. 'Show' includes only titles containing all selected tags, while 'Hide' filters out any titles that have them. This is highly effective when searching for something specific.",
		},
		genres_selection: {
			title: "Genres Selection",
			description:
				"Use the switch to toggle between 'Show' and 'Hide' modes. 'Show' includes only titles containing all selected genres, while 'Hide' filters out any titles that have them. This is highly effective when searching for something specific.",
		},
		streaming_services: {
			title: "Streaming Services",
			description:
				"Filter recommendations by your preferred streaming platforms. When disabled, all titles are shown regardless of where they stream. Please note: Netflix uses regional locks, so availability may vary depending on your country.",
		},
	},
	toolbar: {
		match_percent: {
			title: "Match %",
			description:
				"Sorts your results based on how closely each title aligns with your unique taste profile. High match percentages represent your top recommendations.",
		},
		score: {
			title: "Community Score",
			description:
				"Sorts by average community rating. Perfect for quickly finding the most critically acclaimed and highly-rated titles among your matches.",
		},
		popularity: {
			title: "Popularity",
			description:
				"Sorts by total community engagement. Use this to surface the most widely watched mainstream hits.",
		},
		year: {
			title: "Release Year",
			description:
				"Sorts by broadcast or publication year. Toggle the sort direction to easily switch between vintage classics and modern releases.",
		},
	},

	stats: {
		favourite_genres: {
			title: "Favorite Genres",
			description:
				"Shows the genres you engage with most based on your scores, repeat watches, and other factors. The progress bars show your weighted affinity, while the percentage represents the exact share of your overall taste profile driven by this genre.",
		},
		favourite_tags: {
			title: "Favourite Tags",
			description:
				"Shows the tags you engage with most based on your scores, repeat watches, and other factors. The progress bars show your weighted affinity, while the percentage represents the exact share of your overall taste profile driven by this tag.",
		},
		watched_timeline: {
			title: "Watched Timeline",
			description:
				"A chronological archive of your completed titles, organized by decade and release year. Scroll horizontally to explore each year, and click any card to view its detailed page.",
		},
		hot_takes: {
			title: "Hot Takes",
			description:
				"Displays titles where your personal rating deviates most from the community average. A positive difference highlights hidden gems you loved more than the consensus, while a negative one shows mainstream titles you found overhyped.",
		},
	},

	compare: {
		form: {
			title: "Compare Profiles",
			description:
				"Enter any AniList or MyAnimeList username to compare taste profiles. This measures the compatibility between your currently logged-in account and the selected profile.",
		},
		overview: {
			title: "Match Overview",
			description:
				"The overall compatibility score (0–100%) is a weighted average of your tag and genre similarities. A higher score means your tastes are closely aligned, with the breakdown showing each aspect's contribution.",
		},
		shared_unique_tags: {
			title: "Shared & Unique Tags",
			description:
				"A side-by-side comparison of your preferences. 'Shared' displays mutual favorite tags that you both enjoy, while 'Unique' highlights distinct interests found exclusively on only one of your profiles. The percentage represents the exact share of that user's overall taste profile occupied by the tag (calculated from scores, repeat watches, and others), showing how heavily it defines their individual preferences.",
		},
		taste_difference: {
			title: "Taste Difference",
			description:
				"Highlights the tags where your preferences diverge the most. The bars extend left and right from the center line to show who dominates each interest; a longer bar indicates a stronger, more one-sided preference for that specific tag.",
		},
		genre_comparison: {
			title: "Genre Comparison",
			description:
				"Maps and compares your genre affinities. The percentages represent each genre's exact share of that user's overall taste profile (calculated from scores, rewatches, and more). The bars show the strength of each preference, while overlapping sections highlight your mutual sweet spots.",
		},
	},
};
