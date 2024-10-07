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
import { useGetTvShowDetailsQuery } from "./tvShowDetails";
import {
	useStartWatchingMutation,
	useStartWatchingWithMutation,
	useStopWatchingMutation,
	useStopWatchingWithMutation,
	Watching,
} from "../CurrentlyWatching/currentlyWatching";
import { TvShowSkeleton } from "../Search/searchSlice";

export type AccordionTvShow =
	| {
			isWatching: true;
			data: Watching;
	  }
	| {
			isWatching: false;
			data: TvShowSkeleton;
	  };
type TvShowAccordionItemProps = {
	data: AccordionTvShow;
};
const TvShowAccordionItem = ({
	data: { isWatching, data },
}: TvShowAccordionItemProps) => {
	const partners = useAppSelector((state) => selectPairings(state));
	const { user } = useAuthenticator((context) => [context.user]);
	const [startWatching, { isLoading: startWatchingUpdating }] =
		useStartWatchingMutation();
	const [stopWatching, { isLoading: stopWatchingUpdating }] =
		useStopWatchingMutation();
	const [startWatchingWith, { isLoading: startWatchingWithUpdating }] =
		useStartWatchingWithMutation();
	const [stopWatchingWith, { isLoading: stopWatchingWithUpdating }] =
		useStopWatchingWithMutation();
	const [activePartners, setActivePartners] = useState<Partner[]>([]);
	const { data: tvShowDetails } = useGetTvShowDetailsQuery(data.mediaId);
	useEffect(() => {
		if (!isWatching) {
			setActivePartners([]);
			return;
		}
		setActivePartners(
			partners.filter((partner) => data.with.includes(partner.username))
		);
	}, [partners, data, setActivePartners, isWatching]);

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
		if (isWatching) {
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

	const getTvShowName = () => {
		if (tvShowDetails?.name) {
			return tvShowDetails.name;
		}
		if (!isWatching) {
			return data.name;
		}
		return "";
	};

	return (
		<Accordion.Item value={String(data.mediaId)}>
			<Accordion.Trigger>
				{getTvShowName()}
				{" ("}
				{tvShowDetails?.first_air_date?.substring(0, 4) || (
					<Loader />
				)}) {tvShowDetails?.number_of_seasons}
				{" seasons "}
				{renderPartnersWatchingThisShow()}
			</Accordion.Trigger>

			<Accordion.Content>
				{tvShowDetails?.overview}
				<br />
				{renderWatchingInfo()}
				{isWatching
					? getButtonsForContentBeingWatched(data)
					: getButtonsForContentNotBeingWatched()}
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default TvShowAccordionItem;
