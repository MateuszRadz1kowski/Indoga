import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
} from "../ui/combobox";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function GenreChoser({
	setGenreSwitchStatus,
	genreSwitchStatus,
	updateFilter,
	filters,
}) {
	const genres = [
		"Action",
		"Adventure",
		"Comedy",
		"Drama",
		"Ecchi",
		"Fantasy",
		"Horror",
		"Mahou Shoujo",
		"Mecha",
		"Music",
		"Mystery",
		"Psychological",
		"Romance",
		"Sci-Fi",
		"Slice of Life",
		"Sports",
		"Supernatural",
		"Thriller",
	];

	const availableGenresToShow = genres.filter(
		(g) => !filters.hide_selected_genres.includes(g),
	);
	const availableGenresToHide = genres.filter(
		(g) => !filters.show_selected_genres.includes(g),
	);

	return (
		<div>
			<Switch
				className="w-10 h-5"
				checked={genreSwitchStatus}
				onCheckedChange={() =>
					genreSwitchStatus
						? setGenreSwitchStatus(false)
						: setGenreSwitchStatus(true)
				}
				id="showHideGenre"
			/>
			<Label htmlFor="showHideGenre" className="ml-2 text-slate-300">
				{genreSwitchStatus ? "Show" : "Hide"} selected genres
			</Label>
			<Combobox
				items={
					genreSwitchStatus ? availableGenresToShow : availableGenresToHide
				}
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
						placeholder="Filter by genre"
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
	);
}
