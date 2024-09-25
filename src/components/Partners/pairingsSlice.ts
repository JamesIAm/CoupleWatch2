import {
	createAsyncThunk,
	createSelector,
	createSlice,
} from "@reduxjs/toolkit";
import type { RootState } from "../../state/store";
import { AuthUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { Partner } from "./PartnerCard";

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
			})
			.addCase(addPartner.fulfilled, (state, action) => {
				state.pairings.push(action.payload);
			})
			.addCase(removePartner.fulfilled, (state, action) => {
				state.pairings = state.pairings.filter((pairing) => {
					return pairing.username !== action.payload.username;
				});
			});
	},
	selectors: {
		selectPairing: (state: PairingsState, partner: Partner) => {
			for (const currentPairing of state.pairings) {
				if (currentPairing.username === partner.username) {
					return currentPairing;
				}
			}
			return undefined;
		},
	},
});

const client = generateClient<Schema>();

export const updatePairings = createAsyncThunk(
	"pairings/update",
	async (currentUser: AuthUser) => {
		console.log("Getting the list of current pairings");
		return await client.models.Pairing.list().then((res) => {
			return extractOtherUserInfo(res.data, currentUser.username);
		});
	}
);

type PairingEntity = Schema["Pairing"]["type"];

const extractOtherUserInfo = (
	data: PairingEntity[],
	currentUserUsername: string
) => {
	return data
		.map((rawPairing) => {
			return {
				pairingId: rawPairing.id,
				memberInfo: rawPairing.memberInfo
					.filter((memberInfo) => memberInfo != null)
					.filter(
						(memberInfo) =>
							memberInfo.username !== currentUserUsername
					),
			};
		})
		.filter((pairing) => pairing.memberInfo.length === 1)
		.map((pairing) => {
			return {
				pairingId: pairing.pairingId,
				email: pairing.memberInfo[0].email,
				username: pairing.memberInfo[0].username,
			};
		});
};

export const addPartner = createAsyncThunk(
	"pairings/add",
	async ({ partner, user }: { partner: Partner; user: AuthUser }) => {
		// setPartnerChangeLocks([...partnerChangeLocks, user.email]);
		return await client.models.Pairing.create({
			members: [partner.username, user.username],
			memberInfo: [
				{ email: partner.email, username: partner.username },
				{ email: "", username: user.username },
			],
		}).then((res) => {
			console.log(res);
			if (res.data) {
				const pairingOptional = extractOtherUserInfo(
					[res.data],
					user.username
				)[0];
				if (pairingOptional) return pairingOptional;
			}
			throw new Error();
			// dispatch(updatePairings(currentUser));
			// setPartnerChangeLocks(
			// 	[...partnerChangeLocks].filter(
			// 		(lockedUser) => lockedUser !== user.email
			// 	)
			// );
		});
	}
);

export const removePartner = createAsyncThunk(
	"pairings/delete",
	async ({ pairing, user }: { pairing: Pairing; user: AuthUser }) => {
		// setPartnerChangeLocks([...partnerChangeLocks, pairing.email]);
		return await client.models.Pairing.delete({
			id: pairing.pairingId,
		}).then((res) => {
			console.log(res.data);
			if (res.data) {
				const pairingOptional = extractOtherUserInfo(
					[res.data],
					user.username
				)[0];
				if (pairingOptional) return pairingOptional;
			}
			throw new Error();
			// setPartnerChangeLocks(
			// 	[...partnerChangeLocks].filter(
			// 		(lockedUser) => lockedUser !== pairing.email
			// 	)
			// );
		});
	}
);

export const {} = pairingsSlice.actions;
export const {} = pairingsSlice.selectors;
export const selectPairings = (state: RootState) => state.pairings.pairings;
export const selectPairing = createSelector(
	[selectPairings, (_state, partner) => partner],
	(pairings, partner) => {
		for (const currentPairing of pairings) {
			if (currentPairing.username === partner.username) {
				return currentPairing;
			}
		}
		return undefined;
	}
);

// Other code such as selectors can use the imported `RootState` type

export default pairingsSlice.reducer;
