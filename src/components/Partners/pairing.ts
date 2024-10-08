import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { Partner } from "./partnerSearch";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";

const client = generateClient<Schema>();
export type Pairing = Schema["Pairing"]["type"];

export type UserPairing = {
	pairing: Pairing;
	otherUser: Partner;
};

export const pairingApi = createApi({
	reducerPath: "pairingApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["Pairing"],
	endpoints: (builder) => ({
		getAllPairings: builder.query<UserPairing[], void>({
			queryFn: async () => {
				try {
					const { data, errors } = await client.models.Pairing.list();
					if (data) {
						const { username: currentUserUsername } =
							await getCurrentUser();
						const userPairings = data.flatMap((pairing) => {
							const otherUser = pairing.memberInfo.find(
								(memberInfo) =>
									memberInfo.username !== currentUserUsername
							);
							if (!otherUser) {
								return [];
							}
							return { pairing, otherUser };
						});
						return { data: userPairings };
					}
					if (errors) {
						return { error: errors };
					}
					return { error: "No data" };
				} catch (error) {
					return { error: "error" };
				}
			},
			providesTags: (result) => {
				if (result) {
					return [
						...result.map(
							({ pairing }) =>
								({ type: "Pairing", id: pairing.id } as const)
						),
						{ type: "Pairing", id: "LIST" },
					];
				} else {
					return [{ type: "Pairing", id: "LIST" }];
				}
			},
		}),
		getPairing: builder.query<Pairing, string>({
			queryFn: async (id) => {
				try {
					const { data, errors } = await client.models.Pairing.get({
						id,
					});
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
			providesTags: (_result, _error, id) => [{ type: "Pairing", id }],
		}),
		addPairing: builder.mutation<Pairing, Partner>({
			queryFn: async (partner) => {
				try {
					const { username } = await getCurrentUser();
					const { email } = await fetchUserAttributes();
					const { data, errors } = await client.models.Pairing.create(
						{
							members: [username, partner.username],
							memberInfo: [
								partner,
								{ email: email || "", username },
							],
						}
					);
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
			invalidatesTags: () => [{ type: "Pairing", id: "LIST" }],
		}),
		deletePairing: builder.mutation<Pairing, Pairing>({
			queryFn: async ({ id }) => {
				try {
					const { data, errors } = await client.models.Pairing.delete(
						{ id }
					);
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
			invalidatesTags: () => [{ type: "Pairing", id: "LIST" }],
		}),
	}),
});
export const {
	useGetAllPairingsQuery,
	useAddPairingMutation,
	useGetPairingQuery,
	useDeletePairingMutation,
} = pairingApi;
