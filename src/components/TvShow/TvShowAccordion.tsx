import { Accordion, useAuthenticator } from "@aws-amplify/ui-react";
import TvShowAccordionItem from "./TvShowListElement";
import { TvShow } from "../Search/Search";
import { selectCurrentlyWatching } from "../CurrentlyWatching/currentlyWatchingSlice";
import { useAppSelector } from "../../state/hooks";
import { Partner } from "../Partners/PartnerCard";

type Props = {
	tvShows: TvShow[];
	watchingWith: Partner[] | undefined;
};

const TvShowAccordion = ({ tvShows, watchingWith }: Props) => {
	const currentlyWatching = useAppSelector(selectCurrentlyWatching);
	return (
		<Accordion.Container>
			{tvShows.map((tvShow, index) => {
				let watchRecords = currentlyWatching.filter(
					(show) => show.mediaId === String(tvShow.id)
				);
				if (watchRecords.length === 0) {
					return (
						<TvShowAccordionItem
							data={tvShow}
							watchRecord={null}
							key={tvShow.id}
						/>
					);
				}
				if (watchRecords.length > 1) {
					console.debug("More than one matching record");
					if (watchingWith) {
						watchRecords.filter((record) => {
							const includesAllUsers = watchingWith.reduce(
								(
									watchRecordIncludesPeopleWatchingWith,
									personWatchingWith
								) =>
									watchRecordIncludesPeopleWatchingWith &&
									record.with.includes(
										personWatchingWith.username
									),
								true
							);
							return (
								includesAllUsers &&
								record.with.length === watchingWith.length
							);
						});
					}
				}
				return (
					<div key={index}>
						{watchRecords.map((watchRecord) => (
							<TvShowAccordionItem
								data={tvShow}
								watchRecord={watchRecord}
								key={watchRecord.id}
							/>
						))}
					</div>
				);
			})}
		</Accordion.Container>
	);
};

export default TvShowAccordion;
