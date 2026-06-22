"use client";

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
	useComboboxAnchor,
} from "../ui/combobox";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const GENRES = [
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

export default function GenreChoser({
	setGenreSwitchStatus,
	genreSwitchStatus,
	updateFilter,
	filters,
}) {
	const anchorRef = useComboboxAnchor();

	const availableGenresToShow = GENRES.filter(
		(g) => !filters.hide_selected_genres?.includes(g),
	);
	const availableGenresToHide = GENRES.filter(
		(g) => !filters.show_selected_genres?.includes(g),
	);

	return (
		<div className="space-y-4 p-1" ref={anchorRef}>
			<div className="flex items-center justify-between px-1">
				<Label
					htmlFor="showHideGenre"
					className="text-[12px] text-slate-400 cursor-pointer"
				>
					{genreSwitchStatus ? "Show only" : "Hide all"} selected genres
				</Label>
				<Switch
					checked={genreSwitchStatus}
					onCheckedChange={() =>
						genreSwitchStatus
							? setGenreSwitchStatus(false)
							: setGenreSwitchStatus(true)
					}
					id="showHideGenre"
					className="data-[state=checked]:bg-violet-600 scale-75 origin-right"
				/>
			</div>

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
				<ComboboxChips className="w-full bg-white/[0.02] border-white/[0.08] rounded-xl p-2 min-h-[44px] transition-all focus-within:border-violet-500/40">
					<ComboboxValue>
						{(genreSwitchStatus
							? filters.show_selected_genres
							: filters.hide_selected_genres
						)?.map((item) => (
							<ComboboxChip
								key={item}
								className={
									"bg-violet-500/10 border-violet-500/30 text-violet-300 hover:bg-violet-500/20 transition-colors"
								}
							>
								{item}
							</ComboboxChip>
						))}
					</ComboboxValue>
					<ComboboxChipsInput
						placeholder="Search genres..."
						className="text-[11px] text-white placeholder:text-slate-400 bg-transparent border-none focus:ring-0"
					/>
				</ComboboxChips>
				<ComboboxContent
					anchor={anchorRef}
					className="bg-[#0f172a] border-white/[0.1] shadow-2xl"
				>
					<ComboboxEmpty className="text-xs text-slate-500 p-4">
						No genres found.
					</ComboboxEmpty>
					<ComboboxList className="custom-filters-scrollbar">
						{(item) => (
							<ComboboxItem
								key={item}
								value={item}
								className="text-xs text-slate-300 data-[highlighted]:bg-violet-500/20 data-[highlighted]:text-violet-200 cursor-pointer"
							>
								{item}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		</div>
	);
}
