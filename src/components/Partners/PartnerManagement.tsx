import { useEffect } from "react";
import PartnerSearch from "./PartnerSearch";
import { useAppDispatch } from "../../state/hooks";
import { updatePairings } from "./pairingsSlice";
import PartnerList from "./PartnerList";
import { useAuthenticator } from "@aws-amplify/ui-react";

type Props = {};

const PartnerManagement = ({}: Props) => {
	const dispatch = useAppDispatch();
	const { user } = useAuthenticator((context) => [context.user]);
	useEffect(() => {
		dispatch(updatePairings(user));
	}, []);

	return (
		<div>
			<PartnerSearch />
			<PartnerList />
		</div>
	);
};

export default PartnerManagement;
