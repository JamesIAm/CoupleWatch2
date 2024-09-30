import {
	Card,
	Placeholder,
	SearchField,
	useAuthenticator,
} from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { useState } from "react";
import PartnerCard, { Partner } from "./PartnerCard";

type Props = {};

const client = generateClient<Schema>();

const PartnerSearch = ({}: Props) => {
	const [searchedPartner, setSearchedPartner] = useState<
		Partner | null | undefined
	>(undefined);
	const [searching, setSearching] = useState<boolean>(false);

	const { user } = useAuthenticator((context) => [context.user]);
	console.log(searchedPartner);
	const searchForUser = (email: string) => {
		setSearching(true);
		client.queries.searchUser({ email: email }).then((res) => {
			setSearching(false);
			if (res.errors) {
				throw new Error(res.errors[0].message);
			}
			if (res.data) {
				setSearchedPartner({ email: email, username: res.data });
			} else {
				setSearchedPartner(null);
			}
		});
	};

	const renderSearchedPartner = () => {
		{
			if (searching) {
				return <Placeholder size="large" />;
			}
			if (searchedPartner === undefined) {
				return <></>;
			}
			if (
				searchedPartner === null ||
				(searchedPartner && searchedPartner.username === user.username)
			) {
				return (
					<Card>
						Not found, ensure you search by their full email address
					</Card>
				);
			}
			return <PartnerCard partner={searchedPartner} />;
		}
	};

	return (
		<div>
			<h2>Find a partner</h2>
			<SearchField
				label="Find a partner"
				placeholder="example@gmail.com"
				hasSearchIcon={true}
				onSubmit={(searchTerm) => searchForUser(searchTerm)}
				onClear={() => setSearchedPartner(undefined)}
				onChange={() => setSearchedPartner(undefined)}
			/>
			{renderSearchedPartner()}
		</div>
	);
};

export default PartnerSearch;
