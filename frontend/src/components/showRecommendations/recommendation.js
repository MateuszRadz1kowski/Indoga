"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Star,
	ExternalLink,
	Play,
	Info,
	Calendar,
	Building2,
	Activity,
} from "lucide-react";
function ExternalLinkButton({ href, children, className = "" }) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={`inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500
				hover:text-slate-200 transition-colors uppercase tracking-widest ${className}`}
		>
			{children}
		</a>
	);
}

function Why_recommend_Tags({ why_recommended }) {
	const entries = Object.entries(why_recommended || {});

	if (entries.length == 0) return null;
	return (
		<div className="flex flex-wrap gap-1">
			{entries.map(([tag]) => (
				<Badge
					key={tag}
					variant="outline"
					className="text-[9px] px-1.5 py-0 h-4 rounded-full font-semibold
							border-violet-500/30 text-violet-300 bg-violet-500/10 uppercase"
				>
					{tag}
				</Badge>
			))}
		</div>
	);
}

function StreamingLinks({ external_links }) {
	const links = external_links.filter(
		(link) =>
			link.site.includes("Crunchyroll") || link.site.includes("Netflix"),
	);
	if (!links.length) return null;
	return (
		<>
			{links.map((link) => (
				<ExternalLinkButton
					key={link.icon}
					href={link.url}
					className={
						link.site == "Crunchyroll"
							? "hover:text-orange-400"
							: "hover:text-red-400"
					}
				>
					<img
						src={link.icon}
						alt={link.site}
						className="w-3 h-3 object-contain"
						loading="lazy"
					/>
					{link.site}
				</ExternalLinkButton>
			))}
		</>
	);
}

function ScoreIcon({ score }) {
	return (
		<span
			className="inline-flex items-center gap-1 text-[11px] font-bold
			text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded px-1.5 py-0.5"
		>
			<Star size={10} className="fill-amber-400" />
			{score}
		</span>
	);
}

function MatchIcon({ score }) {
	return (
		<Badge
			className="text-[11px] font-bold bg-violet-600 hover:bg-violet-600
			border-none text-white shadow-sm shadow-violet-900/50 shrink-0"
		>
			{(score * 100).toFixed(0)}%
		</Badge>
	);
}

function DetailDialog({ data, open, onOpenChange }) {
	const malUrl = `https://myanimelist.net/anime/${data.id_mal}`;
	const anilistUrl = ["MANGA", "NOVEL", "ONE_SHOT"].includes(data.format)
		? `https://anilist.co/manga/${data.id}`
		: `https://anilist.co/anime/${data.id}`;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl p-0 overflow-hidden bg-[#0d1829] border border-violet-900/40 gap-0">
				<div className="relative w-full h-auto min-h-[150px] bg-black/20">
					<img
						src={data.bannerImage}
						alt={data.title}
						className="w-full h-auto display-block z-10"
						loading="lazy"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-[#0d1829] via-transparent to-transparent z-20" />

					<div className="absolute bottom-4 left-5 right-5 z-30 flex items-end justify-between gap-3">
						<div className="space-y-1">
							<DialogTitle className="text-xl font-bold text-white leading-tight drop-shadow-md">
								{data.title}
							</DialogTitle>
							<DialogDescription className="sr-only">
								Details and recommendations for {data.title}
							</DialogDescription>

							<div className="flex items-center gap-2 flex-wrap">
								<Badge
									variant="outline"
									className="text-[10px] border-cyan-500/30 text-cyan-400 bg-cyan-500/10 h-5"
								>
									{data.format}
								</Badge>
								<Badge
									variant="outline"
									className="text-[10px] border-white/10 text-slate-400 bg-white/5 h-5"
								>
									{data.season_year}
								</Badge>
								<ScoreIcon score={data.mean_score} />
							</div>
						</div>
						<MatchIcon score={data.score} />
					</div>
				</div>

				<ScrollArea className="max-h-[60vh]">
					<div className="px-5 py-4 space-y-5">
						<div className="flex gap-6 border-b border-white/[0.06] pb-4">
							<div className="space-y-1">
								<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
									Status
								</p>
								<p className="text-xs text-slate-200 capitalize">
									{data.status?.toLowerCase()}
								</p>
							</div>
							<div className="space-y-1">
								{["MANGA", "NOVEL", "ONE_SHOT"].includes(data.format) ? (
									<>
										<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
											Mangaka
										</p>
										<div className="flex flex-wrap gap-3 mt-1">
											{data.creators
												?.filter((creator) =>
													creator.role?.toLowerCase().includes("story"),
												)
												.map((creator) => (
													<div
														key={creator.node.name.full}
														className="flex items-center gap-2 bg-white/5 pr-3 rounded-full border border-white/10"
													>
														<img
															src={creator.node.image?.large}
															alt={creator.node.name.full}
															className="w-7 h-7 rounded-full object-cover border border-violet-500/30"
															loading="lazy"
														/>
														<p className="text-xs text-slate-200 font-medium whitespace-nowrap">
															{creator.node.name.full}
														</p>
													</div>
												))}
										</div>
									</>
								) : (
									<>
										<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
											Studio
										</p>
										<p className="text-xs text-slate-200 font-medium">
											{data.creators && data.creators.length > 0
												? data.creators[0].name
												: "Unknown"}
										</p>
									</>
								)}
							</div>
						</div>
						<div className="space-y-4">
							<div>
								<p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
									<Info size={11} /> Recommended because you like
								</p>
								<Why_recommend_Tags why_recommended={data.why_recommended} />
							</div>

							<div>
								<p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
									Genres
								</p>
								<div className="flex flex-wrap gap-1.5">
									{data.genres?.map((genre, index) => (
										<span
											key={genre}
											className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 text-slate-400 rounded-sm font-medium"
										>
											{genre}
										</span>
									))}
								</div>
							</div>
						</div>
						<Separator className="bg-white/[0.06]" />
						{data.description && (
							<div className="space-y-2">
								<p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
									Synopsis
								</p>
								<p
									className="text-[12px] text-slate-400 leading-relaxed"
									dangerouslySetInnerHTML={{ __html: data.description }}
								/>
							</div>
						)}
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
							{data.trailer_id && (
								<Button
									size="sm"
									variant="outline"
									className="h-7 px-3 text-[10px] gap-1.5 border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300"
									onClick={() =>
										window.open(
											`https://www.youtube.com/watch?v=${data.trailer_id}`,
											"_blank",
										)
									}
								>
									<Play size={10} className="fill-current" />
									Trailer
								</Button>
							)}
							<ExternalLinkButton
								href={anilistUrl}
								className="hover:text-blue-400"
							>
								<img
									src="/anilist_logo.png"
									alt="AniList"
									className="w-3 h-3"
									loading="lazy"
								/>
								AniList
							</ExternalLinkButton>
							<ExternalLinkButton href={malUrl} className="hover:text-blue-500">
								<img
									src="/mal_logo.png"
									alt="MAL"
									className="w-3 h-3"
									loading="lazy"
								/>
								MAL
							</ExternalLinkButton>
							<StreamingLinks external_links={data.external_links} />
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
function GridCard({ data, onOpen }) {
	console.log(data);
	return (
		<Card
			onClick={onOpen}
			className="group relative flex flex-col overflow-hidden cursor-pointer
				bg-[#0d1829] border border-white/[0.06] hover:border-violet-500/40
				transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/20 p-0 gap-0"
		>
			<div className="relative overflow-hidden aspect-[2/3] w-full">
				<img
					src={data.cover_image}
					alt={data.title}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#0d1829] via-transparent to-transparent opacity-80" />

				<div className="absolute top-2 right-2">
					<MatchIcon score={data.score} />
				</div>

				<div className="absolute bottom-2 left-2">
					<ScoreIcon score={data.mean_score} />
				</div>
			</div>

			<CardContent className="p-2.5 flex flex-col gap-1.5">
				<h3
					className="text-[11px] font-bold text-slate-100 leading-tight
					line-clamp-2 uppercase tracking-wide"
				>
					{data.title}
				</h3>
				<p className="text-[10px] text-slate-500 font-medium">
					{data.format} · {data.season_year}
				</p>
				<Why_recommend_Tags why_recommended={data.why_recommended} />
			</CardContent>
		</Card>
	);
}

function WideCard({ data, onOpen }) {
	return (
		<Card
			onClick={onOpen}
			className="group flex flex-row overflow-hidden cursor-pointer
				bg-[#0d1829] border border-white/[0.06] hover:border-violet-500/40
				transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/20 p-0 gap-0"
		>
			<div className="relative w-28 shrink-0 overflow-hidden">
				<img
					src={data.cover_image}
					alt={data.title}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d1829]/30" />
			</div>

			<CardContent className="flex-1 p-3 flex flex-col gap-2 min-w-0">
				<div className="flex items-start justify-between gap-2">
					<h3
						className="text-[13px] font-bold text-slate-100 leading-tight
						line-clamp-2 uppercase tracking-wide flex-1"
					>
						{data.title}
					</h3>
					<MatchIcon score={data.score} />
				</div>

				<div className="flex items-center gap-2 flex-wrap">
					<ScoreIcon score={data.mean_score} />
					<span className="text-[11px] text-slate-500 font-medium">
						{data.format} · {data.season_year}
					</span>
				</div>

				<div>
					<p
						className="text-[9px] font-semibold text-violet-400 uppercase
						tracking-widest flex items-center gap-1 mb-1.5"
					>
						<Info size={9} /> Because you like
					</p>
					<Why_recommend_Tags why_recommended={data.why_recommended} />
				</div>

				{data.description && (
					<p
						className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mt-auto"
						dangerouslySetInnerHTML={{ __html: data.description }}
					/>
				)}
			</CardContent>
		</Card>
	);
}

function ListCard({ data, onOpen }) {
	const malUrl = `https://myanimelist.net/anime/${data.id_mal}`;
	const anilistUrl = ["MANGA", "NOVEL", "ONE_SHOT"].includes(data.format)
		? `https://anilist.co/manga/${data.id}`
		: `https://anilist.co/anime/${data.id}`;

	return (
		<Card className="flex flex-row items-center gap-0 overflow-hidden bg-[#0d1829] border border-white/[0.06] hover:border-violet-500/30 transition-all duration-200 p-0">
			<div
				className="relative w-20 shrink-0 overflow-hidden cursor-pointer self-stretch"
				onClick={onOpen}
			>
				<img
					src={data.cover_image}
					alt={data.title}
					className="w-full h-full object-cover"
					loading="lazy"
				/>
			</div>

			<div
				className="flex-1 min-w-0 px-4 py-2 flex flex-col gap-1 cursor-pointer"
				onClick={onOpen}
			>
				<div className="flex items-center gap-3">
					<h3 className="text-[12px] font-bold text-slate-100 uppercase tracking-wide truncate">
						{data.title}
					</h3>
					<MatchIcon score={data.score} />
				</div>

				{data.description && (
					<p
						className="text-[11px] text-slate-500 line-clamp-1 italic mb-1"
						dangerouslySetInnerHTML={{
							__html: data.description,
						}}
					/>
				)}

				<div className="flex items-center gap-3">
					<Why_recommend_Tags why_recommended={data.why_recommended} />
					<span className="text-[10px] text-slate-600 font-medium ml-auto uppercase shrink-0">
						{data.format} · {data.season_year}
					</span>
				</div>
			</div>

			<div className="shrink-0 pr-4 flex items-center gap-3">
				<ExternalLinkButton href={anilistUrl} className="hover:text-blue-400">
					<Image
						src="/anilist_logo.png"
						alt="AniList"
						className="w-3 h-3"
						loading="lazy"
					/>
					AniList
				</ExternalLinkButton>
				<ExternalLinkButton href={malUrl} className="hover:text-blue-500">
					<Image
						src="/mal_logo.png"
						alt="MAL"
						className="w-3 h-3"
						loading="lazy"
					/>
					MAL
				</ExternalLinkButton>
				<StreamingLinks external_links={data.external_links} />
			</div>
		</Card>
	);
}

export default function Recommendation({
	recommendationData: data,
	viewMode = "grid",
}) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const openDialog = () => setDialogOpen(true);
	return (
		<>
			{viewMode == "grid" && <GridCard data={data} onOpen={openDialog} />}
			{viewMode == "wideGrid" && <WideCard data={data} onOpen={openDialog} />}
			{viewMode == "list" && <ListCard data={data} onOpen={openDialog} />}

			<DetailDialog
				data={data}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			/>
		</>
	);
}
