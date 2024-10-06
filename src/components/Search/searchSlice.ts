import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../state/store";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { logErrorsAndReturnData } from "../../utils/ClientUtils";

export type TvSearchResult = Schema["searchTvShows"]["returnType"];
export type TvShow = Schema["TvShow"]["type"];
export type TvShowDetails = Schema["TvShowDetails"]["type"];
export type TvShowSkeleton = {
	mediaId: string;
	name: string;
	firstAirDate: string;
};
type SearchState = {
	results: TvShowSkeleton[];
	pagesOfSearchResults: number;
	tvShowDetails: { [key: number]: TvShowDetails };
};

const initialState: SearchState = {
	results: [],
	pagesOfSearchResults: 0,
	tvShowDetails: {},
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
			const tvShows = action.payload.results as unknown as TvShow[];
			state.results = tvShows.map((tvShow) => {
				return {
					mediaId: String(tvShow.id),
					name: tvShow.name,
					firstAirDate: tvShow.first_air_date || "",
				};
			});
			state.pagesOfSearchResults = action.payload.total_pages || 1;
		});
		builder.addCase(searchTvShow.pending, (state, _action) => {
			state.pagesOfSearchResults = 0;
			state.results = [];
		});
		builder.addCase(getTvShowDetails.fulfilled, (state, action) => {
			let emptyMap: { [key: number]: TvShowDetails } = {};
			state.tvShowDetails = action.payload.reduce((map, obj) => {
				map[obj.id] = obj;
				return map;
			}, emptyMap);
		});
	},
	selectors: {
		selectTvShowDetails: (state, tvShowId) => state.tvShowDetails[tvShowId],
	},
});

const client = generateClient<Schema>();

export const searchTvShow = createAsyncThunk(
	"search/tv",
	async (searchTerm: string, { dispatch }) => {
		return await client.queries
			.searchTvShows({
				query: searchTerm,
			})
			.then(logErrorsAndReturnData)
			.then((res) => {
				const tvShows = res?.results as unknown as TvShow[];
				dispatch(
					getTvShowDetails(tvShows.map((show) => String(show.id)))
				);
				return res;
			});
	}
);
export const getTvShowDetails = createAsyncThunk(
	"search/tv/episodes",
	async (tvShowIds: string[]) => {
		console.log("Starting " + tvShowIds);

		return Promise.all(
			tvShowIds.map((tvShowId) =>
				client.queries
					.getTvShowEpisodes({
						seriesId: tvShowId,
					})
					.then(logErrorsAndReturnData)
					.then((nullableEpisodes) => nullableEpisodes)
			)
		);
	}
);

export const { clearSearchResults } = searchSlice.actions;
export const { selectTvShowDetails } = searchSlice.selectors;
export const selectSearchResults = (state: RootState) => state.search.results;
export default searchSlice.reducer;
