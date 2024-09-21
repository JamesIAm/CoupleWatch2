import { generateClient } from "aws-amplify/api";
import { useState } from "react";
import { Schema } from "../../../amplify/data/resource";

export type Watching = Schema["Watching"]["type"];
type Props = {
	currentlyWatching: Watching[];
	updateCurrentlyWatching: () => void;
};
const CurrentlyWatchingList = ({
	currentlyWatching,
	updateCurrentlyWatching,
}: Props) => {
	return (
		<div>
			<h1>CurrentlyWatchingList</h1>
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

export default CurrentlyWatchingList;
