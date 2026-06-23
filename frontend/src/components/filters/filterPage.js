"use client";

import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import TagsChoser from "./tagSelector";
import GenreChoser from "./genreSelector";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sparkles, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useToast } from "@/components/useToast";
import { parseApiError } from "@/components/ErrorBanner";
import { InfoTooltip } from "@/components/tooltip/TooltipSystem";
import { TOOLTIPS } from "@/components/tooltip/TooltipData";

function FilterSection({ label, tooltipKey, children }) {
	return (
		<div className="space-y-3 group/section">
			{label && (
				<div className="flex items-center gap-1.5">
					<p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] group-hover/section:text-violet-400/80 transition-colors duration-300">
						{label}
					</p>
					{tooltipKey && (
						<InfoTooltip
							tooltip={TOOLTIPS.filters[tooltipKey]}
							position="right"
						/>
					)}
				</div>
			)}
			<div className="relative">{children}</div>
		</div>
	);
}

const ERROR_MESSAGES = {
	user_not_found: { title: "User Not Found", type: "error" },
	private_profile: { title: "Private Profile", type: "warning" },
	empty_list: { title: "Empty Anime List", type: "warning" },
	server_error: { title: "Server Error", type: "error" },
	db_error: { title: "Database Unavailable", type: "error" },
	network_error: { title: "Connection Failed", type: "error" },
	rate_limit: { title: "Too Many Requests", type: "warning" },
};

const STREAMING_OPTIONS = [
	{ value: "Netflix", label: "Netflix" },
	{ value: "Crunchyroll", label: "Crunchyroll" },
	{ value: "Amazon Prime Video", label: "Prime Video" },
	{ value: "Max", label: "HBO Max" },
	{ value: "Hulu", label: "Hulu" },
	{ value: "Disney Plus", label: "Disney+" },
];

export default function FilterPage({
	apiData,
	onDataUpdate,
	onLoadingChange,
	onError,
	filters,
	setFilters,
}) {
	const { toast } = useToast();
	const [tagsSwitchStatus, setTagsSwitchStatus] = useState(true);
	const [genreSwitchStatus, setGenreSwitchStatus] = useState(true);
	const [cooldown, setCooldown] = useState(0);

	const defaultValues = {
		show_sequels: false,
		show_18_rated: true,
		tag_importance: "medium",
		popularity_importance: "medium",
		min_number_episodes: 1,
		max_number_episodes: 9999,
		min_release_year: 1900,
		max_release_year: new Date().getFullYear(),
		min_mean_score: 0,
		show_selected_studios: [],
		show_selected_tags: [],
		hide_selected_tags: [],
		show_selected_genres: [],
		hide_selected_genres: [],
		media_types: "TV",
		show_streaming_service: "All",
		show_planning: false,
		show_high_popularity: true,
	};

	const isFiltersDefault = Object.keys(defaultValues).every((key) => {
		const val = filters[key];

		if (val == null || val == undefined) return true;
		if (Array.isArray(val)) return val.length == 0;

		return val == defaultValues[key];
	});

	const disableClear =
		isFiltersDefault && tagsSwitchStatus == true && genreSwitchStatus == true;

	useEffect(() => {
		if (cooldown > 0) {
			const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [cooldown]);

	const updateFilter = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const handleCheckbox = (key, checked) => {
		updateFilter(key, checked == defaultValues[key] ? null : checked);
	};

	const handleApply = async () => {
		if (cooldown > 0) return;

		onLoadingChange(true);
		onError(null);
		setCooldown(5);

		try {
			const searchParams = new URLSearchParams();
			searchParams.append("username", localStorage.getItem("username") || "");
			searchParams.append("platform", localStorage.getItem("platform") || "");

			Object.entries(filters).forEach(([key, value]) => {
				if (value == null || value == undefined) return;
				if (Array.isArray(value)) {
					value.forEach((item) => {
						if (item) searchParams.append(key, item);
					});
				} else {
					searchParams.append(key, value);
				}
			});

			const apiUrl = new URL(
				"/recommendations_data/",
				process.env.NEXT_PUBLIC_API_URL,
			);
			const res = await fetch(`${apiUrl.href}?${searchParams.toString()}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				signal: AbortSignal.timeout(60000),
			});

			const data = await res.json();

			if (!res.ok) {
				const { code, message } = parseApiError(data);
				const config = ERROR_MESSAGES[code] || {
					title: "Error",
					type: "error",
				};
				toast({
					type: config.type,
					title: config.title,
					message: message || `Something went wrong (${code})`,
					duration: code == "rate_limit" ? 8000 : 6000,
				});
				onError({ code, message });
				onDataUpdate([]);
				return;
			}

			const results = Object.values(data);
			onDataUpdate(results);

			if (results.length == 0) {
				toast({
					type: "info",
					title: "No Results",
					message:
						"No anime matched your current filters. Try relaxing some constraints.",
					duration: 5000,
				});
			}
		} catch (error) {
			let code = "network_error";
			let message = "Could not reach the server. Check your connection.";

			if (error.name == "TimeoutError" || error.name == "AbortError") {
				code = "network_error";
				message = "The request timed out. The server might be busy.";
			} else if (error.message == "non_json_response") {
				code = "server_error";
				message = "Server returned an unexpected response.";
			}

			toast({
				type: "error",
				title: ERROR_MESSAGES[code]?.title || "Connection Failed",
				message,
				duration: 7000,
			});
			onError({ code, message });
			onDataUpdate([]);
		} finally {
			onLoadingChange(false);
		}
	};

	const handleClear = () => {
		setFilters({
			show_sequels: null,
			show_18_rated: null,
			tag_importance: null,
			popularity_importance: null,
			min_number_episodes: null,
			max_number_episodes: null,
			min_release_year: null,
			max_release_year: null,
			min_mean_score: 0,
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
		setTagsSwitchStatus(true);
		setGenreSwitchStatus(true);
	};

	useEffect(() => {
		if (!apiData || apiData.length == 0) {
			handleApply();
		}
	}, []);

	const toogleGroupItemClassName =
		"flex-1 h-8 text-[11px] font-medium capitalize rounded-lg border border-white/[0.05] " +
		"bg-white/[0.02] text-slate-400 " +
		"data-[state=on]:bg-violet-600 data-[state=on]:text-white " +
		"data-[state=on]:border-violet-400 data-[state=on]:shadow-[0_0_15px_rgba(139,92,246,0.3)] " +
		"hover:bg-white/[0.05] hover:text-slate-200 transition-all duration-300";

	const toggleStreamingItemClassName =
		"h-8 text-[11px] font-medium rounded-lg border border-white/[0.05] " +
		"bg-white/[0.02] text-slate-400 " +
		"data-[state=on]:bg-violet-600 data-[state=on]:text-white " +
		"data-[state=on]:border-violet-400 data-[state=on]:shadow-[0_0_15px_rgba(139,92,246,0.3)] " +
		"hover:bg-white/[0.05] hover:text-slate-200 transition-all duration-300 w-full";

	const toggleRows = [
		{
			key: "show_planning",
			label: "Show planning",
			id: "filter-planning",
			tooltipKey: "show_planning",
		},
		{
			key: "show_sequels",
			label: "Show sequels",
			id: "filter-sequels",
			tooltipKey: "show_sequels",
		},
		{
			key: "show_18_rated",
			label: "Show 18+ content",
			id: "filter-adult",
			tooltipKey: "show_18_rated",
		},
		{
			key: "show_high_popularity",
			label: `Show ${filters.media_types == "MANGA" ? "manga" : "anime"} with high popularity`,
			id: "filter-high-popularity",
			tooltipKey: "show_high_popularity",
		},
	];

	return (
		<div className="flex flex-col h-[calc(100vh-140px)] bg-gradient-to-b from-[#0a0f1d] to-[#060d1b] border-r border-white/[0.05] overflow-hidden relative">
			<div className="px-6 pt-6 pb-4 bg-gradient-to-b from-[#0a0f1d] to-transparent z-10">
				<h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2.5">
					<div className="p-1.5 rounded-md bg-violet-500/10 border border-violet-500/20">
						<Sparkles
							size={14}
							className="text-violet-400 animate-pulse-subtle"
						/>
					</div>
					Filters
				</h2>
			</div>

			<div className="flex-1 overflow-y-auto px-6 py-2 space-y-8 custom-filters-scrollbar pb-12">
				<FilterSection label="Media type" tooltipKey="media_types">
					<ToggleGroup
						type="single"
						variant="outline"
						value={filters.media_types ?? "TV"}
						onValueChange={(value) => {
							if (value) {
								setFilters((prev) => ({
									...prev,
									show_streaming_service: "All",
									media_types: value,
								}));
							}
						}}
						className="gap-2.5"
					>
						<ToggleGroupItem value="TV" className={toogleGroupItemClassName}>
							Anime
						</ToggleGroupItem>
						<ToggleGroupItem value="MANGA" className={toogleGroupItemClassName}>
							Manga
						</ToggleGroupItem>
					</ToggleGroup>
				</FilterSection>

				<Separator className="bg-white/[0.04] shadow-sm" />

				<FilterSection>
					<div className="space-y-1.5">
						{toggleRows.map(({ key, label, id, tooltipKey }) => (
							<div
								key={key}
								className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.03] transition-all duration-300 group"
							>
								<div className="flex items-center gap-1.5">
									<Label
										htmlFor={id}
										className="text-[12px] text-slate-400 group-hover:text-slate-200 cursor-pointer transition-colors"
									>
										{label}
									</Label>
									<InfoTooltip
										tooltip={TOOLTIPS.filters[tooltipKey]}
										position="right"
									/>
								</div>
								<Switch
									id={id}
									checked={filters[key] ?? defaultValues[key]}
									onCheckedChange={(checked) => handleCheckbox(key, checked)}
									className="data-[state=checked]:bg-violet-500 scale-90"
								/>
							</div>
						))}
					</div>
				</FilterSection>

				<FilterSection
					label="Popularity influence"
					tooltipKey="popularity_importance"
				>
					<ToggleGroup
						type="single"
						value={filters.popularity_importance ?? "medium"}
						onValueChange={(v) =>
							updateFilter("popularity_importance", v ? v : "medium")
						}
						className="gap-2"
					>
						{["low", "medium", "high"].map((level) => (
							<ToggleGroupItem
								key={level}
								value={level}
								className={toogleGroupItemClassName}
							>
								{level}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</FilterSection>

				<FilterSection
					label={
						filters.media_types == "MANGA" ? "Chapters Range" : "Episodes Range"
					}
					tooltipKey="episodes_range"
				>
					<div className="flex gap-3 flex-col">
						<Input
							type="number"
							placeholder="Min"
							value={filters.min_number_episodes ?? ""}
							min="0"
							onChange={(e) =>
								updateFilter(
									"min_number_episodes",
									e.target.value ? Number(e.target.value) : null,
								)
							}
							className="h-10 text-xs bg-white/3 border-white/8 focus:ring-1 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all rounded-lg"
						/>
						<Input
							type="number"
							placeholder="Max"
							value={filters.max_number_episodes ?? ""}
							min="0"
							onChange={(e) =>
								updateFilter(
									"max_number_episodes",
									e.target.value ? Number(e.target.value) : null,
								)
							}
							className="h-10 text-xs bg-white/3 border-white/8 focus:ring-1 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all rounded-lg"
						/>
					</div>
				</FilterSection>

				<FilterSection label="Release year" tooltipKey="release_year">
					<div className="flex gap-3 flex-col">
						<Input
							type="number"
							placeholder="From"
							value={filters.min_release_year ?? ""}
							min="0"
							onChange={(e) =>
								updateFilter(
									"min_release_year",
									e.target.value ? Number(e.target.value) : null,
								)
							}
							className="h-10 text-xs bg-white/3 border-white/8 focus:border-violet-500/50"
						/>
						<Input
							type="number"
							placeholder="To"
							value={filters.max_release_year ?? ""}
							min="0"
							onChange={(e) =>
								updateFilter(
									"max_release_year",
									e.target.value ? Number(e.target.value) : null,
								)
							}
							className="h-10 text-xs bg-white/3 border-white/8 focus:border-violet-500/50"
						/>
					</div>
				</FilterSection>

				<FilterSection
					label={`Min score: ${filters.min_mean_score ?? 0}%`}
					tooltipKey="min_score"
				>
					<div className="pt-2 px-1">
						<Slider
							max={100}
							step={1}
							value={[filters.min_mean_score ?? 0]}
							onValueChange={(e) =>
								updateFilter("min_mean_score", e[0] ? e[0] : null)
							}
							className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-violet-500 [&_.bg-primary]:bg-violet-500 [&_.bg-secondary]:bg-white/10"
						/>
					</div>
				</FilterSection>

				<FilterSection label="Tags Selection" tooltipKey="tags_selection">
					<div className="bg-white/[0.01] rounded-xl border border-white/[0.03] p-1 shadow-inner">
						<TagsChoser
							setTagsSwitchStatus={setTagsSwitchStatus}
							tagsSwitchStatus={tagsSwitchStatus}
							updateFilter={updateFilter}
							filters={filters}
						/>
					</div>
				</FilterSection>

				<FilterSection label="Genres Selection" tooltipKey="genres_selection">
					<div className="bg-white/[0.01] rounded-xl border border-white/[0.03] p-1 shadow-inner">
						<GenreChoser
							setGenreSwitchStatus={setGenreSwitchStatus}
							genreSwitchStatus={genreSwitchStatus}
							updateFilter={updateFilter}
							filters={filters}
						/>
					</div>
				</FilterSection>

				{(filters.media_types == "TV" || filters.media_types == null) && (
					<FilterSection
						label="Streaming Services"
						tooltipKey="streaming_services"
					>
						<ToggleGroup
							type="single"
							value={
								filters.show_streaming_service == "All"
									? ""
									: filters.show_streaming_service
							}
							onValueChange={(v) =>
								updateFilter("show_streaming_service", v ? v : "All")
							}
							className="grid grid-cols-3 gap-2"
						>
							{STREAMING_OPTIONS.map((option) => (
								<ToggleGroupItem
									key={option.value}
									value={option.value}
									className={toggleStreamingItemClassName}
								>
									{option.label}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</FilterSection>
				)}
			</div>

			<div className="flex-shrink-0 p-6 pb-8 bg-[#060d1b]/95 backdrop-blur-md border-t border-white/[0.08] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20">
				<div className="flex gap-3">
					<Button
						onClick={handleApply}
						disabled={cooldown > 0}
						className="flex-[2.5] h-11 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
					>
						<SlidersHorizontal size={14} />
						{cooldown > 0 ? `Wait ${cooldown}s...` : "Apply Filters"}
					</Button>
					<Button
						onClick={handleClear}
						variant="outline"
						disabled={disableClear}
						className="disabled:bg-slate-800 flex-1 h-11 border-white/10 bg-white/[20] hover:bg-white/[8] hover:border-white/[20] text-slate-400 rounded-xl transition-all duration-300"
					>
						<RotateCcw size={14} />
					</Button>
				</div>
			</div>
		</div>
	);
}
