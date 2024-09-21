import { useState } from "react";
import SearchBar from "./SearchBar";
import { Schema } from "../../../amplify/data/resource";
import { Watching } from "../CurrentlyWatching/CurrentlyWatchingList";
import TvShowAccordion from "../TvShow/TvShowAccordion";

type Props = { watching: Watching[]; updateCurrentlyWatching: () => void };
export type TvShow = Schema["TvShow"]["type"];

const Search = ({ watching, updateCurrentlyWatching }: Props) => {
	const [searchResults, setSearchResults] =
		useState<Schema["searchTvShows"]["returnType"]>();
	return (
		<>
			<SearchBar setSearchResult={setSearchResults} />
			<TvShowAccordion
				tvShows={
					searchResults?.results
						? (searchResults.results as TvShow[])
						: new Array<TvShow>()
				}
				watching={watching}
				updateCurrentlyWatching={updateCurrentlyWatching}
			/>
		</>
	);
};

export default Search;
