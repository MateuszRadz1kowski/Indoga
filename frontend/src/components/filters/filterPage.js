"use client";

import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
} from "@/components/ui/combobox";
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

export default function FilterPage({ onDataUpdate }) {
	const [tagsSwitchStatus, setTagsSwitchStatus] = useState(true);
	const [genreSwitchStatus, setGenreSwitchStatus] = useState(true);

	const tags = [
		"Psychological",
		"Time Travel",
		"Tragedy",
		"Military",
		"Romance",
	];

	const genres = ["Action", "Drama", "Fantasy", "Sci-Fi", "Mystery"];

	const studios = ["MAPPA", "Madhouse", "Wit Studio", "Ufotable", "Bones"];

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
		media_types: ["Anime", "Movie", "OVA"],
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
		const params = Object.fromEntries(
			Object.entries(filters).filter(([_, value]) => value !== null),
		);

		const queryString = new URLSearchParams(params).toString();
		console.log("Wysyłam do API:", queryString);

		const res = await fetch(
			`http://127.0.0.1:8000/recommendations_data?${queryString}`,
		);

		const data = await res.json();

		onDataUpdate(Object.values(data));
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
			min_mean_score: null,
			show_selected_studios: [],
			show_selected_tags: [],
			hide_selected_tags: [],
			show_selected_genres: [],
			hide_selected_genres: [],
			media_types: null,
		});
	};

	useEffect(() => {
		handleApply();
	}, []);

	return (
		<div className="min-h-screen bg-[#0b1120] text-white p-6">
			<h1 className="text-2xl font-semibold mb-4">Filters</h1>

			<div className="flex gap-3 mb-6">
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

			<Card className="bg-[#0f172a] border border-slate-800 p-6 space-y-4">
				<div className="flex items-center gap-3">
					<Checkbox
						checked={filters.show_sequels ?? defaultValues.show_sequels}
						onCheckedChange={(checked) =>
							handleCheckbox("show_sequels", checked)
						}
					/>
					<Label>Show sequels</Label>
				</div>

				<div className="flex items-center gap-3">
					<Checkbox
						checked={
							filters.experimental_mode ?? defaultValues.experimental_mode
						}
						onCheckedChange={(checked) =>
							handleCheckbox("experimental_mode", checked)
						}
					/>
					<Label>Experimental mode</Label>
				</div>

				<div className="flex items-center gap-3">
					<Checkbox
						checked={filters.show_18_rated ?? defaultValues.show_18_rated}
						onCheckedChange={(checked) =>
							handleCheckbox("show_18_rated", checked)
						}
					/>
					<Label>Show 18+ rated</Label>
				</div>
			</Card>

			<Card className="mt-6 bg-[#0f172a] border border-slate-800 p-6 space-y-4">
				<div>
					<Select
						value={filters.tag_importance ?? ""}
						onValueChange={(value) => updateFilter("tag_importance", value)}
					>
						<SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
							<SelectValue placeholder="Tag Importance" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="low">Low</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="high">High</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Select
						value={filters.popularity_importance ?? ""}
						onValueChange={(value) =>
							updateFilter("popularity_importance", value)
						}
					>
						<SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
							<SelectValue placeholder="Popularity Influence" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="low">Low</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="high">High</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</Card>

			<Card className="mt-6 bg-[#0f172a] border border-slate-800 p-6 space-y-4">
				<Input
					type="number"
					placeholder="Minimum episodes"
					className="bg-slate-900 border-slate-700 text-slate-100"
					onChange={(e) =>
						updateFilter(
							"min_number_episodes",
							e.target.value ? Number(e.target.value) : null,
						)
					}
				/>

				<Input
					type="number"
					placeholder="Maximum episodes"
					className="bg-slate-900 border-slate-700 text-slate-100"
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
						placeholder="Minimum release year (e.g. 2005)"
						className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
						onChange={(e) =>
							updateFilter(
								"min_release_year",
								e.target.value ? Number(e.target.value) : null,
							)
						}
					/>
					<Input
						type="number"
						placeholder="Maximum release year (e.g. 2023)"
						className="mt-3 bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
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
						className="w-full"
						onValueChange={(e) =>
							updateFilter("min_mean_score", e[0] ? e[0] : null)
						}
					/>
				</div>

				<div>
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
				</div>

				<div>
					<Switch
						className="w-10 h-5"
						checked={tagsSwitchStatus}
						onCheckedChange={() =>
							tagsSwitchStatus
								? setTagsSwitchStatus(false)
								: setTagsSwitchStatus(true)
						}
					/>
					<Label className="ml-2 text-slate-300">
						Show or hide selected tags
					</Label>

					<Combobox
						items={tags}
						multiple
						value={
							tagsSwitchStatus
								? (filters.show_selected_tags ?? [])
								: (filters.hide_selected_tags ?? [])
						}
						onValueChange={(value) =>
							tagsSwitchStatus
								? updateFilter("show_selected_tags", value)
								: updateFilter("hide_selected_tags", value)
						}
					>
						<ComboboxChips>
							<ComboboxValue>
								{tagsSwitchStatus
									? filters.show_selected_tags.map((item) => (
											<ComboboxChip key={item}>{item}</ComboboxChip>
										))
									: filters.hide_selected_tags.map((item) => (
											<ComboboxChip key={item}>{item}</ComboboxChip>
										))}
							</ComboboxValue>

							<ComboboxChipsInput
								placeholder="Filter by studio"
								className="bg-slate-900 border-slate-700 text-slate-100"
							/>
						</ComboboxChips>

						<ComboboxContent>
							<ComboboxEmpty>No tags found.</ComboboxEmpty>
							<ComboboxList>
								{(item) => (
									<ComboboxItem key={item} value={item}>
										{item}
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
				</div>

				<div>
					<Switch
						className="w-10 h-5"
						checked={genreSwitchStatus}
						onCheckedChange={() =>
							genreSwitchStatus
								? setGenreSwitchStatus(false)
								: setGenreSwitchStatus(true)
						}
					/>
					<Label className="ml-2 text-slate-300">
						Show or hide selected genres
					</Label>

					<Combobox
						items={genres}
						multiple
						value={
							genreSwitchStatus
								? (filters.show_selected_genres ?? [])
								: (filters.hide_selected_genres ?? [])
						}
						onValueChange={(value) =>
							genreSwitchStatus
								? updateFilter("show_selected_genres", value)
								: updateFilter("hide_selected_genres", value)
						}
					>
						<ComboboxChips>
							<ComboboxValue>
								{genreSwitchStatus
									? filters.show_selected_genres.map((item) => (
											<ComboboxChip key={item}>{item}</ComboboxChip>
										))
									: filters.hide_selected_genres.map((item) => (
											<ComboboxChip key={item}>{item}</ComboboxChip>
										))}
							</ComboboxValue>

							<ComboboxChipsInput
								placeholder="Filter by studio"
								className="bg-slate-900 border-slate-700 text-slate-100"
							/>
						</ComboboxChips>

						<ComboboxContent>
							<ComboboxEmpty>No genres found.</ComboboxEmpty>
							<ComboboxList>
								{(item) => (
									<ComboboxItem key={item} value={item}>
										{item}
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
				</div>
				<div>
					<Select
						value={filters.media_types?.[0]}
						onValueChange={(value) =>
							setFilters((prev) => ({
								...prev,
								media_types: [value],
							}))
						}
					>
						<SelectTrigger className="w-[200px] bg-slate-900 border-slate-700 text-slate-100">
							<SelectValue placeholder="Select media type" />
						</SelectTrigger>

						<SelectContent>
							<SelectGroup>
								<SelectItem value="anime">Anime</SelectItem>
								<SelectItem value="manga">Manga</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button onClick={() => console.log(filters)}>show</Button>
				</div>
			</Card>
		</div>
	);
}
