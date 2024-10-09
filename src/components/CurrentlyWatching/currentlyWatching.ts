import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { getCurrentUser } from "aws-amplify/auth";
import {
	logErrorsAndReturnData,
	logErrorsAndReturnDataAndErrors,
} from "../../utils/ClientUtils";
import { Partner } from "../Partners/partnerSearch";

const client = generateClient<Schema>();

export type Watching = Schema["Watching"]["type"];
type CurrentlyWatchingList = Watching[];

export const currentlyWatchingApi = createApi({
	reducerPath: "currentlyWatchingApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["WatchRecord"],
	endpoints: (builder) => ({
		getAllCurrentlyWatching: builder.query<CurrentlyWatchingList, void>({
			queryFn: async () => {
				try {
					const response = await client.models.Watching.list();
					return logErrorsAndReturnDataAndErrors(response);
				} catch (error) {
					return { error };
				}
			},
			providesTags: (result) => {
				if (result) {
					return [
						...result.map(
							({ id }) =>
								({
									type: "WatchRecord",
									id,
								} as const)
						),
						{ type: "WatchRecord", id: "LIST" },
					];
				} else {
					return [{ type: "WatchRecord", id: "LIST" }];
				}
			},
		}),
		getCurrentlyWatching: builder.query<Watching, string | undefined>({
			queryFn: async (id) => {
				if (id === undefined) {
					return { data: undefined };
				}
				try {
					const response = await client.models.Watching.get({ id });
					return logErrorsAndReturnDataAndErrors(response);
				} catch (error) {
					return { error };
				}
			},
			providesTags: (_result, _error, id) => [
				{ type: "WatchRecord", id },
			],
		}),
		startWatching: builder.mutation<Watching, string>({
			queryFn: async (mediaId) => {
				try {
					const user = await getCurrentUser();
					const response = await client.models.Watching.create({
						mediaId: mediaId,
						with: [user.username],
					});
					return logErrorsAndReturnDataAndErrors(response);
				} catch (error) {
					return { error };
				}
			},
			invalidatesTags: (_result, _error, _arg) => [
				{ type: "WatchRecord", id: "LIST" },
			],
		}),
		stopWatching: builder.mutation<Watching, string>({
			queryFn: async (id) => {
				try {
					const response = await client.models.Watching.delete({
						id,
					});
					return logErrorsAndReturnDataAndErrors(response);
				} catch (error) {
					return { error };
				}
			},
			invalidatesTags: (_result, _error, _arg) => [
				{ type: "WatchRecord", id: "LIST" },
			],
		}),
		startWatchingWith: builder.mutation<
			Watching,
			{ watchRecord: Watching; partnerToAdd: Partner }
		>({
			queryFn: async ({
				watchRecord,
				partnerToAdd: { username: partnerToAdd },
			}) => {
				try {
					const newMembers = [...watchRecord.with, partnerToAdd];
					const data = await updateWatchingRecordWithNewMembers(
						watchRecord,
						newMembers
					);
					return { data };
				} catch (error) {
					return { error };
				}
			},
			invalidatesTags: (_result, _error, _arg) => [
				{ type: "WatchRecord", id: "LIST" },
			],
		}),
		stopWatchingWith: builder.mutation<
			Watching,
			{ watchRecord: Watching; partnerToRemove: Partner }
		>({
			queryFn: async ({
				watchRecord,
				partnerToRemove: { username: partnerToRemove },
			}) => {
				try {
					const newMembers = watchRecord.with.filter(
						(watchingWith) => watchingWith !== partnerToRemove
					);
					const data = await updateWatchingRecordWithNewMembers(
						watchRecord,
						newMembers
					);
					return { data };
				} catch (error) {
					return { error };
				}
			},
			invalidatesTags: (_result, _error, _arg) => [
				{ type: "WatchRecord", id: "LIST" },
			],
		}),
		setEpisode: builder.mutation<
			Watching,
			{ watchRecord: Watching; season: number; episode: number }
		>({
			queryFn: async ({ watchRecord, season, episode }) => {
				try {
					const data = await client.models.Watching.update({
						...watchRecord,
						season,
						episode,
					}).then(logErrorsAndReturnData);
					return { data };
				} catch (error) {
					return { error };
				}
			},
			invalidatesTags: (_result, _error, arg) => [
				{ type: "WatchRecord", id: arg.watchRecord.id },
			],
		}),
	}),
});

const updateWatchingRecordWithNewMembers = async (
	watchRecord: Watching,
	newMembers: string[]
) => {
	return await client.models.Watching.update({
		...watchRecord,
		with: newMembers,
	}).then(logErrorsAndReturnData);
};

export const {
	useGetAllCurrentlyWatchingQuery,
	useGetCurrentlyWatchingQuery,
	useStartWatchingMutation,
	useStopWatchingMutation,
	useStopWatchingWithMutation,
	useStartWatchingWithMutation,
	useSetEpisodeMutation,
} = currentlyWatchingApi;
