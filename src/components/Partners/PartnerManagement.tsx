import { useState } from "react";
import PartnerSearch from "./PartnerSearch";
import { Partner } from "./PartnerCard";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

type Props = {};

const client = generateClient<Schema>();
const PartnerManagement = ({}: Props) => {
	const [partnerChangeLocks, setPartnerChangeLocks] = useState<string[]>([]);
	const addPartner = (user: Partner) => {
		setPartnerChangeLocks([...partnerChangeLocks, user.email]);
		client.models.Pairing.create({
			members: [user.username],
			memberInfo: [{ email: user.email, username: user.username }],
		}).then((res) => {
			console.log(res.data);
			setPartnerChangeLocks(
				[...partnerChangeLocks].filter(
					(lockedUser) => lockedUser !== user.email
				)
			);
		});
	};
	return (
		<PartnerSearch
			addPartner={addPartner}
			partnerChangeLocks={partnerChangeLocks}
		/>
	);
};

export default PartnerManagement;
