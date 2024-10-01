import SearchBar from "./SearchBar";
import { Schema } from "../../../amplify/data/resource";
import TvShowAccordion from "../TvShow/TvShowAccordion";
import { useAppSelector } from "../../state/hooks";
import { selectSearchResults } from "./searchSlice";

type Props = {};
export type TvShow = Schema["TvShow"]["type"];

const Search = ({}: Props) => {
	const searchResults = useAppSelector(selectSearchResults);
	return (
		<>
			<SearchBar />
			<TvShowAccordion tvShows={searchResults} watchingWith={undefined} />
		</>
	);
};

export default Search;
