import { Accordion, ScrollView } from "@aws-amplify/ui-react";
import TvShowAccordionItem from "./TvShowAccordionItem";
import { selectCurrentlyWatching } from "../CurrentlyWatching/currentlyWatchingSlice";
import { useAppSelector } from "../../state/hooks";
import { Partner } from "../Partners/PartnerCard";
import React from "react";
import { TvShowSkeleton } from "../Search/searchSlice";

type Props = {
	tvShows: TvShowSkeleton[];
	watchingWith: Partner[] | undefined;
};

const TvShowAccordion = ({ tvShows, watchingWith }: Props) => {
	const currentlyWatching = useAppSelector(selectCurrentlyWatching);
	const getWatchRecords = (tvShow: TvShowSkeleton) => {
		let watchRecords = currentlyWatching.filter(
			(show) => show.mediaId === tvShow.mediaId
		);

		return watchRecords;
	};

	const getAllListingsForATvShow = (
		tvShow: TvShowSkeleton,
		index: number
	) => {
		let watchRecords = getWatchRecords(tvShow);

		if (watchRecords.length === 0) {
			if (watchingWith) {
				return <React.Fragment key={index}></React.Fragment>;
			} else {
				return (
					<TvShowAccordionItem
						data={tvShow}
						watchRecord={null}
						key={tvShow.mediaId}
					/>
				);
			}
		}
		return (
			<div key={index}>
				{watchRecords.map((watchRecord) => (
					<TvShowAccordionItem
						data={tvShow}
						key={watchRecord.mediaId}
						watchRecord={watchRecord}
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
