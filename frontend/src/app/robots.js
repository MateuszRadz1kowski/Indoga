export default function robots() {
	const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://indoga.app/";

	return {
		rules: {
			userAgent: "*",
			allow: ["/", "/dashboard"],
			disallow: ["/api/", "/_next/"],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}
