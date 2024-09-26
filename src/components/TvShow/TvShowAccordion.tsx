import { Accordion } from "@aws-amplify/ui-react";
import TvShowAccordionItem from "./TvShowListElement";
import { TvShow } from "../Search/Search";
import { selectCurrentlyWatching } from "../CurrentlyWatching/currentlyWatchingSlice";
import { useAppSelector } from "../../state/hooks";

type Props = {
	tvShows: TvShow[];
};

const TvShowAccordion = ({ tvShows }: Props) => {
	const currentlyWatching = useAppSelector(selectCurrentlyWatching);
	return (
		<Accordion.Container>
			{tvShows.map((tvShow) => {
				const watchRecord = currentlyWatching.filter(
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
					/>
				);
			})}
		</Accordion.Container>
	);
};

export default TvShowAccordion;
