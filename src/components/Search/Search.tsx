import { useState } from "react";
import SearchBar from "./SearchBar";
import { Schema } from "../../../amplify/data/resource";
import TvShowListElement from "../TvShow/TvShowListElement";
import { Watching } from "../CurrentlyWatching/CurrentlyWatchingList";

type Props = { watching: Watching[] };

const Search = ({ watching }: Props) => {
	const [searchResults, setSearchResults] =
		useState<Schema["searchTvShows"]["returnType"]>();

	return (
		<>
			<SearchBar setSearchResult={setSearchResults} />
			{searchResults?.results ? (
				<ul>
					{searchResults.results.map((result) => {
						let tvShow = result as Schema["TvShow"]["type"];
						const isBeingWatchedCurrently =
							watching.filter(
								(show) => show.mediaId === String(tvShow.id)
							).length !== 0;
						return (
							<TvShowListElement
								data={tvShow}
								currentlyWatching={isBeingWatchedCurrently}
							/>
						);
					})}
				</ul>
			) : (
				<></>
			)}
		</>
	);
};

export default Search;
