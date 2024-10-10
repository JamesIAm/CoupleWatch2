import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export type TvShowDetails = Schema["TvShowDetails"]["type"];

export const tvShowDetailsApi = createApi({
	reducerPath: "tvShowDetailsApi",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => ({
		getTvShowDetails: builder.query<TvShowDetails, string | undefined>({
			queryFn: async (mediaId) => {
				if (mediaId === undefined) {
					return { data: undefined };
				}
				try {
					const { data, errors } =
						await client.queries.getTvShowEpisodes({
							seriesId: mediaId,
						});
					if (data) {
						return { data: data };
					}
					if (errors) {
						return { error: errors };
					}
					return { error: "No data" };
				} catch (error) {
					return { error: "error" };
				}
			},
		}),
	}),
});

export const { useGetTvShowDetailsQuery } = tvShowDetailsApi;
