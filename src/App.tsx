import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Search from "./components/Search/Search";
import CurrentlyWatchingList, {
	Watching,
} from "./components/CurrentlyWatching/CurrentlyWatchingList";
import PartnerManagement from "./components/Partners/PartnerManagement";
import { Pairing } from "./components/Partners/PartnerCard";

const client = generateClient<Schema>();

function App() {
	const [currentlyWatching, setCurrentlyWatching] = useState<Watching[]>([]);
	const [pairings, setPairings] = useState<Pairing[]>([]);
	const updateCurrentlyWatching = () => {
		console.log("Getting a list of shows currently being watched");
		client.models.Watching.list().then((res) => {
			console.log(res);
			setCurrentlyWatching(res.data);
		});
	};
	const updateCurrentPartners = () => {
		console.log("Getting the list of current pairings");
		client.models.Pairing.list().then((res) => {
			console.log(res);
			let newPairings = res.data
				.map((rawPairing) => {
					return {
						...rawPairing,
						memberInfo: rawPairing.memberInfo.filter(
							(memberInfo) => memberInfo != null
						),
					};
				})
				.map((rawPairing) => {
					return {
						memberInfo: rawPairing.memberInfo,
						pairingId: rawPairing.id,
					};
				})
				.filter((pairing) => pairing.memberInfo.length !== 0)
				.map((pairing) => {
					return {
						...pairing,
						email: pairing.memberInfo[0].email,
						username: pairing.memberInfo[0].username,
					};
				});
			setPairings(newPairings); //TODO: filter out the me user
		});
	};
	useEffect(() => {
		updateCurrentlyWatching();
		updateCurrentPartners();
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
						<PartnerManagement
							currentPairings={pairings}
							updateCurrentPartners={updateCurrentPartners}
						/>
						<button onClick={signOut}>Sign out</button>
					</main>
				);
			}}
		</Authenticator>
	);
}

export default App;
