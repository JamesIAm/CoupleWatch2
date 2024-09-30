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
type SearchState = "idle" | "searching" | "notFound" | "found";
type SearchedPartner = {
	state: SearchState;
	partner?: Partner;
};

const client = generateClient<Schema>();

const PartnerSearch = ({}: Props) => {
	const [searchedPartner, setSearchedPartner] = useState<SearchedPartner>({
		state: "idle",
	});

	const { user } = useAuthenticator((context) => [context.user]);
	console.log(searchedPartner);
	const searchForUser = (email: string) => {
		setSearchedPartner({ state: "searching" });
		client.queries.searchUser({ email: email }).then((res) => {
			if (res.errors) {
				setSearchedPartner({ state: "idle" });
				throw new Error(res.errors[0].message);
			}
			if (res.data) {
				setSearchedPartner({
					state: "found",
					partner: { email: email, username: res.data },
				});
			} else {
				setSearchedPartner({ state: "notFound" });
			}
		});
	};

	const renderSearchedPartner = () => {
		{
			if (searchedPartner.state === "searching") {
				return <Placeholder size="large" />;
			}
			if (searchedPartner.state === "idle") {
				return <></>;
			}
			if (
				searchedPartner.state === "notFound" ||
				searchedPartner?.partner?.username === user.username
			) {
				return (
					<Card>
						Not found, ensure you search by their full email address
					</Card>
				);
			}
			if (!searchedPartner.partner) {
				throw new Error(
					"Invalid state combination, seached partner state is " +
						searchedPartner.state +
						", and seachedPartner is undefined"
				);
			}
			return <PartnerCard partner={searchedPartner.partner} />;
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
				onClear={() => setSearchedPartner({ state: "idle" })}
				onChange={() => setSearchedPartner({ state: "idle" })}
			/>
			{renderSearchedPartner()}
		</div>
	);
};

export default PartnerSearch;
