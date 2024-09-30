import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { SearchField } from "@aws-amplify/ui-react";

type Props = {
	setSearchResult: React.Dispatch<
		React.SetStateAction<
			Schema["searchTvShows"]["returnType"] | null | undefined
		>
	>;
};
const client = generateClient<Schema>();
const SearchBar = ({ setSearchResult }: Props) => {
	const search = async (searchTerm: string) => {
		let output = await client.queries.searchTvShows({
			query: searchTerm,
		});
		setSearchResult(output.data);
	};
	return (
		<>
			<h1>Search</h1>
			<SearchField
				label="Find a tv show"
				hasSearchIcon={true}
				onSubmit={(searchTerm) => search(searchTerm)}
				onClear={() => setSearchResult(undefined)}
				onChange={() => setSearchResult(undefined)}
			/>
		</>
	);
};

export default SearchBar;
