import { Button, Card, Loader, SearchField } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { useState } from "react";

type Props = {};
type SearchedUser = {
	email: string;
	username: string;
};

const client = generateClient<Schema>();

const PartnerSearch = ({}: Props) => {
	const [searchedUser, setSearchedUser] = useState<SearchedUser | undefined>(
		undefined
	);
	const [userLock, setUserLock] = useState<String[]>([]);
	const searchForUser = (email: string) => {
		client.queries.searchUser({ email: email }).then((res) => {
			console.log(res);
			if (res.data) {
				setSearchedUser({ email: email, username: res.data });
			} else {
				setSearchedUser(undefined);
			}
		});
	};
	const addPartner = (user: SearchedUser) => {
		setUserLock([...userLock, user.email]);
		client.models.Pairing.create({
			members: [user.username],
			memberInfo: [{ email: user.email, username: user.username }],
		}).then((res) => {
			console.log(res.data);
			setUserLock(
				[...userLock].filter((lockedUser) => lockedUser !== user.email)
			);
		});
	};
	return (
		<div>
			<h2>Find a partner</h2>
			<SearchField
				label="Find a partner"
				hasSearchIcon={true}
				onSubmit={(searchTerm) => searchForUser(searchTerm)}
				onClear={() => setSearchedUser(undefined)}
				onChange={() => setSearchedUser(undefined)}
			/>
			{searchedUser ? (
				<Card>
					{searchedUser.email}
					{userLock.includes(searchedUser.email) ? (
						<Loader />
					) : (
						<Button onClick={() => addPartner(searchedUser)}>
							Add
						</Button>
					)}
				</Card>
			) : (
				<></>
			)}
		</div>
	);
};

export default PartnerSearch;
