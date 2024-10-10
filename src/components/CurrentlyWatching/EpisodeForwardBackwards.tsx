import {
	useGetCurrentlyWatchingQuery,
	useSetEpisodeMutation,
} from "./currentlyWatching";
import { TvShowDetails } from "../TvShow/tvShowDetails";
import { Button } from "@aws-amplify/ui-react";

type Props = {
	tvShowDetails: TvShowDetails;
	currentlyWatchingId: string;
};

const EpisodeForwardBackwards = ({
	tvShowDetails,
	currentlyWatchingId,
}: Props) => {
	const { data: currentlyWatchingData, isFetching: isUpdating } =
		useGetCurrentlyWatchingQuery(currentlyWatchingId);

	const [updateEpisode, { isLoading: isMutating }] = useSetEpisodeMutation();
	const disableButtons = isUpdating || isMutating;
	const lastEpisode = () => {
		if (!currentlyWatchingData?.season || !currentlyWatchingData.episode) {
			return;
		}
		let newSeason;
		let newEpisode;
		if (currentlyWatchingData.episode === 1) {
			if (currentlyWatchingData.season <= 1) {
				console.error("Can't go to an earlier season than 1");
				return;
			}
			newSeason = currentlyWatchingData.season - 1;
			newEpisode = tvShowDetails.seasons[newSeason].episode_count;
			if (!newEpisode) {
				console.error(
					"Episode count in the previous season is undefined"
				);
				return;
			}
		} else {
			newSeason = currentlyWatchingData.season;
			newEpisode = currentlyWatchingData.episode - 1;
		}
		updateEpisode({
			watchRecord: currentlyWatchingData,
			season: newSeason,
			episode: newEpisode,
		});
	};

	const nextEpisode = () => {
		if (!currentlyWatchingData?.season || !currentlyWatchingData.episode) {
			return;
		}
		const currentSeason = currentlyWatchingData.season;
		const currentEpisode = currentlyWatchingData.episode;
		const episodesInCurrentSeason =
			tvShowDetails.seasons[currentSeason]?.episode_count;
		if (!episodesInCurrentSeason) {
			console.error("Can't find episodes in current season");
			return;
		}
		let newSeason;
		let newEpisode;
		if (currentEpisode >= episodesInCurrentSeason) {
			if (tvShowDetails.number_of_seasons <= currentSeason) {
				console.error("Can't go to a season after the last one");
				return;
			}
			newSeason = currentlyWatchingData.season + 1;
			newEpisode = 1;
		} else {
			newSeason = currentlyWatchingData.season;
			newEpisode = currentlyWatchingData.episode + 1;
		}
		updateEpisode({
			watchRecord: currentlyWatchingData,
			season: newSeason,
			episode: newEpisode,
		});
	};

	const startEp1 = () => {
		if (!currentlyWatchingData) {
			console.error(
				"currently watching data not present, can't start from episode 1"
			);
			return;
		}
		updateEpisode({
			watchRecord: currentlyWatchingData,
			season: 1,
			episode: 1,
		});
	};
	if (currentlyWatchingData?.season && currentlyWatchingData.episode) {
		return (
			<div>
				<Button
					onClick={() => lastEpisode()}
					isDisabled={disableButtons}
				>
					{"<"}
				</Button>
				S{currentlyWatchingData.season}E{currentlyWatchingData.episode}
				<Button
					onClick={() => nextEpisode()}
					isDisabled={disableButtons}
				>
					{">"}
				</Button>
			</div>
		);
	} else {
		return (
			<>
				Ep unknown{" "}
				<Button isDisabled={disableButtons} onClick={() => startEp1()}>
					S1E1
				</Button>
			</>
		);
	}
};

export default EpisodeForwardBackwards;
