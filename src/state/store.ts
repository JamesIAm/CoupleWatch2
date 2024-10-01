import { configureStore } from "@reduxjs/toolkit";
import pairingReducer from "../components/Partners/pairingsSlice";
import currentlyWatchingReducer from "../components/CurrentlyWatching/currentlyWatchingSlice";
import searchReducer from "../components/Search/searchSlice";
// ...

export const store = configureStore({
	reducer: {
		pairings: pairingReducer,
		currentlyWatching: currentlyWatchingReducer,
		search: searchReducer,
	},
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
