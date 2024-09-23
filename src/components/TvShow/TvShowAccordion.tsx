import { Accordion } from "@aws-amplify/ui-react";
import TvShowAccordionItem from "./TvShowListElement";
import { Watching } from "../CurrentlyWatching/CurrentlyWatchingList";
import { TvShow } from "../Search/Search";

type Props = {
	watching: Watching[];
	updateCurrentlyWatching: () => void;
	tvShows: TvShow[];
};

const TvShowAccordion = ({
	watching,
	updateCurrentlyWatching,
	tvShows,
}: Props) => {
	return (
		<Accordion.Container>
			{tvShows.map((result) => {
				let tvShow = result;
				const watchRecord = watching.filter(
					(show) => show.mediaId === String(tvShow.id)
				);
				if (watchRecord.length > 1) {
					throw new Error("More than one matching record");
				}
				return (
					<TvShowAccordionItem
						data={tvShow}
						watchRecord={
							watchRecord.length === 1 ? watchRecord[0] : null
						}
						updateCurrentlyWatching={updateCurrentlyWatching}
					/>
				);
			})}
		</Accordion.Container>
	);
};

export default TvShowAccordion;
