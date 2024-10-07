import { Loader, Tabs } from "@aws-amplify/ui-react";
import { useAppSelector } from "../../state/hooks";
import { selectPairings } from "../Partners/pairingsSlice";
import TvShowAccordion from "./TvShow/TvShowAccordion";
import { useState } from "react";
import { Partner } from "../Partners/PartnerCard";
import { useGetCurrentlyWatchingQuery } from "./currentlyWatching";

type Props = {};
const CurrentlyWatchingList = ({}: Props) => {
	const { data, isLoading } = useGetCurrentlyWatchingQuery();
	const currentlyWatching = data;
	const pairings = useAppSelector(selectPairings);
	const [tab, setTab] = useState<Partner | undefined>(undefined);

	console.log(currentlyWatching);
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
			{isLoading ? (
				<Loader />
			) : currentlyWatching ? (
				<TvShowAccordion
					tvShows={[...currentlyWatching]}
					watchingWith={tab ? [tab] : tab}
				/>
			) : (
				<></>
			)}
		</div>
	);
};

export default CurrentlyWatchingList;
