export default function robots() {
	const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

	return {
		rules: {
			userAgent: "*",
			allow: ["/", "/dashboard"],
			disallow: ["/api/", "/_next/"],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}
