import { generateClient } from "aws-amplify/api";
import React, { useState } from "react";
import { Schema } from "../../../amplify/data/resource";

type Props = {};

type Watching = Schema["Watching"]["type"];

const client = generateClient<Schema>();
const CurrentlyWatchingList = (props: Props) => {
	const [currentlyWatching, setCurrentlyWatching] = useState<Watching[]>();
	return (
		<div>
			<h1>CurrentlyWatchingList</h1>
			<button
				onClick={() => updateCurrentlyWatching(setCurrentlyWatching)}
			>
				Get currently watching
			</button>
			<ul>
				{currentlyWatching
					? currentlyWatching.map((show) => {
							return <li>{show.show?.name}</li>;
					  })
					: ""}
			</ul>
		</div>
	);
};

const updateCurrentlyWatching = (setCurrentlyWatching: any) => {
	client.models.Watching.list().then((res) => {
		console.log(res);
		setCurrentlyWatching(res.data);
	});
};

export default CurrentlyWatchingList;
