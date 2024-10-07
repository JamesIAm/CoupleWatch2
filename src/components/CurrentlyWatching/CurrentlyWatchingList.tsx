import { Loader, Tabs } from "@aws-amplify/ui-react";
import { useAppSelector } from "../../state/hooks";
import { selectPairings } from "../Partners/pairingsSlice";
import TvShowAccordion from "../TvShow/TvShowAccordion";
import { useState } from "react";
import { Partner } from "../Partners/PartnerCard";
import { useGetCurrentlyWatchingQuery } from "./currentlyWatching";
import { AccordionTvShow } from "../TvShow/TvShowAccordionItem";

type Props = {};
const CurrentlyWatchingList = ({}: Props) => {
	const { data: currentlyWatching, isLoading } =
		useGetCurrentlyWatchingQuery();
	const pairings = useAppSelector(selectPairings);
	const [watchingWith, setWatchingWith] = useState<Partner | undefined>(
		undefined
	);

	const getTvShowsForCurrentFilters = (): AccordionTvShow[] => {
		if (!currentlyWatching) {
			return [];
		}
		var toReturn;
		if (!watchingWith) {
			toReturn = currentlyWatching;
		} else {
			toReturn = currentlyWatching.filter((tvShow) =>
				tvShow.with.includes(watchingWith.username)
			);
		}
		return toReturn.map((watchRecord) => {
			return { data: watchRecord, isWatching: true };
		});
	};

	return (
		<div>
			<h1>CurrentlyWatchingList</h1>
			<Tabs
				onValueChange={(tab) => {
					if (tab === "All") setWatchingWith(undefined);
					setWatchingWith(
						pairings.find((pairing) => pairing.email === tab)
					);
				}}
				value={watchingWith ? watchingWith.email : "All"}
				items={[
					{
						label: "All",
						value: "All",
						content: <></>,
					},
					...pairings.map((partner) => {
						return {
							label: partner.email,
							value: partner.email,
							content: <></>,
						};
					}),
				]}
			/>
			{isLoading ? (
				<Loader />
			) : currentlyWatching ? (
				<TvShowAccordion tvShows={getTvShowsForCurrentFilters()} />
			) : (
				<></>
			)}
		</div>
	);
};

export default CurrentlyWatchingList;
