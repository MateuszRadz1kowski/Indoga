"use client";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
	const router = useRouter();

	const localStorageSetUsername = (e) => {
		const username = e.target.previousElementSibling.value;
		console.log(username);
		localStorage.setItem("username", username);
		router.push("/recommendations");
	};

	const [inputUser, setInputUser] = useState("")

	return (
		<div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
			<Card className="w-full max-w-2xl shadow-xl border-zinc-800 bg-zinc-900">
				<CardHeader className="text-center space-y-2 text-left">
					<CardTitle className="text-3xl font-bold tracking-tight text-white">
						Anime Recommender
					</CardTitle>
					<p className="text-zinc-400 text-sm">
						Enter your profile to generate recommendations
					</p>
				</CardHeader>

				<CardContent className="space-y-6">
					<Tabs defaultValue="mal" className="w-full">
						<TabsList className="grid grid-cols-2 bg-zinc-800">
							<TabsTrigger value="mal" className="flex items-center gap-2">
								<Image src="/mal_logo.png" alt="MAL" width={20} height={20} />
								MyAnimeList
							</TabsTrigger>
							<TabsTrigger value="anilist" className="flex items-center gap-2">
								<Image
									src="/anilist_logo.png"
									alt="AniList"
									width={20}
									height={20}
								/>
								AniList
							</TabsTrigger>
						</TabsList>

						<TabsContent value="mal" className="mt-6 space-y-4">
							<div className="flex gap-2">
								<Input
									placeholder="Enter your MyAnimeList username"
									className="bg-zinc-800 border-zinc-700 text-white"
								/>
								<Button
									className="bg-white text-black hover:bg-zinc-200"
									onClick={(e) => localStorageSetUsername(e)}
								>
									<Search size={18} />
								</Button>
							</div>
						</TabsContent>

						<TabsContent value="anilist" className="mt-6 space-y-4">
							<div className="flex gap-2">
								<Input
									placeholder="Enter your AniList username"
									className="bg-zinc-800 border-zinc-700 text-white"
								/>
								<Button
									className="bg-white text-black hover:bg-zinc-200"
									onClick={(e) => localStorageSetUsername(e)}
								>
									<Search size={18} />
								</Button>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
