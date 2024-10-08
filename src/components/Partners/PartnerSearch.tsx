import { Card, Placeholder, SearchField } from "@aws-amplify/ui-react";
import { useState } from "react";
import PartnerCard from "./PartnerCard";
import { useSearchPartnerQuery } from "./partnerSearch";

type Props = {};

const PartnerSearch = ({}: Props) => {
	const [searchTerm, setSearchTerm] = useState<string>("");

	const { data: searchedPartner, isFetching } =
		useSearchPartnerQuery(searchTerm);

	const renderSearchedPartner = () => {
		{
			if (isFetching) {
				return <Placeholder size="large" />;
			}
			if (!searchTerm) {
				return <></>;
			}
			if (!searchedPartner) {
				return (
					<Card>
						Not found, ensure you search by their full email address
					</Card>
				);
			}
			return <PartnerCard partner={searchedPartner} />;
		}
	};

	return (
		<div>
			<h2>Find a partner</h2>
			<SearchField
				label="Find a partner"
				placeholder="example@gmail.com"
				hasSearchIcon={true}
				onSubmit={(searchTerm) => setSearchTerm(searchTerm)}
				onClear={() => setSearchTerm("")}
				onChange={() => setSearchTerm("")}
			/>
			{renderSearchedPartner()}
		</div>
	);
};

export default PartnerSearch;
