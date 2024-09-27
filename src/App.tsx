import { useEffect } from "react";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Search from "./components/Search/Search";
import CurrentlyWatchingList from "./components/CurrentlyWatching/CurrentlyWatchingList";
import PartnerManagement from "./components/Partners/PartnerManagement";
import { useAppDispatch } from "./state/hooks";
import { updateCurrentlyWatching } from "./components/CurrentlyWatching/currentlyWatchingSlice";

function App() {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(updateCurrentlyWatching());
	}, []);

	return (
		<Authenticator>
			{({ signOut, user }) => {
				if (!user) return <></>;
				return (
					<main>
						<Search />
						<CurrentlyWatchingList />
						<PartnerManagement />
						<button onClick={signOut}>Sign out</button>
					</main>
				);
			}}
		</Authenticator>
	);
}

export default App;
