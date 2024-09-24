import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Search from "./components/Search/Search";
import CurrentlyWatchingList, {
	Watching,
} from "./components/CurrentlyWatching/CurrentlyWatchingList";
import PartnerSearch from "./components/Partners/PartnerSearch";

const client = generateClient<Schema>();

function App() {
	const [currentlyWatching, setCurrentlyWatching] = useState<Watching[]>([]);
	const updateCurrentlyWatching = () => {
		console.log("Getting a list of shows currently being watched");
		client.models.Watching.list().then((res) => {
			console.log(res);
			setCurrentlyWatching(res.data);
		});
	};
	useEffect(() => {
		updateCurrentlyWatching();
	}, []);

	return (
		<Authenticator>
			{({ signOut }) => {
				return (
					<main>
						<Search
							watching={currentlyWatching}
							updateCurrentlyWatching={updateCurrentlyWatching}
						/>
						<CurrentlyWatchingList
							currentlyWatching={currentlyWatching}
							updateCurrentlyWatching={updateCurrentlyWatching}
						/>
						<PartnerSearch />
						<button onClick={signOut}>Sign out</button>
					</main>
				);
			}}
		</Authenticator>
	);
}

export default App;
