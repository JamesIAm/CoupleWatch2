import { useAppSelector } from "../../state/hooks";
import TvShowAccordion from "../TvShow/TvShowAccordion";
import { selectCurrentlyWatching } from "./currentlyWatchingSlice";

type Props = {};
const CurrentlyWatchingList = ({}: Props) => {
	const currentlyWatching = useAppSelector(selectCurrentlyWatching);
	return (
		<div>
			<h1>CurrentlyWatchingList</h1>
			<TvShowAccordion
				tvShows={currentlyWatching.map((watching) => watching.show)}
			/>
		</div>
	);
};

export default CurrentlyWatchingList;
