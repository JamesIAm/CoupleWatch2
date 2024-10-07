import { Accordion, ScrollView } from "@aws-amplify/ui-react";
import TvShowAccordionItem from "./TvShowAccordionItem";
import { Partner } from "../Partners/PartnerCard";
import React from "react";
import { TvShowSkeleton } from "../Search/searchSlice";
import { useGetCurrentlyWatchingQuery } from "../CurrentlyWatching/currentlyWatching";

type Props = {
	tvShows: TvShowSkeleton[];
	watchingWith: Partner[] | undefined;
};

const TvShowAccordion = ({ tvShows, watchingWith }: Props) => {
	const { data: currentlyWatching } = useGetCurrentlyWatchingQuery();
	const getWatchRecords = (tvShow: TvShowSkeleton) => {
		if (!currentlyWatching) {
			return [];
		}
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
