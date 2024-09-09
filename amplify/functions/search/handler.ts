import { Handler } from "aws-lambda";
import type { Schema } from "../../data/resource";
import { env } from "$amplify/env/search"; // the import is '$amplify/env/<function name>'

const API_TOKEN = env.API_TOKEN;

export const handler: Schema["searchTvShows"]["functionHandler"] = async (
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
	let query = event.arguments?.query ? event.arguments?.query : "";
	console.log(query);
	let uriEncodedQuery = encodeURIComponent(query);

	let url = `https://api.themoviedb.org/3/search/tv?query=${uriEncodedQuery}`;
	console.log(url);
	return await fetch(url, options)
		.then((response) => response.json())
		.then((response) => {
			console.log(response);
			return JSON.stringify(response);
		})
		.catch((err) => {
			console.error(err);
			throw new Error("Call failed?");
		});
};
