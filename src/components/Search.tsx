import { generateClient } from "aws-amplify/api";
import { FormEvent, useState } from "react";
import { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();
const SearchBar = () => {
	const [searchTerm, setSearchTerm] = useState("");

	const search = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(searchTerm);
		let output = await client.queries.searchTvShows({
			query: searchTerm,
		});
		console.log(output);
	};
	return (
		<>
			<h1>Search</h1>
			<form onSubmit={search}>
				<input
					name="query"
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button type="submit">Search</button>
			</form>
		</>
	);
};

export default SearchBar;
