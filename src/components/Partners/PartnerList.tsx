import PartnerCard from "./PartnerCard";
import { useGetAllPairingsQuery } from "./pairing";
type Props = {};

const PartnerList = ({}: Props) => {
	const { data: currentPairings } = useGetAllPairingsQuery();

	return (
		<div>
			<h1>Current Pairings</h1>
			{currentPairings?.map((pairing) => {
				const partner = pairing.otherUser;
				return (
					<PartnerCard key={pairing.pairing.id} partner={partner} />
				);
			})}
		</div>
	);
};

export default PartnerList;
