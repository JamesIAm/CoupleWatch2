import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../state/store";
import { AuthUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

// Define a type for the slice state
export interface PairingsState {
	pairings: Pairing[];
	status: "pending" | "succeeded" | "failed" | "idle";
	error: string | null;
}
export type Pairing = {
	email: string;
	username: string;
	pairingId: string;
};

// Define the initial state using that type
const initialState: PairingsState = {
	pairings: [],
	status: "idle",
	error: null,
};

export const pairingsSlice = createSlice({
	name: "pairings",
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(updatePairings.pending, (state, _action) => {
				state.status = "pending";
			})
			.addCase(updatePairings.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Add any fetched posts to the array
				state.pairings = action.payload;
			})
			.addCase(updatePairings.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message ?? "Unknown Error";
			});
	},
});

const client = generateClient<Schema>();

export const updatePairings = createAsyncThunk(
	"pairings/update",
	async (currentUser: AuthUser) => {
		console.log("Getting the list of current pairings");
		return await client.models.Pairing.list().then((res) => {
			return res.data
				.map((rawPairing) => {
					return {
						pairingId: rawPairing.id,
						memberInfo: rawPairing.memberInfo
							.filter((memberInfo) => memberInfo != null)
							.filter(
								(memberInfo) =>
									memberInfo.username !== currentUser.username
							),
					};
				})
				.filter((pairing) => pairing.memberInfo.length === 1)
				.map((pairing) => {
					return {
						...pairing,
						email: pairing.memberInfo[0].email,
						username: pairing.memberInfo[0].username,
					};
				});
		});
	}
);

export const {} = pairingsSlice.actions;
export const selectPairings = (state: RootState) => state.pairings.pairings;

// Other code such as selectors can use the imported `RootState` type

export default pairingsSlice.reducer;
