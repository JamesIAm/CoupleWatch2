import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { selectPairings } from "./pairingsSlice";

type Props = {};

const PartnerList = (props: Props) => {
	const currentPairings = useAppSelector(selectPairings);
	console.log(currentPairings);
	return <div>PartnerList</div>;
};

export default PartnerList;
