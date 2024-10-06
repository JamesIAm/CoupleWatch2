import { Tabs } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { selectPairings } from "../Partners/pairingsSlice";
import TvShowAccordion from "./TvShow/TvShowAccordion";
import {
	selectCurrentlyWatching,
	updateCurrentlyWatching,
} from "./currentlyWatchingSlice";
import { useEffect, useState } from "react";
import { Partner } from "../Partners/PartnerCard";

type Props = {};
const CurrentlyWatchingList = ({}: Props) => {
	const currentlyWatching = useAppSelector(selectCurrentlyWatching);
	const dispatch = useAppDispatch();
	const pairings = useAppSelector(selectPairings);
	const [tab, setTab] = useState<Partner | undefined>(undefined);
	useEffect(() => {
		console.log("asd");
		dispatch(updateCurrentlyWatching);
	}, []);

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
			<TvShowAccordion
				tvShows={[...currentlyWatching]}
				watchingWith={tab ? [tab] : tab}
			/>
		</div>
	);
};

export default CurrentlyWatchingList;
