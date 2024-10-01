import { SearchField } from "@aws-amplify/ui-react";
import { useAppDispatch } from "../../state/hooks";
import { clearSearchResults, searchTvShow } from "./searchSlice";

type Props = {};
const SearchBar = ({}: Props) => {
	const dispatch = useAppDispatch();
	return (
		<>
			<h1>Search</h1>
			<SearchField
				label="Find a tv show"
				hasSearchIcon={true}
				onSubmit={(searchTerm) => dispatch(searchTvShow(searchTerm))}
				onClear={() => dispatch(clearSearchResults())}
				onChange={() => dispatch(clearSearchResults())}
			/>
		</>
	);
};

export default SearchBar;
