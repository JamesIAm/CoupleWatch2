import { useEffect, useState } from "react";
import PartnerSearch from "./PartnerSearch";
import { Partner } from "./PartnerCard";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { useAppDispatch } from "../../state/hooks";
import { Pairing, updatePairings } from "./pairingsSlice";
import PartnerList from "./PartnerList";
import { useAuthenticator } from "@aws-amplify/ui-react";

type Props = {};

const client = generateClient<Schema>();
const PartnerManagement = () => {
	const dispatch = useAppDispatch();
	const [partnerChangeLocks, setPartnerChangeLocks] = useState<string[]>([]);
	const { user } = useAuthenticator((context) => [context.user]);
	useEffect(() => {
		dispatch(updatePairings(user));
	}, []);

	return (
		<div>
			<PartnerSearch partnerChangeLocks={partnerChangeLocks} />
			<PartnerList />
		</div>
	);
};

export default PartnerManagement;
