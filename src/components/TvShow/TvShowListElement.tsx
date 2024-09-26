import { Schema } from "../../../amplify/data/resource";
import { Accordion } from "@aws-amplify/ui-react";
import { useAppDispatch } from "../../state/hooks";
import {
	addWatchingRecord,
	deleteWatchingRecord,
	Watching,
} from "../CurrentlyWatching/currentlyWatchingSlice";

type Props = {
	data: Schema["TvShow"]["type"];
	watchRecord: Watching | null;
};
const TvShowAccordionItem = ({ data, watchRecord }: Props) => {
	const dispatch = useAppDispatch();
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
					<button
						onClick={() => dispatch(deleteWatchingRecord(data))}
					>
						Stop watching
					</button>
				) : (
					<button onClick={() => dispatch(addWatchingRecord(data))}>
						Start watching
					</button>
				)}
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default TvShowAccordionItem;
