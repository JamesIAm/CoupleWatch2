import { useState } from "react";
import SearchBar from "./SearchBar";
import { Schema } from "../../../amplify/data/resource";
import TvShowListElement from "../TvShow/TvShowListElement";

const Search = () => {
	const [searchResults, setSearchResults] =
		useState<Schema["searchTvShows"]["returnType"]>();

	return (
		<>
			<SearchBar setSearchResult={setSearchResults} />
			{searchResults?.results ? (
				<ul>
					{searchResults.results.map((result) => {
						let tvShow = result as Schema["TvShow"]["type"];
						return <TvShowListElement data={tvShow} />;
					})}
				</ul>
			) : (
				<></>
			)}
		</>
	);
};

export default Search;
