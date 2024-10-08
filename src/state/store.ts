import { configureStore } from "@reduxjs/toolkit";
import { searchResultsApi } from "../components/Search/searchResults";
import { tvShowDetailsApi } from "../components/TvShow/tvShowDetails";
import { currentlyWatchingApi } from "../components/CurrentlyWatching/currentlyWatching";
import { partnerSearchApi } from "../components/Partners/partnerSearch";
import { pairingApi } from "../components/Partners/pairing";

// ...

export const store = configureStore({
	reducer: {
		[pairingApi.reducerPath]: pairingApi.reducer,
		[searchResultsApi.reducerPath]: searchResultsApi.reducer,
		[tvShowDetailsApi.reducerPath]: tvShowDetailsApi.reducer,
		[currentlyWatchingApi.reducerPath]: currentlyWatchingApi.reducer,
		[partnerSearchApi.reducerPath]: partnerSearchApi.reducer,
	},
	middleware: (gDM) =>
		gDM()
			.concat(tvShowDetailsApi.middleware)
			.concat(currentlyWatchingApi.middleware)
			.concat(searchResultsApi.middleware)
			.concat(partnerSearchApi.middleware)
			.concat(pairingApi.middleware),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
