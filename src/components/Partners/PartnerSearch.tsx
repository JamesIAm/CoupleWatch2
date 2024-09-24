import { SearchField } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { useState } from "react";
import PartnerCard, { Partner } from "./PartnerCard";

type Props = {
	addPartner: (partner: Partner) => void;
	partnerChangeLocks: string[];
};

const client = generateClient<Schema>();

const PartnerSearch = ({ addPartner, partnerChangeLocks }: Props) => {
	const [searchedPartner, setSearchedPartner] = useState<Partner | undefined>(
		undefined
	);
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
			{searchedPartner ? (
				<PartnerCard
					partner={searchedPartner}
					partnerChangeLocks={partnerChangeLocks}
					addPartner={addPartner}
				/>
			) : (
				<></>
			)}
		</div>
	);
};

export default PartnerSearch;
