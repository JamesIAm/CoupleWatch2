import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../state/store";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { Pairing } from "../Partners/pairingsSlice";
import { logErrorsAndReturnData } from "../../utils/ClientUtils";
import { AuthUser } from "aws-amplify/auth";

// Define a type for the slice state
export interface CurrentlyWatchingState {
	status: "pending" | "succeeded" | "failed" | "idle";
	error: string | null;
	currentlyWatching: Watching[];
	episodeData: { [key: string]: SeasonData };
}
export type Watching = Schema["Watching"]["type"];
export type WatchingWithEpisodeData = {
	show: TvShow;
	mediaId: string;
	with: string[];
	seasons?: Season[];
	episodeCount?: number;
	seasonCount?: number;
	id?: string;
	createdAt: string;
	updatedAt: string;
};
export type TvShow = Schema["TvShow"]["type"];
export type SeasonData = Schema["getTvShowEpisodes"]["returnType"];
export type Season = Schema["Season"]["type"];

// Define the initial state using that type
const initialState: CurrentlyWatchingState = {
	status: "idle",
	error: null,
	currentlyWatching: [],
	episodeData: {},
};

export const currentlyWatchingSlice = createSlice({
	name: "currentlyWatching",
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(updateCurrentlyWatching.pending, (state, _action) => {
				state.status = "pending";
			})
			.addCase(updateCurrentlyWatching.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Add any fetched posts to the array
				state.currentlyWatching = action.payload;
			})
			.addCase(updateCurrentlyWatching.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message ?? "Unknown Error";
			})
			.addCase(addWatchingRecord.fulfilled, (state, action) => {
				state.currentlyWatching = [
					...state.currentlyWatching,
					action.payload,
				];
			})
			.addCase(deleteWatchingRecord.fulfilled, (state, action) => {
				state.currentlyWatching = state.currentlyWatching.filter(
					(currentlyWatching) =>
						currentlyWatching.mediaId !== action.payload.mediaId
				);
			})
			.addCase(addPartnerToRecord.fulfilled, (state, action) => {
				const oldRecord = action.payload.deletedRecord;
				const currentStateWithoutOldRecord =
					state.currentlyWatching.filter(
						(currentlyWatchingRecord) =>
							currentlyWatchingRecord.mediaId !==
								oldRecord.mediaId &&
							currentlyWatchingRecord.usersSortedConcatenated !==
								oldRecord.usersSortedConcatenated
					);
				var currentStateWitoutDeletedRecord;
				const newRecord = action.payload.newRecord;
				if (action.payload.existed) {
					currentStateWitoutDeletedRecord =
						currentStateWithoutOldRecord.filter(
							(currentlyWatchingRecord) =>
								currentlyWatchingRecord.mediaId !==
									newRecord.mediaId &&
								currentlyWatchingRecord.usersSortedConcatenated !==
									newRecord.usersSortedConcatenated
						);
				} else {
					currentStateWitoutDeletedRecord =
						currentStateWithoutOldRecord;
				}

				state.currentlyWatching = [
					...currentStateWitoutDeletedRecord,
					newRecord,
				];
			})
			.addCase(removePartnerFromRecord.fulfilled, (state, action) => {
				const oldRecord = action.payload.deletedRecord;
				const currentStateWithoutOldRecord =
					state.currentlyWatching.filter(
						(currentlyWatchingRecord) =>
							currentlyWatchingRecord.mediaId !==
								oldRecord.mediaId &&
							currentlyWatchingRecord.usersSortedConcatenated !==
								oldRecord.usersSortedConcatenated
					);
				var currentStateWitoutDeletedRecord;
				const newRecord = action.payload.newRecord;
				if (action.payload.existed) {
					currentStateWitoutDeletedRecord =
						currentStateWithoutOldRecord.filter(
							(currentlyWatchingRecord) =>
								currentlyWatchingRecord.mediaId !==
									newRecord.mediaId &&
								currentlyWatchingRecord.usersSortedConcatenated !==
									newRecord.usersSortedConcatenated
						);
				} else {
					currentStateWitoutDeletedRecord =
						currentStateWithoutOldRecord;
				}

				state.currentlyWatching = [
					...currentStateWitoutDeletedRecord,
					newRecord,
				];
			});
	},
});

const client = generateClient<Schema>();

export const updateCurrentlyWatching = createAsyncThunk(
	"currentlyWatching/update",
	async () => {
		console.log("Getting a list of shows currently being watched");
		const watchingList = await client.models.Watching.list().then(
			logErrorsAndReturnData
		);
		return await Promise.all(
			watchingList.map(async (currentlyWatching) => {
				const episodes = await getTvShowEpisodes(
					currentlyWatching.mediaId
				);
				return {
					...currentlyWatching,
					seasons: episodes.seasons,
					seasonCount: episodes.number_of_seasons,
					episodeCount: episodes.number_of_episodes,
				};
			})
		);
	}
);

export const addWatchingRecord = createAsyncThunk(
	"currentlyWatching/add",
	async ({ data, user }: { data: TvShow; user: AuthUser }) => {
		return client.models.Watching.create({
			show: data,
			mediaId: String(data.id),
			with: [user.username],
			usersSortedConcatenated: user.username,
		}).then(logErrorsAndReturnData);
	}
);

export const deleteWatchingRecord = createAsyncThunk(
	"currentlyWatching/delete",
	async (data: Watching) => {
		return client.models.Watching.delete(data).then(logErrorsAndReturnData);
	}
);

export const addPartnerToRecord = createAsyncThunk(
	"currentlyWatching/with/add",
	async ({ data, pairing }: { data: Watching; pairing: Pairing }) => {
		const newMembers = [...data.with, pairing.username];
		return updateWatchingRecordWithNewMembers(data, newMembers);
	}
);

const updateWatchingRecordWithNewMembers = async (
	data: Watching,
	newMembers: string[]
) => {
	const recordWithNewKey = await client.models.Watching.get({
		mediaId: data.mediaId,
		usersSortedConcatenated: sortAndConcatenateUsers(newMembers),
	})
		.then((res) => res.data)
		.catch(console.error);
	let promiseOfNewRecord;
	if (recordWithNewKey) {
		promiseOfNewRecord = client.models.Watching.update({
			mediaId: data.mediaId,
			with: newMembers,
			usersSortedConcatenated: sortAndConcatenateUsers(newMembers),
		})
			.then(logErrorsAndReturnData)
			.then((res) => {
				return { newRecord: res, existed: true };
			});
	} else {
		promiseOfNewRecord = client.models.Watching.create({
			mediaId: data.mediaId,
			show: data.show,
			with: newMembers,
			usersSortedConcatenated: sortAndConcatenateUsers(newMembers),
		})
			.then(logErrorsAndReturnData)
			.then((res) => {
				return { newRecord: res, existed: false };
			});
	}
	return promiseOfNewRecord.then(async (newRecord) => {
		const deletedRecord = await client.models.Watching.delete({
			mediaId: data.mediaId,
			usersSortedConcatenated: data.usersSortedConcatenated,
		}).then(logErrorsAndReturnData);
		return { ...newRecord, deletedRecord: deletedRecord };
	});
};

const sortAndConcatenateUsers = (users: string[]) => {
	return users.sort().join(",");
};

export const removePartnerFromRecord = createAsyncThunk(
	"currentlyWatching/with/remove",
	async ({ data, pairing }: { data: Watching; pairing: Pairing }) => {
		const newMembers = data.with.filter(
			(watchingWith) => watchingWith !== pairing.username
		);
		return updateWatchingRecordWithNewMembers(data, newMembers);
	}
);

export const getTvShowEpisodes = async (tvShowId: string) => {
	console.log("Starting " + tvShowId);
	return await client.queries
		.getTvShowEpisodes({
			seriesId: tvShowId,
		})
		.then(logErrorsAndReturnData)
		.then((nullableEpisodes) => nullableEpisodes);
};

export const {} = currentlyWatchingSlice.actions;
export const selectCurrentlyWatching = (state: RootState) =>
	state.currentlyWatching.currentlyWatching;

// Other code such as selectors can use the imported `RootState` type

export default currentlyWatchingSlice.reducer;
