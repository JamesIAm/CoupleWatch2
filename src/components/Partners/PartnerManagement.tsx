import { useEffect, useState } from "react";
import PartnerSearch from "./PartnerSearch";
import { Partner } from "./PartnerCard";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { AuthUser } from "aws-amplify/auth";
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { Pairing, selectPairings, updatePairings } from "./pairingsSlice";

type Props = {
	currentUser: AuthUser;
};

const client = generateClient<Schema>();
const PartnerManagement = ({ currentUser }: Props) => {
	const dispatch = useAppDispatch();
	const [partnerChangeLocks, setPartnerChangeLocks] = useState<string[]>([]);
	useEffect(() => {
		dispatch(updatePairings(currentUser));
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
			dispatch(updatePairings(currentUser));
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
			dispatch(updatePairings(currentUser));
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
			currentUser={currentUser}
		/>
	);
};

export default PartnerManagement;
