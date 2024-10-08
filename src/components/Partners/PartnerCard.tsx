import { Card, Loader, Button } from "@aws-amplify/ui-react";
import { Partner } from "./partnerSearch";
import {
	useAddPairingMutation,
	useGetAllPairingsQuery,
	useDeletePairingMutation,
} from "./pairing";

type Props = {
	partner: Partner;
};

const PartnerCard = ({ partner }: Props) => {
	const [addPairing, { isLoading: isAdding }] = useAddPairingMutation();
	const [removePairing, { isLoading: isRemoving }] =
		useDeletePairingMutation();
	const { currentPairing } = useGetAllPairingsQuery(undefined, {
		selectFromResult: ({ data }) => ({
			currentPairing: data?.find(
				(pairing) => pairing.otherUser.username === partner.username
			),
		}),
	});
	return (
		<Card>
			{partner.email}
			{isAdding || isRemoving ? (
				<Loader />
			) : currentPairing ? (
				<Button onClick={() => removePairing(currentPairing.pairing)}>
					Remove
				</Button>
			) : (
				<Button onClick={() => addPairing(partner)}>Add</Button>
			)}
		</Card>
	);
};

export default PartnerCard;
