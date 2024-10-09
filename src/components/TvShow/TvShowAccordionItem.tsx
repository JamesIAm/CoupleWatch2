import { Accordion, Loader } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { useGetTvShowDetailsQuery } from "./tvShowDetails";
import { Watching } from "../CurrentlyWatching/currentlyWatching";
import PartnerButtons from "./PartnerButtons";
import WatchingButtons from "./WatchingButtons";
import { TvShowSkeleton } from "../Search/searchResults";
import { Partner } from "../Partners/partnerSearch";
import { useGetAllPairingsQuery } from "../Partners/pairing";
import EpisodeSelection from "./EpisodeSelection";

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
const TvShowAccordionItem = ({ data }: TvShowAccordionItemProps) => {
	const { isWatching, data: show } = data;
	const [activePartners, setActivePartners] = useState<Partner[]>([]);
	const { data: pairings } = useGetAllPairingsQuery();
	const { data: tvShowDetails } = useGetTvShowDetailsQuery(show.mediaId);
	useEffect(() => {
		if (!isWatching || !pairings) {
			setActivePartners([]);
			return;
		}
		setActivePartners(
			pairings.flatMap((pairing) =>
				show.with.includes(pairing.otherUser.username)
					? pairing.otherUser
					: []
			)
		);
	}, [show, setActivePartners, isWatching]);

	const renderWatchingInfo = () => {
		if (isWatching) {
			return (
				<div>
					Started: {show.createdAt}
					<br />
					Last update: {show.updatedAt}
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
			return show.name;
		}
		return "";
	};

	return (
		<Accordion.Item value={String(show.mediaId)}>
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
				<WatchingButtons data={data} />
				{isWatching ? <PartnerButtons watchRecord={show} /> : <></>}
				<EpisodeSelection
					tvShowDetails={tvShowDetails}
					isWatching={isWatching}
				/>
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default TvShowAccordionItem;
