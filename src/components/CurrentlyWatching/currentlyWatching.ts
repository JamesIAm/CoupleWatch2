import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export type Watching = Schema["Watching"]["type"];
type CurrentlyWatching = Watching[];

export const currentlyWatchingApi = createApi({
	reducerPath: "currentlyWatchingApi",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => ({
		getCurrentlyWatching: builder.query<CurrentlyWatching, void>({
			queryFn: async () => {
				try {
					const { data, errors } =
						await client.models.Watching.list();
					if (data) {
						return { data };
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

export const { useGetCurrentlyWatchingQuery } = currentlyWatchingApi;
