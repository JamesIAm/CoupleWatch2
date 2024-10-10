import { Button } from "@aws-amplify/ui-react";
import {
	useGetAllCurrentlyWatchingQuery,
	useStartWatchingMutation,
	useStopWatchingMutation,
} from "../CurrentlyWatching/currentlyWatching";
import { AccordionTvShow } from "./TvShowAccordionItem";

type WatchingButtonProps = {
	data: AccordionTvShow;
};

const WatchingButtons = ({ data }: WatchingButtonProps) => {
	const { isFetching: currentlyWatchingIsLoading } =
		useGetAllCurrentlyWatchingQuery();
	if (data.isWatching) {
		return (
			<StopWatchingButton
				watchRecordId={data.data.id}
				currentlyWatchingIsLoading={currentlyWatchingIsLoading}
			/>
		);
	} else {
		return (
			<StartWatchingButton
				mediaId={data.data.mediaId}
				currentlyWatchingIsLoading={currentlyWatchingIsLoading}
			/>
		);
	}
};
type StartWatchingProps = {
	mediaId: string;
	currentlyWatchingIsLoading: boolean;
};

const StartWatchingButton = ({
	mediaId,
	currentlyWatchingIsLoading,
}: StartWatchingProps) => {
	const [startWatching, { isLoading: startWatchingUpdating }] =
		useStartWatchingMutation();
	return (
		<Button
			onClick={() => startWatching(mediaId)}
			isDisabled={startWatchingUpdating || currentlyWatchingIsLoading}
		>
			Start watching
		</Button>
	);
};
type StopWatchingProps = {
	watchRecordId: string;
	currentlyWatchingIsLoading: boolean;
};

export const StopWatchingButton = ({
	watchRecordId,
	currentlyWatchingIsLoading,
}: StopWatchingProps) => {
	const [stopWatching, { isLoading: stopWatchingUpdating }] =
		useStopWatchingMutation();
	return (
		<Button
			onClick={() => stopWatching(watchRecordId)}
			isDisabled={stopWatchingUpdating || currentlyWatchingIsLoading}
		>
			Stop watching
		</Button>
	);
};

export default WatchingButtons;
