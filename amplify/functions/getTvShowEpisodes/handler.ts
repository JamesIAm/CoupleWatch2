import type { Schema } from "../../data/resource";
import { env } from "$amplify/env/getTvShowEpisodes"; // the import is '$amplify/env/<function name>'

const API_TOKEN = env.API_TOKEN;

export const handler: Schema["getTvShowEpisodes"]["functionHandler"] = async (
	event,
	context
) => {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${API_TOKEN}`,
		},
	};
	let seriesId = event.arguments?.seriesId ? event.arguments?.seriesId : "";

	let url = `https://api.themoviedb.org/3/tv/${seriesId}`;
	console.log(url);
	return await fetch(url, options)
		.then((response) => response.json())
		.catch((err) => {
			console.error(err);
			throw new Error("Call failed?");
		});
};
