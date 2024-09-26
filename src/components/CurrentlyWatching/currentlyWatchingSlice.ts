import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../state/store";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { Pairing } from "../Partners/pairingsSlice";

// Define a type for the slice state
export interface CurrentlyWatchingState {
	status: "pending" | "succeeded" | "failed" | "idle";
	error: string | null;
	currentlyWatching: Watching[];
}
export type Watching = Schema["Watching"]["type"];
export type TvShow = Schema["TvShow"]["type"];

// Define the initial state using that type
const initialState: CurrentlyWatchingState = {
	status: "idle",
	error: null,
	currentlyWatching: [],
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
				const id = action.payload.mediaId;
				const currentStateWithoutUpdatedRecord =
					state.currentlyWatching.filter(
						(currentlyWatchingRecord) =>
							currentlyWatchingRecord.mediaId !== id
					);
				state.currentlyWatching = [
					...currentStateWithoutUpdatedRecord,
					action.payload,
				];
			})
			.addCase(removePartnerFromRecord.fulfilled, (state, action) => {
				const id = action.payload.mediaId;
				const currentStateWithoutUpdatedRecord =
					state.currentlyWatching.filter(
						(currentlyWatchingRecord) =>
							currentlyWatchingRecord.mediaId !== id
					);
				state.currentlyWatching = state.currentlyWatching = [
					...currentStateWithoutUpdatedRecord,
					action.payload,
				];
			});
	},
});

const client = generateClient<Schema>();

export const updateCurrentlyWatching = createAsyncThunk(
	"currentlyWatching/update",
	async () => {
		console.log("Getting a list of shows currently being watched");
		return await client.models.Watching.list().then((res) => {
			if (res.errors) {
				console.error(res.errors);
				throw new Error(res.errors[0].message);
			}
			return res.data;
		});
	}
);

export const addWatchingRecord = createAsyncThunk(
	"currentlyWatching/add",
	async (data: TvShow) => {
		return client.models.Watching.create({
			show: data,
			mediaId: String(data.id),
			with: [],
		}).then((result) => {
			if (result.data) {
				return result.data;
			}
			if (result.errors) {
				throw new Error(result.errors[0].message);
			}
			throw new Error("No data or errors");
		});
	}
);

export const deleteWatchingRecord = createAsyncThunk(
	"currentlyWatching/delete",
	async (data: TvShow) => {
		return client.models.Watching.delete({
			mediaId: String(data.id),
		}).then((result) => {
			if (result.data) {
				return result.data;
			}
			if (result.errors) {
				throw new Error(result.errors[0].message);
			}
			throw new Error("No data or errors");
		});
	}
);

export const addPartnerToRecord = createAsyncThunk(
	"currentlyWatching/with/add",
	async ({ data, pairing }: { data: Watching; pairing: Pairing }) => {
		return client.models.Watching.update({
			mediaId: String(data.mediaId),
			with: [...data.with, pairing.username],
		}).then((res) => {
			if (res.data) {
				return res.data;
			}
			if (res.errors) {
				throw new Error(res.errors[0].message);
			}
			throw new Error("No data or errors");
		});
	}
);

export const removePartnerFromRecord = createAsyncThunk(
	"currentlyWatching/with/remove",
	async ({ data, pairing }: { data: Watching; pairing: Pairing }) => {
		return client.models.Watching.update({
			mediaId: String(data.mediaId),
			with: data.with.filter(
				(watchingWith) => watchingWith !== pairing.username
			),
		}).then((res) => {
			if (res.data) {
				return res.data;
			}
			if (res.errors) {
				throw new Error(res.errors[0].message);
			}

			throw new Error("No data or errors");
		});
	}
);

export const {} = currentlyWatchingSlice.actions;
export const selectCurrentlyWatching = (state: RootState) =>
	state.currentlyWatching.currentlyWatching;

// Other code such as selectors can use the imported `RootState` type

export default currentlyWatchingSlice.reducer;
