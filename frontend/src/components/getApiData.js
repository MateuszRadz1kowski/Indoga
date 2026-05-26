import { useEffect, useState } from "react";

export function useApiData(params) {
	const [data, setData] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const res = await fetch(
				`http://${process.env.NEXT_PUBLIC_API_URL}/recommendations_data?${params}`,
			);
			const json = await res.json();

			setData(Object.values(json));
		}

		fetchData();
	}, []);

	return data;
}
