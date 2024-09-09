import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Schema } from "../../../amplify/data/resource";
import { TvSearchResult, TvShow } from "./SearchResult";

const Search = () => {
	const [searchResults, setSearchResults] =
		useState<Schema["searchTvShows"]["returnType"]>();
	useEffect(() => {
		if (searchResults?.results) {
			let results = searchResults.results.forEach((a) => console.log(a));
			// console.log(results);
			results;
		}
	}, [searchResults]);

	return (
		<>
			<SearchBar setSearchResult={setSearchResults} />
			{searchResults?.results ? <> </> : <></>}
		</>
	);
};

export default Search;
