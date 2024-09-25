import { SearchField, useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { useState } from "react";
import PartnerCard, { Partner } from "./PartnerCard";

type Props = {};

const client = generateClient<Schema>();

const PartnerSearch = ({}: Props) => {
	const [searchedPartner, setSearchedPartner] = useState<Partner | undefined>(
		undefined
	);

	const { user } = useAuthenticator((context) => [context.user]);
	console.log(searchedPartner);
	const searchForUser = (email: string) => {
		client.queries.searchUser({ email: email }).then((res) => {
			console.log(res);
			if (res.data) {
				setSearchedPartner({ email: email, username: res.data });
			} else {
				setSearchedPartner(undefined);
			}
		});
	};

	return (
		<div>
			<h2>Find a partner</h2>
			<SearchField
				label="Find a partner"
				hasSearchIcon={true}
				onSubmit={(searchTerm) => searchForUser(searchTerm)}
				onClear={() => setSearchedPartner(undefined)}
				onChange={() => setSearchedPartner(undefined)}
			/>
			{searchedPartner && searchedPartner.username !== user.username ? (
				<PartnerCard partner={searchedPartner} />
			) : (
				<></>
			)}
		</div>
	);
};

export default PartnerSearch;
