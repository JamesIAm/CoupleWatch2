import { Loader, Tabs } from "@aws-amplify/ui-react";
import { useGetAllCurrentlyWatchingQuery } from "./currentlyWatching";
import { useGetAllPairingsQuery } from "../Partners/pairing";
import { Partner } from "../Partners/partnerSearch";
import CurrentlyWatchingList from "./CurrentlyWatchingList";
import { useState } from "react";

type Props = {};
const CurrentlyWatchingDisplay = ({}: Props) => {
	const { data: currentlyWatching, isLoading } =
		useGetAllCurrentlyWatchingQuery();
	const { data: pairings } = useGetAllPairingsQuery();
	const [watchingWith, setWatchingWith] = useState<Partner | undefined>(
		undefined
	);

	const getTvShowsForCurrentFilters = (): string[] => {
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
		return toReturn.map((watchRecord) => watchRecord.id);
	};

	return (
		<div>
			<h1>CurrentlyWatchingList</h1>
			<Tabs
				onValueChange={(tab) => {
					if (tab === "All") setWatchingWith(undefined);
					setWatchingWith(
						pairings?.find(
							(pairing) => pairing.otherUser.email === tab
						)?.otherUser || undefined
					);
				}}
				value={watchingWith ? watchingWith.email : "All"}
				items={[
					{
						label: "All",
						value: "All",
						content: <></>,
					},
					...(pairings?.map((pairing) => {
						return {
							label: pairing.otherUser.email,
							value: pairing.otherUser.email,
							content: <></>,
						};
					}) || []),
				]}
			/>
			{isLoading ? (
				<Loader />
			) : currentlyWatching ? (
				<CurrentlyWatchingList
					watchingIds={getTvShowsForCurrentFilters()}
				/>
			) : (
				<></>
			)}
		</div>
	);
};

export default CurrentlyWatchingDisplay;
