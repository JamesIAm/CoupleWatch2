import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { searchTvShows } from "../functions/searchTvShows/resource";
import { searchUser } from "../functions/search-user/resource";
import { getTvShowEpisodes } from "../functions/getTvShowEpisodes/resource";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
	Watching: a
		.model({
			show: a.ref("TvShow").required(),
			mediaId: a.string().required(),
			with: a.string().array().required(),
		})
		.authorization((allow) => [allow.ownersDefinedIn("with")]),

	Pairing: a
		.model({
			members: a.string().array().required(),
			memberInfo: a.ref("Partner").array().required(),
		})
		.authorization((allow) => [allow.ownersDefinedIn("members")]),

	Partner: a.customType({
		email: a.string().required(),
		username: a.string().required(),
	}),

	searchUser: a
		.query()
		.arguments({ email: a.string().required() })
		.authorization((allow) => [allow.authenticated()])
		.handler(a.handler.function(searchUser))
		.returns(a.string()),

	searchTvShows: a
		.query()
		.arguments({ query: a.string() })
		.returns(
			a.customType({
				page: a.integer(),
				results: a.ref("TvShow").array().required(),
				total_pages: a.integer(),
				total_results: a.integer(),
			})
		)
		.handler(a.handler.function(searchTvShows))
		.authorization((allow) => [allow.authenticated()]),
	TvShow: a.customType({
		adult: a.boolean(),
		backdrop_path: a.string(),
		genre_ids: a.integer().array(),
		id: a.integer().required(),
		origin_country: a.string().array(),
		original_language: a.string(),
		original_name: a.string(),
		overview: a.string(),
		popularity: a.float(),
		poster_path: a.string(),
		first_air_date: a.string(),
		name: a.string().required(),
		vote_average: a.float(),
		vote_count: a.integer(),
	}),
	getTvShowEpisodes: a
		.query()
		.arguments({ seriesId: a.string() })
		.returns(a.ref("SeasonResponse").required())
		.handler(a.handler.function(getTvShowEpisodes))
		.authorization((allow) => [allow.authenticated()]),
	SeasonResponse: a.customType({
		seasons: a.ref("Season").required().array().required(),
		number_of_episodes: a.integer().required(),
		number_of_seasons: a.integer().required(),
	}),
	Season: a.customType({
		air_date: a.string(),
		episode_count: a.integer(),
		id: a.integer(),
		name: a.string(),
		overview: a.string(),
		poster_path: a.string(),
		season_number: a.integer(),
	}),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool",
		// API Key is used for a.allow.public() rules
		apiKeyAuthorizationMode: {
			expiresInDays: 30,
		},
	},
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
