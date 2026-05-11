"use client";
import TimelineDecades from "./TimelineDecades";
import { useEffect, useState } from "react";

export default function StatsTab() {
	const [data, setData] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const username = localStorage.getItem("username");
			const platform = localStorage.getItem("platform");
			if (!username) return;

			try {
				const res = await fetch(
					`http://127.0.0.1:8000/raw_data/?username=${encodeURIComponent(username)}&platform=${encodeURIComponent(platform)}`,
				);
				const json = await res.json();
				console.log(json);
				setData(json);
			} catch (err) {
				console.error(err);
			}
		}
		fetchData();
	}, []);

	return (
		<div className="p-4 h-full overflow-y-auto bg-[#060d1b] custom-scrollbar">
			{data ? (
				<TimelineDecades apiData={data} />
			) : (
				<div className="flex items-center justify-center h-32 text-slate-500 text-xs animate-pulse uppercase tracking-widest">
					Loading stats...
				</div>
			)}
		</div>
	);
}
