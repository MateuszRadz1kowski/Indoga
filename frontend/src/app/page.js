"use client";
import { useEffect, useState } from "react";
import LoginPage from "./loginPage/page";
import Recommendations from "./recommendations/page";

export default function Home() {
	const [username, setUsername] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const storedUser = localStorage.getItem("username");
		setUsername(storedUser);
		setIsLoaded(true);
	}, []);

	if (!isLoaded) return null;

	return (
		<div>
			{username && username != null ? <Recommendations /> : <LoginPage />}
		</div>
	);
}
