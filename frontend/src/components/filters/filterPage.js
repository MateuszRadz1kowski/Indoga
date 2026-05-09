"use client";

import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { useEffect, useState } from "react";
import TagsChoser from "./tagSelector";
import GenreChoser from "./genreSelector";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// const studios = ["MAPPA", "Madhouse", "Wit Studio", "Ufotable", "Bones"];

export default function FilterPage({ onDataUpdate, onLoadingChange }) {
	const [tagsSwitchStatus, setTagsSwitchStatus] = useState(true);
	const [genreSwitchStatus, setGenreSwitchStatus] = useState(true);

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
	});

	const defaultValues = {
		show_sequels: true,
		experimental_mode: false,
		show_18_rated: true,
		tag_importance: "medium",
		popularity_importance: "medium",
		min_number_episodes: 1,
		max_number_episodes: 9999,
		min_release_year: 1900,
		max_release_year: new Date().getFullYear(),
		min_mean_score: 0,
		show_selected_studios: [],
		tags: [],
		genres: [],
		media_types: "TV",
		show_streaming_service: "All",
	};

	const updateFilter = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
		}));
		console.log("Updated filters:", { ...filters, [key]: value });
	};

	const handleCheckbox = (key, checked) => {
		if (checked == defaultValues[key]) {
			updateFilter(key, null);
		} else {
			updateFilter(key, checked);
		}
	};

	const handleApply = async () => {
		onLoadingChange(true);
		try {
			const searchParams = new URLSearchParams();
			searchParams.append("username", localStorage.getItem("username"));
			searchParams.append("platform", localStorage.getItem("platform"));
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

			const queryString = searchParams.toString();
			console.log("Wysyłam do API:", queryString);

			const res = await fetch(
				`http://127.0.0.1:8000/recommendations_data?${queryString}`,
			);

			const data = await res.json();
			onDataUpdate(Object.values(data));
		} catch (error) {
			console.error("Error fetching recommendations:", error);
		} finally {
			onLoadingChange(false);
		}
	};

	const handleClear = () => {
		setFilters({
			show_sequels: null,
			experimental_mode: null,
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
			show_streaming_service: "All",
		});
		setTagsSwitchStatus(true);
		setGenreSwitchStatus(true);
	};

	useEffect(() => {
		handleApply();
	}, []);

	return (
		<div className="text-white space-y-4">
			{" "}
			<div className="bg-linear-to-br from-purple-600 via-40% via-transparent to-transparent">
				<h1 className="text-2xl font-semibold mb-4 bg-linear-to-tr from-purple-600 via-50% via-transparent to-transparent">
					Filters
				</h1>
			</div>
			<div className="flex gap-3 mb-6 sticky top-0 bg-[#0b1120] py-2 z-10">
				<Button
					onClick={handleApply}
					className="bg-purple-600 hover:bg-purple-500"
				>
					Apply Filters
				</Button>

				<Button
					onClick={handleClear}
					variant="outline"
					className="border-slate-700 text-slate-200 hover:bg-slate-800"
				>
					Clear Filters
				</Button>
			</div>
			<div className="space-y-6">
				<Card className="bg-[#0f172a] border border-slate-800 p-6 space-y-4">
					<div className="flex items-center gap-3">
						<Checkbox
							checked={filters.show_sequels ?? defaultValues.show_sequels}
							onCheckedChange={(checked) =>
								handleCheckbox("show_sequels", checked)
							}
							id="sequels"
						/>
						<Label htmlFor="sequels" className={"text-gray-300"}>
							Show sequels
						</Label>
					</div>

					<div className="flex items-center gap-3">
						<Checkbox
							checked={
								filters.experimental_mode ?? defaultValues.experimental_mode
							}
							onCheckedChange={(checked) =>
								handleCheckbox("experimental_mode", checked)
							}
							id="experimental"
						/>
						<Label htmlFor="experimental" className={"text-gray-300"}>
							Experimental mode
						</Label>
					</div>

					<div className="flex items-center gap-3">
						<Checkbox
							checked={filters.show_18_rated ?? defaultValues.show_18_rated}
							onCheckedChange={(checked) =>
								handleCheckbox("show_18_rated", checked)
							}
							id="adult+"
						/>
						<Label htmlFor="adult+" className={"text-gray-300"}>
							Show 18+ rated
						</Label>
					</div>
				</Card>

				<div className="mt-6 bg-[#0f172a] border border-slate-800 px-6 py-4 gap-8">
					{/* <div className="space-y-2">
						<Label className="text-slate-400 text-xs uppercase tracking-wider flex items-center gap-2">
							Tag Importance
						</Label>
						<ToggleGroup
							type="single"
							variant="outline"
							value={filters.tag_importance ?? "medium"}
							onValueChange={(value) => {
								if (value) updateFilter("tag_importance", value);
							}}
							className="justify-start gap-2"
						>
							{["low", "medium", "high"].map((influenceLevel) => (
								<ToggleGroupItem
									key={influenceLevel}
									value={influenceLevel}
									className="flex-1 bg-slate-900/50 border-slate-700/50 text-slate-400 data-[state=on]:bg-purple-600 data-[state=on]:text-white data-[state=on]:border-purple-500 hover:bg-slate-800 transition-all capitalize"
								>
									{influenceLevel}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</div> */}

					<div className="space-y-2">
						<Label className="text-slate-400 text-xs uppercase tracking-wider flex items-center gap-2">
							Popularity Influence
						</Label>
						<ToggleGroup
							type="single"
							variant="outline"
							value={filters.popularity_importance ?? "medium"}
							onValueChange={(value) => {
								if (value) updateFilter("popularity_importance", value);
							}}
							className="justify-start gap-2"
						>
							{["low", "medium", "high"].map((influenceLevel) => (
								<ToggleGroupItem
									key={influenceLevel}
									value={influenceLevel}
									className="flex-1 bg-slate-900/50 border-slate-700/50 text-slate-400 data-[state=on]:bg-purple-600 data-[state=on]:text-white data-[state=on]:border-purple-500 hover:bg-slate-800 transition-all capitalize"
								>
									{influenceLevel}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</div>
				</div>

				<Card className="mt-6 bg-[#0f172a] border border-slate-800 p-6 space-y-4">
					<Input
						type="number"
						placeholder={
							filters.media_types == "TV"
								? "minimum episodes"
								: "minimum chapters"
						}
						value={filters.min_number_episodes ?? ""}
						className="bg-slate-900 border-slate-700 text-slate-100"
						min="0"
						onChange={(e) =>
							updateFilter(
								"min_number_episodes",
								e.target.value ? Number(e.target.value) : null,
							)
						}
					/>

					<Input
						type="number"
						placeholder={
							filters.media_types == "TV"
								? "maximum episodes"
								: "maximum chapters"
						}
						value={filters.max_number_episodes ?? ""}
						className="bg-slate-900 border-slate-700 text-slate-100"
						min="0"
						onChange={(e) =>
							updateFilter(
								"max_number_episodes",
								e.target.value ? Number(e.target.value) : null,
							)
						}
					/>
				</Card>

				<Card className="mt-6 bg-[#0f172a] border border-slate-800 p-6 space-y-4">
					<div>
						<Input
							type="number"
							placeholder="Minimum release year"
							className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
							min="1970"
							max="2026"
							value={filters.min_release_year ?? ""}
							onChange={(e) =>
								updateFilter(
									"min_release_year",
									e.target.value ? Number(e.target.value) : null,
								)
							}
						/>
						<Input
							type="number"
							placeholder="Maximum release year"
							className="mt-3 bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
							min="1970"
							value={filters.max_release_year ?? ""}
							onChange={(e) =>
								updateFilter(
									"max_release_year",
									e.target.value ? Number(e.target.value) : null,
								)
							}
						/>
					</div>
				</Card>

				<Card className="mt-6 bg-[#0f172a] border border-slate-800 text-slate-100 p-6 space-y-6">
					<div>
						<Label className="mb-2 text-slate-300">
							Show items with mean score at least:{" "}
							{filters.min_mean_score ?? defaultValues.min_mean_score}
						</Label>
						<Slider
							defaultValue={[75]}
							max={100}
							step={1}
							value={[filters.min_mean_score]}
							className="w-full"
							onValueChange={(e) =>
								updateFilter("min_mean_score", e[0] ? e[0] : null)
							}
						/>
					</div>

					{/* <div>
						<Combobox
							items={studios}
							multiple
							value={filters.show_selected_studios ?? []}
							onValueChange={(value) =>
								updateFilter("show_selected_studios", value)
							}
						>
							<ComboboxChips>
								<ComboboxValue>
									{filters.show_selected_studios.map((item) => (
										<ComboboxChip key={item}>{item}</ComboboxChip>
									))}
								</ComboboxValue>

								<ComboboxChipsInput
									placeholder="Filter by studio"
									className="bg-slate-900 border-slate-700 text-slate-100"
								/>
							</ComboboxChips>

							<ComboboxContent>
								<ComboboxEmpty>No studio found.</ComboboxEmpty>
								<ComboboxList>
									{(item) => (
										<ComboboxItem key={item} value={item}>
											{item}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					</div> */}

					<TagsChoser
						setTagsSwitchStatus={setTagsSwitchStatus}
						tagsSwitchStatus={tagsSwitchStatus}
						updateFilter={updateFilter}
						filters={filters}
					/>

					<GenreChoser
						setGenreSwitchStatus={setGenreSwitchStatus}
						genreSwitchStatus={genreSwitchStatus}
						updateFilter={updateFilter}
						filters={filters}
					/>

					{/* <Select
						value={filters.media_types ?? ""}
						onValueChange={(value) =>
							setFilters((prev) => ({
								...prev,
								media_types: value,
							}))
						}
					>
						<SelectTrigger className="w-full bg-slate-900 border-slate-700 text-slate-100">
							<SelectValue placeholder="Select media type" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="TV">Anime</SelectItem>
								<SelectItem value="MANGA">Manga</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select> */}

					<div className="space-y-2">
						<Label className="text-slate-400 text-xs uppercase tracking-wider flex items-center gap-2">
							Select Media Type
						</Label>

						<ToggleGroup
							type="single"
							variant="outline"
							value={filters.media_types ?? "TV"}
							onValueChange={(value) => {
								if (value) {
									setFilters((prev) => ({
										...prev,
										media_types: value,
									}));
								}
							}}
							className="justify-start gap-2"
						>
							<ToggleGroupItem
								value="TV"
								className="flex-1 bg-slate-900/50 border-slate-700/50 text-slate-400 data-[state=on]:bg-purple-600 data-[state=on]:text-white data-[state=on]:border-purple-500 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200 shadow-inner"
							>
								Anime
							</ToggleGroupItem>

							<ToggleGroupItem
								value="MANGA"
								className="flex-1 bg-slate-900/50 border-slate-700/50 text-slate-400 data-[state=on]:bg-purple-600 data-[state=on]:text-white data-[state=on]:border-purple-500 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200 shadow-inner"
							>
								Manga
							</ToggleGroupItem>
						</ToggleGroup>
					</div>

					{filters.media_types == "TV" ||
						(filters.media_types == null && (
							<div className="space-y-2">
								<Label className="text-slate-400 text-xs uppercase tracking-wider">
									Avalible on streaming Services
								</Label>
								<ToggleGroup
									type="single"
									variant="outline"
									value={filters.show_streaming_service ?? ""}
									onValueChange={(value) => {
										updateFilter(
											"show_streaming_service",
											value == "All" ? null : value,
										);
									}}
									className="justify-start gap-2"
								>
									<ToggleGroupItem
										value="Netflix"
										className="flex-1 bg-slate-900 border-slate-700 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-slate-800"
									>
										Netflix
									</ToggleGroupItem>
									<ToggleGroupItem
										value="Crunchyroll"
										className="flex-1 bg-slate-900 border-slate-700 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-slate-800"
									>
										Crunchyroll
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
						))}
					{/* <Button onClick={() => console.log(filters)}>show</Button> */}
				</Card>
			</div>
		</div>
	);
}
