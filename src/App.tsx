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
	const updateCurrentPartners = (currentUserUsername: string) => {
		console.log("Getting the list of current pairings");
		client.models.Pairing.list().then((res) => {
			console.log(res);
			let newPairings = res.data
				.map((rawPairing) => {
					return {
						pairingId: rawPairing.id,
						memberInfo: rawPairing.memberInfo
							.filter((memberInfo) => memberInfo != null)
							.filter(
								(memberInfo) =>
									memberInfo.username !== currentUserUsername
							),
					};
				})
				.filter((pairing) => pairing.memberInfo.length === 1)
				.map((pairing) => {
					return {
						...pairing,
						email: pairing.memberInfo[0].email,
						username: pairing.memberInfo[0].username,
					};
				});
			setPairings(newPairings);
		});
	};
	useEffect(() => {
		updateCurrentlyWatching();
	}, []);

	return (
		<Authenticator>
			{({ signOut, user }) => {
				if (!user) return <></>;
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
							currentUser={user}
						/>
						<button onClick={signOut}>Sign out</button>
					</main>
				);
			}}
		</Authenticator>
	);
}

export default App;
