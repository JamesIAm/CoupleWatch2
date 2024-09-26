import { Accordion, Button, SwitchField } from "@aws-amplify/ui-react";
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

type Props = {
	data: TvShow;
	watchRecord: Watching | null;
};
const TvShowAccordionItem = ({ data, watchRecord }: Props) => {
	const dispatch = useAppDispatch();
	const partners = useAppSelector((state) => selectPairings(state));

	return (
		<Accordion.Item value={String(data.id)}>
			<Accordion.Trigger>
				{data.name} ({data.first_air_date?.substring(0, 4)})
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
							onClick={() => dispatch(deleteWatchingRecord(data))}
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
					<Button onClick={() => dispatch(addWatchingRecord(data))}>
						Start watching
					</Button>
				)}
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default TvShowAccordionItem;
