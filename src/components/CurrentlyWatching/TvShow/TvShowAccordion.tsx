import { Accordion, ScrollView } from "@aws-amplify/ui-react";
import TvShowAccordionItem from "./TvShowAccordionItem";
import { TvShow } from "../../Search/Search";
import { selectCurrentlyWatching } from "../currentlyWatchingSlice";
import { useAppSelector } from "../../../state/hooks";
import { Partner } from "../../Partners/PartnerCard";

type Props = {
	tvShows: TvShow[];
	watchingWith: Partner[] | undefined;
};

const TvShowAccordion = ({ tvShows, watchingWith }: Props) => {
	const currentlyWatching = useAppSelector(selectCurrentlyWatching);
	const getWatchRecords = (tvShow: TvShow) => {
		let watchRecords = currentlyWatching.filter(
			(show) => show.mediaId === String(tvShow.id)
		);
		if (!watchingWith) {
			return watchRecords;
		}
		return watchRecords.filter((record) => {
			const includesAllUsers = watchingWith.reduce(
				(watchRecordIncludesPeopleWatchingWith, personWatchingWith) =>
					watchRecordIncludesPeopleWatchingWith &&
					record.with.includes(personWatchingWith.username),
				true
			);
			return includesAllUsers;
		});
	};

	const getAllListingsForATvShow = (tvShow: TvShow, index: number) => {
		let watchRecords = getWatchRecords(tvShow);

		if (watchRecords.length === 0) {
			throw new Error(
				"No watch record found for show currently being watched"
			);
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
	};

	return (
		<ScrollView height="20vh">
			<Accordion.Container>
				{tvShows.map(getAllListingsForATvShow)}
			</Accordion.Container>
		</ScrollView>
	);
};

export default TvShowAccordion;
