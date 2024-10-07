import { Button, useAuthenticator } from "@aws-amplify/ui-react";
import {
	useGetCurrentlyWatchingQuery,
	useStartWatchingMutation,
	useStopWatchingMutation,
} from "../CurrentlyWatching/currentlyWatching";
import { AccordionTvShow } from "./TvShowAccordionItem";

type WatchingButtonProps = {
	data: AccordionTvShow;
};

const WatchingButtons = ({ data }: WatchingButtonProps) => {
	const { isFetching: currentlyWatchingIsLoading } =
		useGetCurrentlyWatchingQuery();
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
	const { user } = useAuthenticator((context) => [context.user]);
	const [startWatching, { isLoading: startWatchingUpdating }] =
		useStartWatchingMutation();
	return (
		<Button
			onClick={() => startWatching({ mediaId, user })}
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

const StopWatchingButton = ({
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
