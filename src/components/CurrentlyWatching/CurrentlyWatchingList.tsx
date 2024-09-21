import { generateClient } from "aws-amplify/api";
import { useState } from "react";
import { Schema } from "../../../amplify/data/resource";

export type Watching = Schema["Watching"]["type"];
type Props = {
	setCurrentlyWatching: any;
	currentlyWatching: Watching[];
};

const client = generateClient<Schema>();
const CurrentlyWatchingList = ({
	setCurrentlyWatching,
	currentlyWatching,
}: Props) => {
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
	console.log("Getting a list of shows currently being watched");
	client.models.Watching.list().then((res) => {
		console.log(res);
		setCurrentlyWatching(res.data);
	});
};

export default CurrentlyWatchingList;
