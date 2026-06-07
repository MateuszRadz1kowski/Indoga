"use client";

const ERROR_CONFIGS = {
	user_not_found: {
		title: "User Not Found",
		suggestion:
			"Double-check the username and make sure the profile is public.",
	},
	private_profile: {
		title: "Private Profile",
		suggestion:
			"This account is set to private. Ask them to make their list public.",
	},
	empty_list: {
		title: "Empty Anime List",
		suggestion: "Add some completed or rated anime to your list and try again.",
	},
	server_error: {
		title: "Server Error",
		suggestion: "Something went wrong on our end. Try again in a moment.",
	},
	db_error: {
		title: "Database Unavailable",
		suggestion:
			"We're having trouble reaching the database. Try again shortly.",
	},
	network_error: {
		title: "Connection Failed",
		suggestion: "Can't reach the server. Check your internet connection.",
	},
	rate_limit: {
		title: "Too Many Requests",
		suggestion: "AniList is rate limiting us. Wait a moment and try again.",
	},
	no_recommendations: {
		title: "No available recommendations",
		suggestion:
			"Based on your filters, we couldn't find any recommendations. Try adjusting your filters for new suggestions.",
	},
	unknown: {
		title: "Unexpected Error",
		suggestion: "Something went wrong. Try refreshing the page.",
	},
};

export function RecommendationsError({
	errorCode = "unknown",
	message,
	onRetry,
}) {
	const config = ERROR_CONFIGS[errorCode] || ERROR_CONFIGS.unknown;

	return (
		<div className="flex flex-col items-center justify-center h-full min-h-[400px] px-8 text-center gap-6">
			<div className="space-y-2">
				<h2 className="text-lg font-bold text-slate-200 uppercase tracking-wide">
					{config.title}
				</h2>
				<p className="text-sm text-slate-500 max-w-sm leading-relaxed">
					{message || config.suggestion}
				</p>
			</div>

			{onRetry && (
				<button
					onClick={onRetry}
					className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-95"
				>
					Try Again
				</button>
			)}
		</div>
	);
}

export function SectionError({ errorCode = "unknown", message }) {
	const config = ERROR_CONFIGS[errorCode] || ERROR_CONFIGS.unknown;

	return (
		<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20 text-sm">
			<div className="min-w-0">
				<p className="text-[12px] font-bold text-red-400 uppercase tracking-wide">
					{config.title}
				</p>
				<p className="text-[11px] text-slate-500 mt-0.5 truncate">
					{message || config.suggestion}
				</p>
			</div>
		</div>
	);
}

export function parseApiError(errorData) {
	if (!errorData) return { code: "unknown", message: null };

	const code = errorData.error_code || "unknown";
	const message = errorData.detail || errorData.message || null;
	return { code, message };
}
