export default function sitemap() {
	const BASE_URL =
		process.env.NEXT_PUBLIC_API_URL || "https://indoga.vercel.app/";

	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${BASE_URL}/dashboard`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.6,
		},
	];
}
