import { Accordion, Button, Loader, SwitchField } from "@aws-amplify/ui-react";
import { useAppSelector } from "../../../state/hooks";
import { selectPairings } from "../../Partners/pairingsSlice";
import { useState, useEffect } from "react";
import { Partner } from "../../Partners/PartnerCard";
import { useGetTvShowDetailsQuery } from "../../TvShow/tvShowDetails";
import {
	useStartWatchingMutation,
	useStartWatchingWithMutation,
	useStopWatchingMutation,
	useStopWatchingWithMutation,
	Watching,
} from "../currentlyWatching";

type Props = {
	data: Watching;
};
const TvShowAccordionItem = ({ data }: Props) => {
	const partners = useAppSelector((state) => selectPairings(state));
	const [_startWatching, { isLoading: startWatchingUpdating }] =
		useStartWatchingMutation();
	const [stopWatching, { isLoading: stopWatchingUpdating }] =
		useStopWatchingMutation();
	const [startWatchingWith, { isLoading: startWatchingWithUpdating }] =
		useStartWatchingWithMutation();
	const [stopWatchingWith, { isLoading: stopWatchingWithUpdating }] =
		useStopWatchingWithMutation();
	const [activePartners, setActivePartners] = useState<Partner[]>([]);
	const tvShowDetails = useGetTvShowDetailsQuery(data.mediaId);
	useEffect(() => {
		setActivePartners(
			partners.filter((partner) => data.with.includes(partner.username))
		);
	}, [partners, data, setActivePartners]);

	const getButtonsForContentBeingWatched = (watchRecord: Watching) => (
		<>
			<Button
				onClick={() => stopWatching(watchRecord)}
				isDisabled={startWatchingUpdating || stopWatchingUpdating}
			>
				{startWatchingUpdating || stopWatchingUpdating ? (
					<Loader />
				) : (
					"Stop watching"
				)}
			</Button>
			{partners.map((pairing) => {
				const isWatchingThisShowWithCurrentUser =
					watchRecord.with.includes(pairing.username);
				const changeRecord = () =>
					isWatchingThisShowWithCurrentUser
						? stopWatchingWith({
								watchRecord,
								partnerToRemove: pairing,
						  })
						: startWatchingWith({
								watchRecord,
								partnerToAdd: pairing,
						  });

				return (
					<SwitchField
						key={pairing.username}
						labelPosition="start"
						label={pairing.email}
						isChecked={isWatchingThisShowWithCurrentUser}
						isDisabled={
							startWatchingWithUpdating ||
							stopWatchingWithUpdating
						}
						onChange={changeRecord}
					/>
				);
			})}
		</>
	);

	const renderWatchingInfo = () => {
		if (data) {
			return (
				<div>
					Started: {data.createdAt}
					<br />
					Last update: {data.updatedAt}
				</div>
			);
		}
	};

	const renderPartnersWatchingThisShow = () => {
		return activePartners
			.map((partnerInWatchingThisShow) => partnerInWatchingThisShow.email)
			.join(", ");
	};

	return (
		<Accordion.Item value={String(data.mediaId)}>
			<Accordion.Trigger>
				{tvShowDetails?.data?.name} (
				{tvShowDetails?.data?.first_air_date?.substring(0, 4)}){" "}
				{/* {watchRecord.seasonCount} seasons{" "} */}
				{renderPartnersWatchingThisShow()}
			</Accordion.Trigger>

			<Accordion.Content>
				{tvShowDetails?.data?.overview}
				<br />
				{renderWatchingInfo()}
				{getButtonsForContentBeingWatched(data)}
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default TvShowAccordionItem;
