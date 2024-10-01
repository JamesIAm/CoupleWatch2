import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../state/store";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { logErrorsAndReturnData } from "../../utils/ClientUtils";

export type TvSearchResult = Schema["searchTvShows"]["returnType"];
export type TvShow = Schema["TvShow"]["type"];
type SearchState = {
	results: TvShow[];
	pagesOfSearchResults: number;
};

const initialState: SearchState = {
	results: [],
	pagesOfSearchResults: 0,
};

export const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		clearSearchResults(state) {
			state.pagesOfSearchResults = 0;
			state.results = [];
		},
	},
	extraReducers: (builder) => {
		builder.addCase(searchTvShow.fulfilled, (state, action) => {
			if (!action.payload.results) {
				state.results = [];
				state.pagesOfSearchResults = 0;
			}
			state.results = action.payload.results as unknown as TvShow[];
			state.pagesOfSearchResults = action.payload.total_pages || 1;
		});
		builder.addCase(searchTvShow.pending, (state, _action) => {
			state.pagesOfSearchResults = 0;
			state.results = [];
		});
	},
	selectors: {},
});

const client = generateClient<Schema>();

export const searchTvShow = createAsyncThunk(
	"search/tv",
	async (searchTerm: string) => {
		return await client.queries
			.searchTvShows({
				query: searchTerm,
			})
			.then(logErrorsAndReturnData);
	}
);

export const { clearSearchResults } = searchSlice.actions;
export const {} = searchSlice.selectors;
export const selectSearchResults = (state: RootState) => state.search.results;
export default searchSlice.reducer;
