import { useState } from "react";
import SearchBar from "./SearchBar";
import { Schema } from "../../../amplify/data/resource";
import TvShowAccordionItem from "../TvShow/TvShowListElement";
import { Watching } from "../CurrentlyWatching/CurrentlyWatchingList";
import { Accordion } from "@aws-amplify/ui-react";

type Props = { watching: Watching[] };
type TvShow = Schema["TvShow"]["type"];

const Search = ({ watching }: Props) => {
	const [searchResults, setSearchResults] =
		useState<Schema["searchTvShows"]["returnType"]>();

	return (
		<>
			<SearchBar setSearchResult={setSearchResults} />
			<Accordion.Container>
				{searchResults?.results ? (
					(searchResults.results as TvShow[]).map((result) => {
						let tvShow = result;
						const isBeingWatchedCurrently =
							watching.filter(
								(show) => show.mediaId === String(tvShow.id)
							).length !== 0;
						return (
							<TvShowAccordionItem
								data={tvShow}
								currentlyWatching={isBeingWatchedCurrently}
							/>
						);
					})
				) : (
					<></>
				)}
			</Accordion.Container>
		</>
	);
};

export default Search;
