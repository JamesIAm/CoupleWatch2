import SearchBar from "./SearchBar";
import { Schema } from "../../../amplify/data/resource";
import { useGetAllCurrentlyWatchingQuery } from "../CurrentlyWatching/currentlyWatching";
import { AccordionTvShow } from "../TvShow/TvShowAccordionItem";
import TvShowAccordion from "../TvShow/TvShowAccordion";
import { useState } from "react";
import { useSearchQuery } from "./searchResults";

type Props = {};
export type TvShow = Schema["TvShow"]["type"];

const Search = ({}: Props) => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const { data: searchResults } = useSearchQuery(searchTerm);
	const { data: currentlyWatching } = useGetAllCurrentlyWatchingQuery();
	const mapTvShowsToCurrentlyWatchingRecords = (): AccordionTvShow[] => {
		if (!searchResults) {
			return [];
		}
		return searchResults.map((searchResult) => {
			const watchRecord = currentlyWatching?.find(
				(watchRecord) => watchRecord.mediaId === searchResult.mediaId
			);
			if (watchRecord) {
				return {
					data: watchRecord,
					isWatching: true,
				};
			} else {
				return {
					data: searchResult,
					isWatching: false,
				};
			}
		});
	};
	return (
		<>
			<SearchBar setSearchTerm={setSearchTerm} />
			<TvShowAccordion tvShows={mapTvShowsToCurrentlyWatchingRecords()} />
		</>
	);
};

export default Search;
