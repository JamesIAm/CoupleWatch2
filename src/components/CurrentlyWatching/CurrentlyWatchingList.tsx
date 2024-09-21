import { Schema } from "../../../amplify/data/resource";
import TvShowAccordion from "../TvShow/TvShowAccordion";

export type Watching = Schema["Watching"]["type"];
type Props = {
	currentlyWatching: Watching[];
	updateCurrentlyWatching: () => void;
};
const CurrentlyWatchingList = ({
	currentlyWatching,
	updateCurrentlyWatching,
}: Props) => {
	return (
		<div>
			<h1>CurrentlyWatchingList</h1>
			<TvShowAccordion
				tvShows={currentlyWatching.map((watching) => watching.show)}
				watching={currentlyWatching}
				updateCurrentlyWatching={updateCurrentlyWatching}
			/>
		</div>
	);
};

export default CurrentlyWatchingList;
