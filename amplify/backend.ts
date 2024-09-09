import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { searchTvShows } from "./functions/search/resource";

defineBackend({
	auth,
	data,
	searchTvShows,
});
