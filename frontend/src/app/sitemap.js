export default function sitemap() {
	const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

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
