import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

type Props = {
	data: Schema["TvShow"]["type"];
	currentlyWatching: boolean;
};
const client = generateClient<Schema>();
const TvShowListElement = ({ data, currentlyWatching }: Props) => {
	return (
		<li>
			{data.name}
			{currentlyWatching ? (
				<button onClick={() => deleteWatchingRecord(data)}>
					Stop watching
				</button>
			) : (
				<button onClick={() => addWatchingRecord(data)}>
					Start watching
				</button>
			)}
		</li>
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

export default TvShowListElement;
