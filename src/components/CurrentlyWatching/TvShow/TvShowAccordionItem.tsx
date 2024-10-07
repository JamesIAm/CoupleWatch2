import { Accordion, Button, Loader, SwitchField } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import {
	addPartnerToRecord,
	removePartnerFromRecord,
	Watching,
} from "../currentlyWatchingSlice";
import { selectPairings } from "../../Partners/pairingsSlice";
import { useState, useEffect } from "react";
import { Partner } from "../../Partners/PartnerCard";
import { useGetTvShowDetailsQuery } from "../../TvShow/tvShowDetails";
import {
	useStartWatchingMutation,
	useStopWatchingMutation,
} from "../currentlyWatching";

type Props = {
	data: Watching;
};
const TvShowAccordionItem = ({ data }: Props) => {
	const dispatch = useAppDispatch();
	const partners = useAppSelector((state) => selectPairings(state));
	const [_startWatching, { isLoading: startWatchingUpdating }] =
		useStartWatchingMutation();
	const [stopWatching, { isLoading: stopWatchingUpdating }] =
		useStopWatchingMutation();
	const [activePartners, setActivePartners] = useState<Partner[]>([]);
	const tvShowDetails = useGetTvShowDetailsQuery(data.mediaId);
	useEffect(() => {
		setActivePartners(
			partners.filter((partner) => data.with.includes(partner.username))
		);
	}, [partners, data, setActivePartners]);

	const getButtonsForContentBeingWatched = (activeWatchRecord: Watching) => (
		<>
			<Button
				onClick={() => stopWatching(activeWatchRecord)}
				isDisabled={startWatchingUpdating || stopWatchingUpdating}
			>
				{startWatchingUpdating || stopWatchingUpdating ? (
					<Loader />
				) : (
					"Stop watching"
				)}
			</Button>
			{partners.map((partner) => {
				const isWatchingThisShowWithCurrentUser =
					activeWatchRecord.with.includes(partner.username);
				const changeRecord = () =>
					isWatchingThisShowWithCurrentUser
						? dispatch(
								removePartnerFromRecord({
									data: activeWatchRecord as Watching,
									pairing: partner,
								})
						  )
						: dispatch(
								addPartnerToRecord({
									data: activeWatchRecord as Watching,
									pairing: partner,
								})
						  );
				return (
					<SwitchField
						key={partner.username}
						labelPosition="start"
						label={partner.email}
						isChecked={isWatchingThisShowWithCurrentUser}
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
