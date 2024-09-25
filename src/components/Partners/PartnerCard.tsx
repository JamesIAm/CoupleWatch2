import { Card, Loader, Button, useAuthenticator } from "@aws-amplify/ui-react";
import { addPartner, removePartner, selectPairing } from "./pairingsSlice";
import { useAppDispatch, useAppSelector } from "../../state/hooks";

export type Partner = {
	email: string;
	username: string;
};
type Props = {
	partner: Partner;
	partnerChangeLocks: string[];
};

const PartnerCard = ({ partner, partnerChangeLocks }: Props) => {
	const dispatch = useAppDispatch();
	const { user } = useAuthenticator((context) => [context.user]);
	const currentPairing = useAppSelector((state) =>
		selectPairing(state, partner)
	);
	console.log(currentPairing);
	return (
		<Card>
			{partner.email}
			{partnerChangeLocks.includes(partner.email) ? (
				<Loader />
			) : currentPairing ? (
				<Button
					onClick={() =>
						dispatch(
							removePartner({ pairing: currentPairing, user })
						)
					}
				>
					Remove
				</Button>
			) : (
				<Button onClick={() => dispatch(addPartner({ partner, user }))}>
					Add
				</Button>
			)}
		</Card>
	);
};

export default PartnerCard;
