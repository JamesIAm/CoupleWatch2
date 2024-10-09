import {
	useGetCurrentlyWatchingQuery,
	useSetEpisodeMutation,
} from "../CurrentlyWatching/currentlyWatching";
import { TvShowDetails } from "./tvShowDetails";
import { Button } from "@aws-amplify/ui-react";

type Props = {
	tvShowDetails: TvShowDetails | undefined;
	currentlyWatchingId: string | undefined;
};

const EpisodeSelection = ({ tvShowDetails, currentlyWatchingId }: Props) => {
	return (
		<div>
			EpisodeSelection
			{tvShowDetails?.seasons?.map((season, seasonIndex) => {
				return (
					<div key={season.id}>
						<h2>{season.name}</h2>
						<EpisodeButtons
							episodeCount={season.episode_count || 0}
							seasonIndex={seasonIndex}
							currentlyWatchingId={currentlyWatchingId}
						/>
					</div>
				);
			})}
		</div>
	);
};
type EpisodeButtonProps = {
	episodeCount: number;
	seasonIndex: number;
	currentlyWatchingId: string | undefined;
};
const EpisodeButtons = ({
	episodeCount,
	seasonIndex,
	currentlyWatchingId,
}: EpisodeButtonProps) => {
	let episodeNumbers = [];
	for (let i = 1; i <= episodeCount; i++) {
		episodeNumbers.push(i);
	}
	const { data: currentlyWatchingData } =
		useGetCurrentlyWatchingQuery(currentlyWatchingId);
	const isActiveSeason = currentlyWatchingData?.season === seasonIndex;
	const [updateEpisode] = useSetEpisodeMutation();
	return (
		<>
			{episodeNumbers.map((episodeIndex) => {
				const isActiveEpisode =
					isActiveSeason &&
					currentlyWatchingData?.episode === episodeIndex;
				return (
					<Button
						disabled={!currentlyWatchingData || isActiveEpisode}
						key={episodeIndex}
						onClick={() => {
							if (currentlyWatchingData) {
								updateEpisode({
									watchRecord: currentlyWatchingData,
									season: seasonIndex,
									episode: episodeIndex,
								});
							}
						}}
					>
						{episodeIndex}
					</Button>
				);
			})}
		</>
	);
};

export default EpisodeSelection;
