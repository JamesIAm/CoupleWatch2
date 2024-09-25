import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { Accordion } from "@aws-amplify/ui-react";
import { useAppDispatch } from "../../state/hooks";
import {
	updateCurrentlyWatching,
	Watching,
} from "../CurrentlyWatching/currentlyWatchingSlice";

type Props = {
	data: Schema["TvShow"]["type"];
	watchRecord: Watching | null;
};
const client = generateClient<Schema>();
const TvShowAccordionItem = ({ data, watchRecord }: Props) => {
	const dispatch = useAppDispatch();
	const addWatchingRecord = (data: Schema["TvShow"]["type"]) => {
		if (!data?.id) {
			return false;
		}
		console.log({
			show: data,
			mediaId: String(data.id),
		});
		client.models.Watching.create({
			show: data,
			mediaId: String(data.id),
		}).then((result) => {
			if (result.errors) {
				result.errors.forEach((element) => {
					console.log(element);
				});
			} else {
				console.log(
					`Successfully recorded ${data.name} as being watched`
				);
				dispatch(updateCurrentlyWatching());
			}
		});
	};

	const deleteWatchingRecord = (data: Schema["TvShow"]["type"]) => {
		if (!data?.id) {
			return false;
		}
		console.log({
			show: data,
			mediaId: String(data.id),
		});
		client.models.Watching.delete({
			mediaId: String(data.id),
		}).then((result) => {
			if (result.errors) {
				result.errors.forEach((element) => {
					console.log(element);
				});
			} else {
				console.log(
					`Successfully removed ${data.name} from being watched`
				);
				dispatch(updateCurrentlyWatching());
			}
		});
	};
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
					<button onClick={() => deleteWatchingRecord(data)}>
						Stop watching
					</button>
				) : (
					<button onClick={() => addWatchingRecord(data)}>
						Start watching
					</button>
				)}
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default TvShowAccordionItem;
