import { useEffect } from "react";

import { Authenticator, Tabs } from "@aws-amplify/ui-react";
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
						<Tabs
							defaultValue="watching"
							items={[
								{
									value: "watching",
									label: "Tv Shows",
									content: (
										<>
											<Search />
											<CurrentlyWatchingList />
										</>
									),
								},
								{
									value: "partnerManagement",
									label: "Partners",
									content: <PartnerManagement />,
								},
							]}
						/>

						<button onClick={signOut}>Sign out</button>
					</main>
				);
			}}
		</Authenticator>
	);
}

export default App;
