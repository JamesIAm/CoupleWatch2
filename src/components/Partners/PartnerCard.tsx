import { Card, Loader, Button } from "@aws-amplify/ui-react";
import { Pairing } from "./pairingsSlice";

export type Partner = {
	email: string;
	username: string;
};
type Props = {
	partner: Partner;
	partnerChangeLocks: string[];
	addPartner: (user: Partner) => void;
	pairing: Pairing | undefined;
	removePartner: (pairing: Pairing) => void;
};

const PartnerCard = ({
	partner,
	partnerChangeLocks,
	addPartner,
	pairing,
	removePartner,
}: Props) => {
	console.log(pairing);
	return (
		<Card>
			{partner.email}
			{partnerChangeLocks.includes(partner.email) ? (
				<Loader />
			) : pairing ? (
				<Button onClick={() => removePartner(pairing)}>Remove</Button>
			) : (
				<Button onClick={() => addPartner(partner)}>Add</Button>
			)}
		</Card>
	);
};

export default PartnerCard;
