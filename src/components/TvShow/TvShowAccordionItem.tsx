import {
	Accordion,
	Button,
	Loader,
	SwitchField,
	useAuthenticator,
} from "@aws-amplify/ui-react";
import { useAppSelector } from "../../state/hooks";
import { selectPairings } from "../Partners/pairingsSlice";
import { useState, useEffect } from "react";
import { Partner } from "../Partners/PartnerCard";
import { TvShowSkeleton } from "../Search/searchSlice";
import { useGetTvShowDetailsQuery } from "./tvShowDetails";
import {
	useStartWatchingMutation,
	useStartWatchingWithMutation,
	useStopWatchingMutation,
	useStopWatchingWithMutation,
	Watching,
} from "../CurrentlyWatching/currentlyWatching";

type Props = {
	data: TvShowSkeleton;
	watchRecord: Watching | null | undefined;
};
const TvShowAccordionItem = ({ data, watchRecord }: Props) => {
	const partners = useAppSelector((state) => selectPairings(state));
	const [startWatching, { isLoading: startWatchingUpdating }] =
		useStartWatchingMutation();
	const [stopWatching, { isLoading: stopWatchingUpdating }] =
		useStopWatchingMutation();
	const [startWatchingWith, { isLoading: startWatchingWithUpdating }] =
		useStartWatchingWithMutation();
	const [stopWatchingWith, { isLoading: stopWatchingWithUpdating }] =
		useStopWatchingWithMutation();
	const tvShowDetails = useGetTvShowDetailsQuery(data.mediaId);
	const { user } = useAuthenticator((context) => [context.user]);
	const [activePartners, setActivePartners] = useState<Partner[]>([]);
	useEffect(() => {
		if (watchRecord) {
			setActivePartners(
				partners.filter((partner) =>
					watchRecord.with.includes(partner.username)
				)
			);
		}
	}, [partners, watchRecord, setActivePartners]);

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
			{partners.map((pairing) => {
				const isWatchingThisShowWithCurrentUser =
					activeWatchRecord.with.includes(pairing.username);
				const changeRecord = () =>
					isWatchingThisShowWithCurrentUser
						? stopWatchingWith({
								watchRecord: activeWatchRecord,
								partnerToRemove: pairing,
						  })
						: startWatchingWith({
								watchRecord: activeWatchRecord,
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

	const getButtonsForContentNotBeingWatched = () => (
		<Button
			onClick={() => startWatching({ mediaId: data.mediaId, user })}
			isDisabled={startWatchingUpdating || stopWatchingUpdating}
		>
			{startWatchingUpdating || stopWatchingUpdating ? (
				<Loader />
			) : (
				"Start watching"
			)}
		</Button>
	);

	const renderWatchingInfo = () => {
		if (watchRecord) {
			return (
				<div>
					Started: {watchRecord.createdAt}
					<br />
					Last update: {watchRecord.createdAt}
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
				{data.name} ({data.firstAirDate?.substring(0, 4)}){" "}
				{renderPartnersWatchingThisShow()}
			</Accordion.Trigger>

			<Accordion.Content>
				{tvShowDetails?.currentData?.overview}
				<br />
				{renderWatchingInfo()}
				{watchRecord !== null && watchRecord !== undefined
					? getButtonsForContentBeingWatched(watchRecord)
					: getButtonsForContentNotBeingWatched()}
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default TvShowAccordionItem;
