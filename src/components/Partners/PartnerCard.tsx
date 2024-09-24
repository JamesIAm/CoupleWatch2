import { Card, Loader, Button } from "@aws-amplify/ui-react";

export type Partner = {
	email: string;
	username: string;
};
type Props = {
	partner: Partner;
	partnerChangeLocks: string[];
	addPartner: (user: Partner) => void;
};

const PartnerCard = ({ partner, partnerChangeLocks, addPartner }: Props) => {
	return (
		<Card>
			{partner.email}
			{partnerChangeLocks.includes(partner.email) ? (
				<Loader />
			) : (
				<Button onClick={() => addPartner(partner)}>Add</Button>
			)}
		</Card>
	);
};

export default PartnerCard;
