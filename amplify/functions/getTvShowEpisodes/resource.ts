import { defineFunction, secret } from "@aws-amplify/backend";

export const getTvShowEpisodes = defineFunction({
	environment: {
		API_TOKEN: secret("TVDB_API_TOKEN"),
	},
});
