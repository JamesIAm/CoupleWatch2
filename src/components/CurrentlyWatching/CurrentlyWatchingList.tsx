import { Tabs } from "@aws-amplify/ui-react";
import { useAppSelector } from "../../state/hooks";
import { selectPairings } from "../Partners/pairingsSlice";
import TvShowAccordion from "./TvShow/TvShowAccordion";
import { selectCurrentlyWatching } from "./currentlyWatchingSlice";
import { useState } from "react";
import { Partner } from "../Partners/PartnerCard";

type Props = {};
const CurrentlyWatchingList = ({}: Props) => {
	const currentlyWatching = useAppSelector(selectCurrentlyWatching);
	const pairings = useAppSelector(selectPairings);
	const [tab, setTab] = useState<Partner | undefined>(undefined);
	const currentlyWatchingShows = currentlyWatching.map(
		(watching) => watching.show
	);
	const uniqueCurrentlyWatchingShows = currentlyWatchingShows.filter(
		(show, index) =>
			currentlyWatchingShows.findIndex(
				(otherShow) => show.id === otherShow.id
			) === index
	);
	return (
		<div>
			<h1>CurrentlyWatchingList</h1>
			<Tabs
				onValueChange={(tab) => {
					if (tab === "All") setTab(undefined);
					setTab(pairings.find((pairing) => pairing.email === tab));
				}}
				value={tab ? tab.email : "All"}
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
			<TvShowAccordion
				tvShows={[...uniqueCurrentlyWatchingShows]}
				watchingWith={tab ? [tab] : tab}
			/>
		</div>
	);
};

export default CurrentlyWatchingList;
