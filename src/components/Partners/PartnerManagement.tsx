import { useEffect, useState } from "react";
import PartnerSearch from "./PartnerSearch";
import { Pairing, Partner } from "./PartnerCard";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { AuthUser } from "aws-amplify/auth";

type Props = {
	currentPairings: Pairing[];
	updateCurrentPartners: (currentUserUsername: string) => void;
	currentUser: AuthUser;
};

const client = generateClient<Schema>();
const PartnerManagement = ({
	currentPairings,
	updateCurrentPartners,
	currentUser,
}: Props) => {
	const [partnerChangeLocks, setPartnerChangeLocks] = useState<string[]>([]);
	useEffect(() => {
		updateCurrentPartners(currentUser.username);
	}, []);
	const addPartner = async (user: Partner) => {
		setPartnerChangeLocks([...partnerChangeLocks, user.email]);
		client.models.Pairing.create({
			members: [user.username, currentUser.username],
			memberInfo: [
				{ email: user.email, username: user.username },
				{ email: "", username: currentUser.username },
			],
		}).then((res) => {
			console.log(res);
			updateCurrentPartners(currentUser.username);
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
			updateCurrentPartners(currentUser.username);
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
			currentUser={currentUser}
		/>
	);
};

export default PartnerManagement;
