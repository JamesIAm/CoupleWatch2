import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { Accordion } from "@aws-amplify/ui-react";

type Props = {
	data: Schema["TvShow"]["type"];
	currentlyWatching: boolean;
};
const client = generateClient<Schema>();
const TvShowAccordionItem = ({ data, currentlyWatching }: Props) => {
	console.log(data);
	return (
		<Accordion.Item value={String(data.id)}>
			<Accordion.Trigger>
				{data.name} ({data.first_air_date?.substring(0, 4)})
			</Accordion.Trigger>

			<Accordion.Content>
				{data.overview}
				<br />
				{currentlyWatching ? (
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
		}
	});
};

export default TvShowAccordionItem;
