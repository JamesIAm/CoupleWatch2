import { Accordion, Loader } from "@aws-amplify/ui-react";
import { useAppSelector } from "../../state/hooks";
import { Pairing, selectPairings } from "../Partners/pairingsSlice";
import { useState, useEffect } from "react";
import { Partner } from "../Partners/PartnerCard";
import { useGetTvShowDetailsQuery } from "./tvShowDetails";
import { Watching } from "../CurrentlyWatching/currentlyWatching";
import PartnerButtons from "./PartnerButtons";
import WatchingButtons from "./WatchingButtons";
import { TvShowSkeleton } from "../Search/searchResults";

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
	const partners = useAppSelector((state) => selectPairings(state));
	const [activePartners, setActivePartners] = useState<Partner[]>([]);
	const { data: tvShowDetails } = useGetTvShowDetailsQuery(show.mediaId);
	useEffect(() => {
		if (!isWatching) {
			setActivePartners([]);
			return;
		}
		setActivePartners(
			partners.filter((partner: Pairing) =>
				show.with.includes(partner.username)
			)
		);
	}, [partners, show, setActivePartners, isWatching]);

	const getButtonsForContentBeingWatched = (activeWatchRecord: Watching) => (
		<>
			<PartnerButtons watchRecord={activeWatchRecord} />
		</>
	);

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
				{isWatching ? getButtonsForContentBeingWatched(show) : <></>}
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default TvShowAccordionItem;
