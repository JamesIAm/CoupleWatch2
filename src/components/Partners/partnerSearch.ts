import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();
export type Partner = Schema["Partner"]["type"];

export const partnerSearchApi = createApi({
	reducerPath: "partnerSearchApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["PartnerSearch"],
	endpoints: (builder) => ({
		searchPartner: builder.query<Partner, string>({
			queryFn: async (email) => {
				if (email === "") {
					return { data: undefined };
				}
				try {
					const { data: username, errors } =
						await client.queries.searchUser({ email });
					if (username) {
						return { data: { email, username } };
					}
					if (errors) {
						return { error: errors };
					}
					return { error: "No data" };
				} catch (error) {
					return { error: "error" };
				}
			},
			providesTags: (_result, _error, _arg) => [
				{ type: "PartnerSearch", id: "LIST" },
			],
		}),
	}),
});
export const { useSearchPartnerQuery } = partnerSearchApi;
