import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/useToast";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "https://indoga.vercel.app/";
export const metadata = {
	metadataBase: new URL(BASE_URL),

	title: {
		default: "Indoga — Discover Anime & Manga Matched to Your Taste",
		template: "%s | Indoga",
	},

	description:
		"Personalized anime and manga recommendations based on your AniList or MyAnimeList profile",

	keywords: [
		"anime recommendations",
		"manga recommendations",
		"AniList",
		"MyAnimeList",
		"anime discovery",
		"personalized anime",
		"niche anime",
		"anime taste profile",
		"indoga",
		"anime",
		"manga",
		"japan",
		"recommendations",
		"personalized",
		"discovery",
		"algorithm",
		"anime statistics",
		"find new anime",
		"profile analysis",
		"otaku",
	],

	authors: [
		{
			name: "Mateusz Radzkowski",
			url: "https://github.com/MateuszRadz1kowski",
		},
	],

	creator: "Mateusz Radzkowski",
	publisher: "Indoga",

	alternates: {
		canonical: "/",
	},

	openGraph: {
		type: "website",
		url: BASE_URL,
		siteName: "Indoga",
		title: "Indoga — Discover Anime & Manga Matched to Your Taste",
		description:
			"Personalized anime and manga recommendations based on your AniList or MyAnimeList profile",
		// images: [
		// 	{
		// 		url: "/logo.png",
		// 		width: 1200,
		// 		height: 630,
		// 		alt: "Indoga — Personalized Anime Discovery",
		// 		type: "image/png",
		// 	},
		// ],
		locale: "en_US",
	},

	twitter: {
		card: "summary_large_image",
		title: "Indoga — Personalized Anime Discovery",
		description:
			"Personalized anime and manga recommendations based on your AniList or MyAnimeList profile",
		// images: ["/logo.png"],
		creator: "@Radz1k69",
	},

	applicationName: "Indoga",

	appleWebApp: {
		capable: true,
		title: "Indoga",
		statusBarStyle: "black-translucent",
	},

	formatDetection: {
		telephone: false,
	},

	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

	// icons: {
	// 	icon: [
	// 		{ url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" }, // favicon
	// 		{ url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" }, // desktop
	// 	],
	// 	apple: [
	// 		{
	// 			url: "/icons/apple-touch-icon.png",
	// 			sizes: "180x180",
	// 			type: "image/png",
	// 		},
	// 	],
	// 	other: [
	// 		{
	// 			rel: "mask-icon",
	// 			url: "/icons/safari-pinned-tab.svg",
	// 			color: "#7c3aed",
	// 		},
	// 	],
	// },

	manifest: "/manifest.json",

	// verification: {
	//   google: "twoj-token-z-search-console",
	// },
};

export const viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: dark)", color: "#060d1b" },
		{ media: "(prefers-color-scheme: light)", color: "#7c3aed" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	colorScheme: "dark",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<meta name="mobile-web-app-capable" content="yes" />

				<meta name="apple-mobile-web-app-capable" content="yes" />

				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>

				<meta name="apple-mobile-web-app-title" content="Indoga" />

				{/* ── Splash screens dla iOS ───────────────────────────
            Obrazy wyświetlane podczas uruchamiania PWA na iPhone/iPad
            Każdy media query odpowiada konkretnemu modelowi urządzenia
            Stwórz pliki w frontend/public/splash/ lub użyj narzędzia
            https://progressier.com/pwa-screenshots-and-ios-splash-screen-generator */}
				{/* <link
					rel="apple-touch-startup-image"
					href="/splash/splash-1170x2532.png"
					media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/splash-1125x2436.png"
					media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/splash-750x1334.png"
					media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
				/> */}

				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebApplication",
							name: "Indoga",
							url: BASE_URL,
							description:
								"Personalized anime and manga recommendations based on your AniList or MyAnimeList profile",
							applicationCategory: "EntertainmentApplication",
							operatingSystem: "Any",
							offers: {
								"@type": "Offer",
								price: "0",
								priceCurrency: "USD",
							},
							author: {
								"@type": "Person",
								name: "Mateusz Radzkowski",
								url: "https://github.com/MateuszRadz1kowski",
							},
							softwareVersion: "1.0.0",
						}),
					}}
				/>
			</head>

			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ToastProvider>{children}</ToastProvider>
			</body>
		</html>
	);
}
