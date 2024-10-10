import { Card } from "@aws-amplify/ui-react";
import { useGetTvShowDetailsQuery } from "../TvShow/tvShowDetails";
import TvShowImage from "../TvShow/TvShowImage";
import { useGetCurrentlyWatchingQuery, Watching } from "./currentlyWatching";
import { StopWatchingButton } from "../TvShow/WatchingButtons";
import EpisodeSelection from "../TvShow/EpisodeSelection";

type Props = { watchRecordId: string };

const CurrentlyWatchingCard = ({ watchRecordId }: Props) => {
	const {
		data: currentlyWatchingData,
		isFetching: _isFetchingCurrentlyWatching,
	} = useGetCurrentlyWatchingQuery(watchRecordId);
	const { data: tvShowDetails, isFetching: _isFetchingDetails } =
		useGetTvShowDetailsQuery(currentlyWatchingData?.mediaId);
	if (!currentlyWatchingData || !tvShowDetails) {
		return <DetailsMissingPlaceholder />;
	}
	return (
		<Card>
			<TvShowImage tvShowDetails={tvShowDetails} />
			{/* {tvShowDetails.name}
			<br />
			<SeasonAndEpisodeInfo
				currentlyWatchingData={currentlyWatchingData}
			/>

			<StopWatchingButton
				watchRecordId={currentlyWatchingData.id}
				currentlyWatchingIsLoading={false}
			/> */}
			{/* <EpisodeSelection
				tvShowDetails={tvShowDetails}
				currentlyWatchingId={currentlyWatchingData.id}
			/> */}
		</Card>
	);
};

const DetailsMissingPlaceholder = () => {
	console.log("missing details");
	return <></>;
};

const SeasonAndEpisodeInfo = ({
	currentlyWatchingData,
}: {
	currentlyWatchingData: Watching;
}) => {
	if (currentlyWatchingData.season && currentlyWatchingData.episode) {
		return (
			<>
				Last watched: S{currentlyWatchingData.season} E
				{currentlyWatchingData.episode}
				<br />
			</>
		);
	}
	return <></>;
};

export default CurrentlyWatchingCard;
