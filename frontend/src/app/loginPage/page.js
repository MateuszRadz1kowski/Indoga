"use client";
import Image from "next/image";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
	const router = useRouter();
	const [inputUser, setInputUser] = useState("");
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const handleLogin = (platform) => {
		if (!inputUser.trim()) return;
		localStorage.setItem("username", inputUser.trim());
		localStorage.setItem("platform", platform);
		router.push("/dashboard");
	};

	const handleKeyDown = (e, platform) => {
		if (e.key == "Enter") handleLogin(platform);
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
			style={{ background: "oklch(0.08 0.015 265)" }}
		>
			<div
				className="absolute inset-0 pointer-events-none z-0"
				style={{
					background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, oklch(0.65 0.25 290 / 0.1), transparent 40%)`,
				}}
			/>

			<div
				className="absolute inset-0 opacity-[0.12] pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(to right, oklch(0.65 0.25 290 / 0.3) 1px, transparent 1px), 
          linear-gradient(to bottom, oklch(0.65 0.25 290 / 0.3) 1px, transparent 1px)`,
					backgroundSize: "50px 50px",
					maskImage:
						"radial-gradient(circle at center, black, transparent 85%)",
					transform: "perspective(1000px) rotateX(35deg)",
					transformOrigin: "top",
					animation: "grid-scroll 25s linear infinite",
				}}
			/>

			<div className="absolute inset-0 pointer-events-none overflow-hidden blur-[120px]">
				<div
					className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-20"
					style={{
						background: "oklch(0.65 0.25 290)",
						animation: "float-glow 15s ease-in-out infinite alternate",
					}}
				/>
				<div
					className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10"
					style={{ background: "oklch(0.68 0.20 310)" }}
				/>
			</div>

			<div className="relative w-full max-w-md z-10">
				<div className="text-center mb-8 group cursor-default">
					<div className="inline-flex items-center gap-3 mb-3">
						<div
							className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110 shadow-lg"
							style={{
								background: "oklch(0.65 0.25 290)",
								boxShadow: "0 0 25px oklch(0.65 0.25 290 / 0.4)",
							}}
						>
							<Sparkles className="w-6 h-6 text-white animate-pulse" />
						</div>
						<span className="text-2xl font-black tracking-tighter text-white uppercase italic">
							Anime Recommender
						</span>
					</div>
					<h1 className="text-2xl font-bold text-white mb-1">Welcome</h1>
					<p className="text-sm font-medium opacity-60 text-slate-300">
						Connect your anime profile to get started
					</p>
				</div>

				<div
					className="rounded-[2.5rem] border p-8 backdrop-blur-xl transition-all duration-700 hover:border-purple-500/40 group/card relative overflow-hidden"
					style={{
						background: "oklch(0.12 0.02 265 / 0.7)",
						borderColor: "oklch(0.20 0.02 265)",
						boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.6)",
					}}
				>
					<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-right from-transparent via-purple-500/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

					<Tabs defaultValue="mal" className="w-full">
						<TabsList
							className="grid grid-cols-2 mb-8 rounded-2xl p-1 border border-white/5"
							style={{ background: "oklch(0.06 0.01 265)" }}
						>
							<TabsTrigger
								value="anilist"
								className="flex items-center gap-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest
                  data-[state=inactive]:text-slate-500/80 data-[state=inactive]:hover:text-slate-300
                  data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
							>
								<Image
									src="/anilist_logo.png"
									alt="AniList"
									width={14}
									height={14}
									className="rounded-sm"
								/>
								AniList
							</TabsTrigger>

							<TabsTrigger
								value="mal"
								className="flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest
                  data-[state=inactive]:text-slate-500/80 data-[state=inactive]:hover:text-slate-300
                  data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
							>
								<Image
									src="/mal_logo.png"
									alt="MAL"
									width={14}
									height={14}
									className="rounded-sm"
								/>
								MAL
							</TabsTrigger>
						</TabsList>

						{["anilist", "mal"].map((platform) => (
							<TabsContent
								key={platform}
								value={platform}
								className="mt-0 space-y-5 outline-none"
							>
								<div className="space-y-2.5">
									<label className="text-[10px] font-black mb-1 block ml-1 text-slate-500 uppercase tracking-[0.2em]">
										User Identifier
									</label>
									<div className="flex gap-2">
										<Input
											placeholder={`Enter your ${platform === "mal" ? "MAL" : "AniList"} username`}
											className="flex-1 rounded-2xl border-2 text-sm h-14 bg-black/40 px-5 focus:ring-0 focus:border-purple-500/50 transition-all placeholder:text-slate-700"
											style={{
												borderColor: "oklch(0.22 0.02 265)",
												color: "white",
											}}
											value={inputUser}
											onChange={(e) => setInputUser(e.target.value)}
											onKeyDown={(e) =>
												handleKeyDown(
													e,
													platform == "anilist" ? "AniList" : "MyAnimeList",
												)
											}
										/>
										<Button
											className="h-14 w-14 rounded-2xl font-semibold text-white transition-all duration-500
                        hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]"
											style={{ background: "oklch(0.65 0.25 290)" }}
											onClick={() =>
												handleLogin(
													platform == "anilist" ? "AniList" : "MyAnimeList",
												)
											}
											disabled={!inputUser.trim()}
										>
											<Search className="w-5 h-5" />
										</Button>
									</div>
								</div>
							</TabsContent>
						))}
					</Tabs>
				</div>

				<div
					className="mt-10 flex justify-center items-center gap-5 text-[10px] font-mono tracking-[0.25em] uppercase opacity-40 hover:opacity-100 transition-opacity duration-500"
					style={{ color: "oklch(0.55 0.02 265)" }}
				>
					<a
						href="https://github.com/MateuszRadz1kowski/anime-recommender"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-purple-400"
					>
						Github
					</a>
					<div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
					<a href="#" className="hover:text-purple-400">
						Support
					</a>
				</div>
			</div>
		</div>
	);
}
