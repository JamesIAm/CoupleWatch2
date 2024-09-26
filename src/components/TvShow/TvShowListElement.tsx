import {
	Accordion,
	Button,
	SwitchField,
	useAuthenticator,
} from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import {
	addPartnerToRecord,
	addWatchingRecord,
	deleteWatchingRecord,
	removePartnerFromRecord,
	TvShow,
	Watching,
} from "../CurrentlyWatching/currentlyWatchingSlice";
import { selectPairings } from "../Partners/pairingsSlice";
import { useState, useEffect } from "react";
import { Partner } from "../Partners/PartnerCard";

type Props = {
	data: TvShow;
	watchRecord: Watching | null;
};
const TvShowAccordionItem = ({ data, watchRecord }: Props) => {
	const dispatch = useAppDispatch();
	const partners = useAppSelector((state) => selectPairings(state));
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
	return (
		<Accordion.Item value={String(data.id)}>
			<Accordion.Trigger>
				{data.name} ({data.first_air_date?.substring(0, 4)}){" "}
				{activePartners
					.map(
						(partnerInWatchingThisShow) =>
							partnerInWatchingThisShow.email
					)
					.join(",")}
			</Accordion.Trigger>

			<Accordion.Content>
				{data.overview}
				<br />
				{watchRecord ? (
					<div>
						Started: {watchRecord.createdAt}
						<br />
						Last update: {watchRecord.createdAt}
					</div>
				) : null}
				{watchRecord ? (
					<>
						<Button
							onClick={() =>
								dispatch(deleteWatchingRecord(watchRecord))
							}
						>
							Stop watching
						</Button>
						{partners.map((partner) => {
							const isWatchingThisShowWithCurrentUser =
								watchRecord.with.includes(partner.username);
							return (
								<SwitchField
									key={partner.username}
									labelPosition="start"
									label={partner.email}
									isChecked={
										isWatchingThisShowWithCurrentUser
									}
									onChange={() =>
										isWatchingThisShowWithCurrentUser
											? dispatch(
													removePartnerFromRecord({
														data: watchRecord,
														pairing: partner,
													})
											  )
											: dispatch(
													addPartnerToRecord({
														data: watchRecord,
														pairing: partner,
													})
											  )
									}
								/>
							);
						})}
					</>
				) : (
					<Button
						onClick={() =>
							dispatch(addWatchingRecord({ data, user }))
						}
					>
						Start watching
					</Button>
				)}
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default TvShowAccordionItem;
