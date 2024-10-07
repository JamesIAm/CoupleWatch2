import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { AuthUser } from "aws-amplify/auth";
import { logErrorsAndReturnDataAndErrors } from "../../utils/ClientUtils";

const client = generateClient<Schema>();

export type Watching = Schema["Watching"]["type"];
type CurrentlyWatchingList = Watching[];

export const currentlyWatchingApi = createApi({
	reducerPath: "currentlyWatchingApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["WatchRecord"],
	endpoints: (builder) => ({
		getCurrentlyWatching: builder.query<CurrentlyWatchingList, void>({
			queryFn: async () => {
				try {
					const response = await client.models.Watching.list();
					return logErrorsAndReturnDataAndErrors(response);
				} catch (error) {
					return { error };
				}
			},
			providesTags: (_result) => [{ type: "WatchRecord", id: "LIST" }],
		}),
		startWatching: builder.mutation<
			Watching,
			{ mediaId: string; user: AuthUser }
		>({
			queryFn: async ({ mediaId, user }) => {
				const response = await client.models.Watching.create({
					mediaId: mediaId,
					with: [user.username],
					usersSortedConcatenated: user.username,
				});
				return logErrorsAndReturnDataAndErrors(response);
			},
			invalidatesTags: (_result, _error, _arg) => [
				{ type: "WatchRecord", id: "LIST" },
			],
		}),
	}),
});

export const { useGetCurrentlyWatchingQuery, useStartWatchingMutation } =
	currentlyWatchingApi;
