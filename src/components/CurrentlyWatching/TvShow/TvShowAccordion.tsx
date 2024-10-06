import { Accordion, ScrollView } from "@aws-amplify/ui-react";
import TvShowAccordionItem from "./TvShowAccordionItem";
import { Watching } from "../currentlyWatchingSlice";
import { Partner } from "../../Partners/PartnerCard";

type Props = {
	tvShows: Watching[];
	watchingWith: Partner[] | undefined;
};

const TvShowAccordion = ({ tvShows, watchingWith }: Props) => {
	const getTvShowsForCurrentFilters = () => {
		if (!watchingWith) {
			return tvShows;
		}
		return tvShows.filter((tvShow) =>
			watchingWith.reduce(
				(matchingSoFar, personWatchingWith) =>
					matchingSoFar &&
					tvShow.with.includes(personWatchingWith.username),
				true
			)
		);
	};

	return (
		<ScrollView height="20vh">
			<Accordion.Container>
				{getTvShowsForCurrentFilters().map((show) => (
					<TvShowAccordionItem
						data={show}
						key={`${show.mediaId}-${show.usersSortedConcatenated}`}
					/>
				))}
			</Accordion.Container>
		</ScrollView>
	);
};

export default TvShowAccordion;
