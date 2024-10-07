import { useAppSelector } from "../../state/hooks";
import { selectPairings } from "./pairingsSlice";
import PartnerCard from "./PartnerCard";

type Props = {};

const PartnerList = ({}: Props) => {
	const currentPairings = useAppSelector(selectPairings);
	return (
		<div>
			<h1>Current Pairings</h1>
			{currentPairings.map((pairing) => (
				<PartnerCard key={pairing.pairingId} partner={pairing} />
			))}
		</div>
	);
};

export default PartnerList;
