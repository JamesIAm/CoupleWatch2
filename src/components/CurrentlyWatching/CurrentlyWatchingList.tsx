import { useAppSelector } from "../../state/hooks";
import TvShowAccordion from "../TvShow/TvShowAccordion";
import { selectCurrentlyWatching } from "./currentlyWatchingSlice";

type Props = {};
const CurrentlyWatchingList = ({}: Props) => {
	const currentlyWatching = useAppSelector(selectCurrentlyWatching);
	const currentlyWatchingShows = currentlyWatching.map(
		(watching) => watching.show
	);
	const uniqueCurrentlyWatchingShows = currentlyWatchingShows.filter(
		(show, index) =>
			currentlyWatchingShows.findIndex(
				(otherShow) => show.id === otherShow.id
			) === index
	);
	console.log(uniqueCurrentlyWatchingShows);
	return (
		<div>
			<h1>CurrentlyWatchingList</h1>
			<TvShowAccordion
				tvShows={[...uniqueCurrentlyWatchingShows]}
				watchingWith={undefined}
			/>
		</div>
	);
};

export default CurrentlyWatchingList;
