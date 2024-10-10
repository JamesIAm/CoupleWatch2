import { Authenticator, Tabs } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Search from "./components/Search/Search";
import PartnerManagement from "./components/Partners/PartnerManagement";
import MovieDbLogo from "./assets/movie_db.svg";
import CurrentlyWatchingDisplay from "./components/CurrentlyWatching/CurrentlyWatchingDisplay";

function App() {
	return (
		<>
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
												<CurrentlyWatchingDisplay />
											</>
										),
									},
									{
										value: "search",
										label: "Search",
										content: (
											<>
												<Search />
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
			<img src={MovieDbLogo} style={{ padding: "20px" }} />
		</>
	);
}

export default App;
