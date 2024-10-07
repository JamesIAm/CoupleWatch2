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
import { logErrorsAndReturnData } from "../../utils/ClientUtils";

export interface PairingsState {
	pairings: Pairing[];
	changeLocks: string[];
}
export type Pairing = {
	email: string;
	username: string;
	pairingId: string;
};

const initialState: PairingsState = {
	pairings: [],
	changeLocks: [],
};

export const pairingsSlice = createSlice({
	name: "pairings",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(updatePairings.fulfilled, (state, action) => {
				state.pairings = action.payload;
			})
			.addCase(addPartner.pending, (state, action) => {
				state.changeLocks = [
					...state.changeLocks,
					action.meta.arg.partner.username,
				];
			})
			.addCase(addPartner.fulfilled, (state, action) => {
				state.changeLocks = state.changeLocks.filter(
					(lockedUsername) => {
						lockedUsername !== action.meta.arg.partner.username;
					}
				);
				state.pairings = [...state.pairings, action.payload];
			})
			.addCase(addPartner.rejected, (state, action) => {
				state.changeLocks = state.changeLocks.filter(
					(lockedUsername) => {
						lockedUsername !== action.meta.arg.partner.username;
					}
				);
			})
			.addCase(removePartner.pending, (state, action) => {
				state.changeLocks = [
					...state.changeLocks,
					action.meta.arg.pairing.username,
				];
			})
			.addCase(removePartner.fulfilled, (state, action) => {
				state.pairings = state.pairings.filter((pairing) => {
					return pairing.username !== action.payload.username;
				});
				state.changeLocks = state.changeLocks.filter(
					(lockedUsername) => {
						lockedUsername !== action.meta.arg.pairing.username;
					}
				);
			})
			.addCase(removePartner.rejected, (state, action) => {
				state.changeLocks = state.changeLocks.filter(
					(lockedUsername) => {
						lockedUsername !== action.meta.arg.pairing.username;
					}
				);
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
		return await client.models.Pairing.list()
			.then(logErrorsAndReturnData)
			.then((data) => {
				return extractOtherUserInfo(data, currentUser.username);
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
		return await client.models.Pairing.create({
			members: [partner.username, user.username],
			memberInfo: [
				{ email: partner.email, username: partner.username },
				{ email: "", username: user.username },
			],
		})
			.then(logErrorsAndReturnData)
			.then((res) => {
				const pairingOptional = extractOtherUserInfo(
					[res],
					user.username
				)[0];
				if (pairingOptional) return pairingOptional;
				throw new Error("Pairing not found");
			});
	}
);

export const removePartner = createAsyncThunk(
	"pairings/delete",
	async ({ pairing, user }: { pairing: Pairing; user: AuthUser }) => {
		return await client.models.Pairing.delete({
			id: pairing.pairingId,
		})
			.then(logErrorsAndReturnData)
			.then((res) => {
				const pairingOptional = extractOtherUserInfo(
					[res],
					user.username
				)[0];
				if (pairingOptional) return pairingOptional;
				throw new Error();
			});
	}
);

export const {} = pairingsSlice.actions;
export const {} = pairingsSlice.selectors;
export const selectPairings = (state: RootState) => state.pairings.pairings;
export const selectPartnerChangeLocks = (state: RootState) =>
	state.pairings.changeLocks;
export const selectPartnerChangeLock = createSelector(
	[selectPartnerChangeLocks, (_state, partner) => partner],
	(partnerChangeLocks, partner) => {
		return partnerChangeLocks.includes(partner.username);
	}
);
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
