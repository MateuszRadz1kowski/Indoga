import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/useToast";
import { TooltipModeProvider } from "@/components/tooltip/TooltipSystem";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

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
		"Personalized Anime & Manga recommendation engine based on your AniList and MyAnimeList profile",

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
			"Personalized Anime & Manga recommendation engine based on your AniList and MyAnimeList profile",
		images: [
			{
				url: "/icon.png",
				width: 512,
				height: 512,
				alt: "Indoga — Personalized Anime Discovery",
				type: "image/png",
			},
		],
		locale: "en_US",
	},

	twitter: {
		card: "summary",
		title: "Indoga — Discover Anime & Manga Matched to Your Taste",
		description:
			"Personalized Anime & Manga recommendation engine based on your AniList and MyAnimeList profile",
		images: ["/icon.png"],
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

	manifest: "/manifest.json",
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

				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebApplication",
							name: "Indoga",
							url: BASE_URL,
							description:
								"Personalized Anime & Manga recommendation engine based on your AniList and MyAnimeList profile",
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
							image: `${BASE_URL}icon.png`,
						}),
					}}
				/>
			</head>

			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-purple-500/40 selection:text-white`}
			>
				<TooltipModeProvider>
					<ToastProvider>{children}</ToastProvider>
				</TooltipModeProvider>
				<Analytics />
				<SpeedInsights />
				<GoogleAnalytics gaId="G-M1665G2XSP" />
			</body>
		</html>
	);
}
