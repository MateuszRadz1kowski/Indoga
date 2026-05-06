import { Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue } from "../ui/combobox";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function TagsChoser({ setTagsSwitchStatus, tagsSwitchStatus, updateFilter, filters }){
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
	"Stop Motion"
    ];

    	const availableTagsToShow = tags.filter(
		(tag) => !filters.hide_selected_tags.includes(tag),
	);
	const availableTagsToHide = tags.filter(
		(tag) => !filters.show_selected_tags.includes(tag),
	);


    return(
        <div>
			<Switch
				className="w-10 h-5"
				checked={tagsSwitchStatus}
				onCheckedChange={() =>
					tagsSwitchStatus
						? setTagsSwitchStatus(false)
						: setTagsSwitchStatus(true)
				}
				id="showHideTag"
			/>
			<Label htmlFor="showHideTag" className="ml-2 text-slate-300">
				Show or hide selected tags
			</Label>
			<Combobox
				items={
					tagsSwitchStatus ? availableTagsToShow : availableTagsToHide
				}
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
				<ComboboxChips className="w-full">
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
						placeholder="Filter by tags"
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
    )
}