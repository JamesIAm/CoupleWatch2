import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { AuthUser } from "aws-amplify/auth";
import {
	logErrorsAndReturnData,
	logErrorsAndReturnDataAndErrors,
} from "../../utils/ClientUtils";
import { Pairing } from "../Partners/pairingsSlice";

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
				try {
					const response = await client.models.Watching.create({
						mediaId: mediaId,
						with: [user.username],
						usersSortedConcatenated: user.username,
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
		stopWatching: builder.mutation<Watching, Watching>({
			queryFn: async ({ mediaId, usersSortedConcatenated }) => {
				try {
					const response = await client.models.Watching.delete({
						mediaId,
						usersSortedConcatenated,
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
			{ watchRecord: Watching; partnerToAdd: Pairing }
		>({
			queryFn: async ({
				watchRecord,
				partnerToAdd: { username: partnerToAdd },
			}) => {
				try {
					const newMembers = [...watchRecord.with, partnerToAdd];
					console.log("new memebers");
					console.log(newMembers);
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
			{ watchRecord: Watching; partnerToRemove: Pairing }
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
	}),
});

const updateWatchingRecordWithNewMembers = async (
	{ mediaId, usersSortedConcatenated: oldMembersConcatenated }: Watching,
	newMembers: string[]
) => {
	console.log("starting update of users");
	const newMembersConcatenated = sortAndConcatenateUsers(newMembers);
	const recordWithNewKey = await client.models.Watching.get({
		mediaId,
		usersSortedConcatenated: newMembersConcatenated,
	}).then((result) => {
		if (result.errors) {
			result.errors.forEach(console.error);
			throw new Error(result.errors[0].message);
		}
		return result.data;
	});
	console.log("got record with new key");
	if (recordWithNewKey) {
		await client.models.Watching.delete({
			mediaId,
			usersSortedConcatenated: newMembersConcatenated,
		}).then(logErrorsAndReturnData);
		console.log("deleted record with new key");
	}
	const newWatchRecord = await client.models.Watching.create({
		mediaId,
		with: newMembers,
		usersSortedConcatenated: newMembersConcatenated,
	}).then(logErrorsAndReturnData);

	console.log("made new record");
	console.log(newWatchRecord);
	await client.models.Watching.delete({
		mediaId,
		usersSortedConcatenated: oldMembersConcatenated,
	}).then(logErrorsAndReturnData);

	console.log("deleted old record");
	return newWatchRecord;
};

const sortAndConcatenateUsers = (users: string[]) => {
	return users.sort().join(",");
};

export const {
	useGetCurrentlyWatchingQuery,
	useStartWatchingMutation,
	useStopWatchingMutation,
	useStopWatchingWithMutation,
	useStartWatchingWithMutation,
} = currentlyWatchingApi;
