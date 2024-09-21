import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Search from "./components/Search/Search";
import CurrentlyWatchingList, {
	Watching,
} from "./components/CurrentlyWatching/CurrentlyWatchingList";

const client = generateClient<Schema>();

function App() {
	const [currentlyWatching, setCurrentlyWatching] = useState<Watching[]>([]);
	return (
		<Authenticator>
			{({ signOut }) => {
				return (
					<main>
						<Search watching={currentlyWatching} />
						<CurrentlyWatchingList
							currentlyWatching={currentlyWatching}
							setCurrentlyWatching={setCurrentlyWatching}
						/>
						<button onClick={signOut}>Sign out</button>
					</main>
				);
			}}
		</Authenticator>
	);
}

export default App;
