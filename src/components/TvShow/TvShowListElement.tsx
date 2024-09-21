import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

type Props = {
	data: Schema["TvShow"]["type"];
};
const client = generateClient<Schema>();
const TvShowListElement = ({ data }: Props) => {
	return (
		<li>
			{data.name}
			<button onClick={() => addWatchingRecord(data)}>
				Start watching
			</button>
		</li>
	);
};
const addWatchingRecord = (data: Schema["TvShow"]["type"]) => {
	if (!data?.id) {
		return false;
	}
	client.models.Watching.create({
		show: data,
		mediaId: String(data.id),
		mediaType: "TvShow",
	}).then((result) => console.log(result));
};

export default TvShowListElement;
