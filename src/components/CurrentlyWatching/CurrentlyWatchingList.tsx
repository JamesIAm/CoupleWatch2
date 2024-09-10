import { generateClient } from "aws-amplify/api";
import React, { useState } from "react";
import { Schema } from "../../../amplify/data/resource";

type Props = {};
const client = generateClient<Schema>();
const CurrentlyWatchingList = (props: Props) => {
	const [currentlyWatching, setCurrentlyWatching] = useState();
	return (
		<div>
			<h1>CurrentlyWatchingList</h1>
			<button
				onClick={() => updateCurrentlyWatching(setCurrentlyWatching)}
			>
				Get currently watching
			</button>
		</div>
	);
};

const updateCurrentlyWatching = (setCurrentlyWatching: any) => {
	client.models.Watching.list().then((data) => {
		console.log(data);
		setCurrentlyWatching(data);
	});
};

export default CurrentlyWatchingList;
