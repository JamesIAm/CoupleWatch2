import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Search from "./components/Search/Search";

const client = generateClient<Schema>();

function App() {
	const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

	useEffect(() => {
		client.models.Todo.observeQuery().subscribe({
			next: (data) => setTodos([...data.items]),
		});
	}, []);

	function createTodo() {
		console.log(window.prompt("Search"));
		client.models.Todo.create({ content: window.prompt("Todo content") });
	}
	// let userAtt = await fetchUserAttributes();
	return (
		<Authenticator>
			{({ signOut }) => {
				return (
					<main>
						<Search />
						<button onClick={signOut}>Sign out</button>
					</main>
				);
			}}
		</Authenticator>
	);
}

export default App;
