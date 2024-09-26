import { Schema } from "../../../amplify/data/resource";
import {
	Accordion,
	Button,
	CheckboxField,
	SwitchField,
} from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import {
	addWatchingRecord,
	deleteWatchingRecord,
	Watching,
} from "../CurrentlyWatching/currentlyWatchingSlice";
import { selectPairings } from "../Partners/pairingsSlice";

type Props = {
	data: Schema["TvShow"]["type"];
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
					<Button
						onClick={() => dispatch(deleteWatchingRecord(data))}
					>
						Stop watching
					</Button>
				) : (
					<Button onClick={() => dispatch(addWatchingRecord(data))}>
						Start watching
					</Button>
				)}
				{partners.map((partner) => {
					return (
						<SwitchField
							labelPosition="start"
							label={partner.email}
						/>
					);
				})}
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default TvShowAccordionItem;
