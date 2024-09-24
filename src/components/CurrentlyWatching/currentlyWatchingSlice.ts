import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../state/store";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

// Define a type for the slice state
export interface CurrentlyWatchingState {
	status: "pending" | "succeeded" | "failed" | "idle";
	error: string | null;
	currentlyWatching: Watching[];
}
export type Watching = Schema["Watching"]["type"];

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
			});
	},
});

const client = generateClient<Schema>();

export const updateCurrentlyWatching = createAsyncThunk(
	"currentlyWatching/update",
	async () => {
		console.log("Getting a list of shows currently being watched");
		return await client.models.Watching.list().then((res) => {
			console.log(res);
			return res.data;
		});
	}
);

export const {} = currentlyWatchingSlice.actions;
export const selectCurrentlyWatching = (state: RootState) =>
	state.currentlyWatching.currentlyWatching;

// Other code such as selectors can use the imported `RootState` type

export default currentlyWatchingSlice.reducer;
