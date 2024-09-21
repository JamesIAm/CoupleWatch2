import { Accordion } from "@aws-amplify/ui-react";
import React from "react";
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
				const isBeingWatchedCurrently =
					watching.filter(
						(show) => show.mediaId === String(tvShow.id)
					).length !== 0;
				return (
					<TvShowAccordionItem
						data={tvShow}
						currentlyWatching={isBeingWatchedCurrently}
						updateCurrentlyWatching={updateCurrentlyWatching}
					/>
				);
			})}
		</Accordion.Container>
	);
};

export default TvShowAccordion;
