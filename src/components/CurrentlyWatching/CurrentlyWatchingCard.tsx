import { Card } from "@aws-amplify/ui-react";
import { useGetTvShowDetailsQuery } from "../TvShow/tvShowDetails";
import TvShowImage from "../TvShow/TvShowImage";
import { useGetCurrentlyWatchingQuery } from "./currentlyWatching";
import EpisodeForwardBackwards from "./EpisodeForwardBackwards";

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
		<Card className="currently-watching-card">
			<TvShowImage tvShowDetails={tvShowDetails} />
			<EpisodeForwardBackwards
				tvShowDetails={tvShowDetails}
				currentlyWatchingId={watchRecordId}
			/>
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
	return <></>;
};

export default CurrentlyWatchingCard;
