import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

export type TvShowSkeleton = {
	mediaId: string;
	name: string;
	firstAirDate: string;
};
type TvShow = Schema["TvShow"]["type"];

const client = generateClient<Schema>();

export const searchResultsApi = createApi({
	reducerPath: "searchResultsApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["SearchResults"],
	endpoints: (builder) => ({
		search: builder.query<TvShowSkeleton[], string>({
			queryFn: async (searchTerm: string) => {
				if (searchTerm === "") {
					return { data: [] };
				}
				try {
					const { data, errors } = await client.queries.searchTvShows(
						{
							query: searchTerm,
						}
					);
					console.log("Total pages: " + data?.total_pages);
					if (data) {
						const tvShowResults =
							data.results as unknown as TvShow[];
						return {
							data: tvShowResults.map((tvShow) => {
								return {
									mediaId: String(tvShow.id),
									name: tvShow.name,
									firstAirDate: tvShow.first_air_date || "",
								};
							}),
						};
					}
					if (errors) {
						return { error: errors };
					}
					return { error: "No data" };
				} catch (error) {
					return { error: "error" };
				}
			},
			providesTags: (_result) => [{ type: "SearchResults", id: "LIST" }],
		}),
		// clearSearch: builder.mutation<void, void>({
		// 	queryFn: async () => {
		// 		return { data: undefined };
		// 	},
		// 	invalidatesTags: (_result) => [
		// 		{ type: "SearchResults", id: "LIST" },
		// 	],
		// }),
	}),
});
export const { useSearchQuery } = searchResultsApi;
