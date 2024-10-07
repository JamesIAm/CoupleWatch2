import { SearchField } from "@aws-amplify/ui-react";

type Props = { setSearchTerm: (arg0: string) => void };
const SearchBar = ({ setSearchTerm }: Props) => {
	return (
		<>
			<h1>Search</h1>
			<SearchField
				label="Find a tv show"
				hasSearchIcon={true}
				onSubmit={(searchTerm) => setSearchTerm(searchTerm)}
				onClear={() => {
					setSearchTerm("");
				}}
				// onChange={(e) => {
				// 	setSearchTerm("");
				// }}
			/>
		</>
	);
};

export default SearchBar;
