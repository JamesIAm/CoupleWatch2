import SearchBar from "./SearchBar";
import { Schema } from "../../../amplify/data/resource";
import { useAppSelector } from "../../state/hooks";
import { selectSearchResults } from "./searchSlice";
import { useGetCurrentlyWatchingQuery } from "../CurrentlyWatching/currentlyWatching";
import { AccordionTvShow } from "../TvShow/TvShowAccordionItem";
import TvShowAccordion from "../TvShow/TvShowAccordion";

type Props = {};
export type TvShow = Schema["TvShow"]["type"];

const Search = ({}: Props) => {
	const searchResults = useAppSelector(selectSearchResults);
	const { data: currentlyWatching } = useGetCurrentlyWatchingQuery();
	const mapTvShowsToCurrentlyWatchingRecords = (): AccordionTvShow[] => {
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
			<SearchBar />
			<TvShowAccordion tvShows={mapTvShowsToCurrentlyWatchingRecords()} />
		</>
	);
};

export default Search;
