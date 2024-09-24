import type { Schema } from "../../data/resource";
import { env } from "$amplify/env/search-user";
import {
	ListUsersCommand,
	CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

type Handler = Schema["searchUser"]["functionHandler"];
const client = new CognitoIdentityProviderClient();

export const handler: Handler = async (event) => {
	const email = event.arguments.email;
	const command = new ListUsersCommand({
		Filter: `email = "${email}"`,
		UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
	});
	const response = await client.send(command);
	if (!response.Users) {
		console.log("No users");
	} else if (response.Users.length === 1) {
		return response.Users[0].Username ? response.Users[0].Username : null;
	} else if (response.Users.length === 0) {
		console.log("empty users");
	} else {
		console.log("Too many users");
	}
	return null;
};
