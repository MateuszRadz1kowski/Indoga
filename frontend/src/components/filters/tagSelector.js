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
} from "../ui/combobox";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function TagsChoser({
	setTagsSwitchStatus,
	tagsSwitchStatus,
	updateFilter,
	filters,
}) {
	const tags = [
		"Supernatural",
		"Gore",
		"Shounen",
		"Military",
		"Psychological",
		"Seinen",
		"Mystery",
		"School",
		"Fantasy",
		"Male Protagonist",
		"Shoujo",
		"Romance",
		"Super Power",
		"Magic",
		"Slice of Life",
		"Tragedy",
		"Police",
		"Adventure",
		"Demons",
		"Cyberpunk",
		"Horror",
		"Historical",
		"Educational",
		"CGI",
		"Parody",
		"Kids",
		"Post-Apocalyptic",
		"Dystopian",
		"Ecchi",
		"Coming of Age",
		"Artificial Intelligence",
		"Space",
		"Violence",
		"Female Protagonist",
		"Detective",
		"Martial Arts",
		"Full CGI",
		"Harem",
		"Music",
		"Sadism",
		"Urban Fantasy",
		"Aliens",
		"Gender Bending",
		"Revenge",
		"Samurai",
		"Sports",
		"Love Triangle",
		"War",
		"Monsters",
		"Virtual World",
		"Mecha",
		"Survival",
		"Satire",
		"Crime",
		"Steampunk",
		"Episodic",
		"Philosophical",
		"Boys' Love",
		"Vampire",
		"Classic Literature",
		"Delinquents",
		"Thriller",
		"Mythology",
		"Achronological Order",
		"Robots",
		"Shoujo Ai",
		"Gods",
		"Body Horror",
		"Death Game",
		"Bisexual",
		"Yuri",
		"Work",
		"Terrorism",
		"Mafia",
		"Super Robot",
		"Guns",
		"Crossdressing",
		"Henshin",
		"Time Manipulation",
		"Family Life",
		"Memory Manipulation",
		"Assassins",
		"Animals",
		"Food",
		"Isekai",
		"Dark Fantasy",
		"Time Skip",
		"Politics",
		"School Club",
		"Surreal Comedy",
		"Tsundere",
		"Medicine",
		"Shounen Ai",
		"Amnesia",
		"Otaku Culture",
		"Video Games",
		"Philosophy",
		"Yandere",
		"Witch",
		"Incest",
		"Anti-Hero",
		"Ninja",
		"Reincarnation",
		"Office Lady",
		"Achromatic",
		"Real Robot",
		"Manga",
		"Youkai",
		"Dullahan",
		"Anthropomorphism",
		"BDSM",
		"Cyborg",
		"Trapped in a Video Game",
		"Board Game",
		"Zombie",
		"Fairy Tale",
		"Foreign",
		"Ghost",
		"Butler",
		"Josei",
		"Tanks",
		"Card Battle",
		"Elf",
		"Maid",
		"Kuudere",
		"Dragons",
		"College",
		"Chibi",
		"Primarily Adult Cast",
		"Cosplay",
		"Aviation",
		"Cars",
		"Idol",
		"Nun",
		"Werewolf",
		"Gynoid",
		"Twins",
		"Nudity",
		"Succubus",
		"Software Development",
		"Nekomusume",
		"Drawing",
		"Pirates",
		"Anachronism",
		"Photography",
		"Monster Girl",
		"Tokusatsu",
		"Space Opera",
		"Writing",
		"Travel",
		"Underworld",
		"Body Swapping",
		"Cult",
		"Fishing",
		"Crossover",
		"Religion",
		"Gambling",
		"Skeleton",
		"Air Force",
		"Fashion",
		"Agriculture",
		"Musical",
		"Ships",
		"Environmental",
		"Tereshchenko",
		"Age Gap",
		"Baseball",
		"Language Barrier",
		"Acting",
		"Calligraphy",
		"Surgery",
		"Swimming",
		"Dissociative Identities",
		"Exorcism",
		"Boxing",
		"Basketball",
		"Age Regression",
		"Bands",
		"Cycling",
		"Fairy",
		"Rugby",
		"Handball",
		"Stop Motion",
	];

	const availableTagsToShow = tags.filter(
		(tag) => !filters.hide_selected_tags?.includes(tag),
	);
	const availableTagsToHide = tags.filter(
		(tag) => !filters.show_selected_tags?.includes(tag),
	);

	return (
		<div className="space-y-4 p-1">
			<div className="flex items-center justify-between px-1">
				<Label
					htmlFor="showHideTag"
					className="text-[12px] text-slate-400 cursor-pointer"
				>
					{tagsSwitchStatus ? "Show" : "Hide"} selected tags
				</Label>
				<Switch
					checked={tagsSwitchStatus}
					onCheckedChange={() =>
						tagsSwitchStatus
							? setTagsSwitchStatus(false)
							: setTagsSwitchStatus(true)
					}
					id="showHideTag"
					className="data-[state=checked]:bg-violet-600 scale-75 origin-right"
				/>
			</div>

			<Combobox
				items={tagsSwitchStatus ? availableTagsToShow : availableTagsToHide}
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
				<ComboboxChips className="w-full bg-white/[0.02] border-white/[0.08] rounded-xl p-2 min-h-[44px] transition-all focus-within:border-violet-500/40 shadow-inner">
					<ComboboxValue>
						{(tagsSwitchStatus
							? filters.show_selected_tags
							: filters.hide_selected_tags
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
						placeholder="Search tags..."
						className="text-[11px] text-slate-200 placeholder:text-slate-600 bg-transparent border-none focus:ring-0"
					/>
				</ComboboxChips>
				<ComboboxContent className="bg-[#0f172a] border-white/[0.1] shadow-2xl max-h-60 overflow-hidden">
					<ComboboxEmpty className="text-xs text-slate-500 p-4">
						No tags found.
					</ComboboxEmpty>
					<ComboboxList className="custom-filters-scrollbar overflow-y-auto">
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
