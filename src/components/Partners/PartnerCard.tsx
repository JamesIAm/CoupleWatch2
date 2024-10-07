import { Card, Loader, Button, useAuthenticator } from "@aws-amplify/ui-react";
import {
	addPartner,
	removePartner,
	selectPairing,
	selectPartnerChangeLock,
} from "./pairingsSlice";
import { useAppDispatch, useAppSelector } from "../../state/hooks";

export type Partner = {
	email: string;
	username: string;
};
type Props = {
	partner: Partner;
};

const PartnerCard = ({ partner }: Props) => {
	const dispatch = useAppDispatch();
	const { user } = useAuthenticator((context) => [context.user]);
	const currentPairing = useAppSelector((state) =>
		selectPairing(state, partner)
	);
	const isLocked = useAppSelector((state) =>
		selectPartnerChangeLock(state, partner)
	);
	return (
		<Card>
			{partner.email}
			{isLocked ? (
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
