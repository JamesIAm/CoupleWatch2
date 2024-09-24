import { useState } from "react";
import PartnerSearch from "./PartnerSearch";
import { Pairing, Partner } from "./PartnerCard";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { remove } from "aws-amplify/storage";

type Props = {
	currentPairings: Pairing[];
	updateCurrentPartners: () => void;
};

const client = generateClient<Schema>();
const PartnerManagement = ({
	currentPairings,
	updateCurrentPartners,
}: Props) => {
	const [partnerChangeLocks, setPartnerChangeLocks] = useState<string[]>([]);
	const addPartner = (user: Partner) => {
		setPartnerChangeLocks([...partnerChangeLocks, user.email]);
		client.models.Pairing.create({
			members: [user.username],
			memberInfo: [{ email: user.email, username: user.username }],
		}).then((res) => {
			console.log(res.data);
			updateCurrentPartners();
			setPartnerChangeLocks(
				[...partnerChangeLocks].filter(
					(lockedUser) => lockedUser !== user.email
				)
			);
		});
	};

	const removePartner = (pairing: Pairing) => {
		setPartnerChangeLocks([...partnerChangeLocks, pairing.email]);
		client.models.Pairing.delete({
			id: pairing.pairingId,
		}).then((res) => {
			console.log(res.data);
			updateCurrentPartners();
			setPartnerChangeLocks(
				[...partnerChangeLocks].filter(
					(lockedUser) => lockedUser !== pairing.email
				)
			);
		});
	};
	return (
		<PartnerSearch
			addPartner={addPartner}
			removePartner={removePartner}
			partnerChangeLocks={partnerChangeLocks}
			currentPairings={currentPairings}
		/>
	);
};

export default PartnerManagement;
