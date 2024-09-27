import { useState } from "react";
import SearchBar from "./SearchBar";
import { Schema } from "../../../amplify/data/resource";
import TvShowAccordion from "../TvShow/TvShowAccordion";

type Props = {};
export type TvShow = Schema["TvShow"]["type"];

const Search = ({}: Props) => {
	const [searchResults, setSearchResults] =
		useState<Schema["searchTvShows"]["returnType"]>();
	const tvShows = searchResults?.results
		? (searchResults.results as unknown as TvShow[])
		: new Array<TvShow>();
	return (
		<>
			<SearchBar setSearchResult={setSearchResults} />
			<TvShowAccordion tvShows={tvShows} watchingWith={undefined} />
		</>
	);
};

export default Search;
