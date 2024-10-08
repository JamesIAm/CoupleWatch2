import PartnerSearch from "./PartnerSearch";
import PartnerList from "./PartnerList";

type Props = {};

const PartnerManagement = ({}: Props) => {
	return (
		<div>
			<PartnerList />
			<PartnerSearch />
		</div>
	);
};

export default PartnerManagement;
