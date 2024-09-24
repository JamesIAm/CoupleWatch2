import { SearchField } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { useState } from "react";
import PartnerCard, { Pairing, Partner } from "./PartnerCard";

type Props = {
	addPartner: (partner: Partner) => void;
	removePartner: (pairing: Pairing) => void;
	partnerChangeLocks: string[];
	currentPairings: Pairing[];
};

const client = generateClient<Schema>();

const PartnerSearch = ({
	addPartner,
	removePartner,
	partnerChangeLocks,
	currentPairings,
}: Props) => {
	const [searchedPartner, setSearchedPartner] = useState<Partner | undefined>(
		undefined
	);
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

	const getPairing = (searchedPartner: Partner) => {
		for (const currentPairing of currentPairings) {
			if (currentPairing.username === searchedPartner.username) {
				return currentPairing;
			}
		}
		return undefined;
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
					pairing={getPairing(searchedPartner)}
					removePartner={removePartner}
				/>
			) : (
				<></>
			)}
		</div>
	);
};

export default PartnerSearch;
