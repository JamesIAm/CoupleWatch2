import { TvShowDetails } from "./tvShowDetails";
import { Button } from "@aws-amplify/ui-react";

type Props = { tvShowDetails: TvShowDetails | undefined; isWatching: boolean };

const EpisodeSelection = ({ tvShowDetails, isWatching }: Props) => {
	return (
		<div>
			EpisodeSelection
			{tvShowDetails?.seasons?.map((season) => {
				return (
					<div key={season.id}>
						<h2>{season.name}</h2>
						<EpisodeButtons
							episodeCount={season.episode_count || 0}
							isWatching={isWatching}
						/>
					</div>
				);
			})}
		</div>
	);
};
type EpisodeButtonProps = {
	episodeCount: number;
	isWatching: boolean;
};
const EpisodeButtons = ({ episodeCount, isWatching }: EpisodeButtonProps) => {
	let episodeNumbers = [];
	for (let i = 1; i <= episodeCount; i++) {
		episodeNumbers.push(i);
	}
	return (
		<>
			{episodeNumbers.map((episodeIndex) => (
				<Button disabled={!isWatching} key={episodeIndex}>
					{episodeIndex}
				</Button>
			))}
		</>
	);
};

export default EpisodeSelection;
