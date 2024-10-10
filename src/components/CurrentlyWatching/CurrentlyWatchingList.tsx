import CurrentlyWatchingCard from "./CurrentlyWatchingCard";

type Props = { watchingIds: string[] };
const CurrentlyWatchingList = ({ watchingIds }: Props) => {
	return (
		<div>
			{watchingIds.map((id) => (
				<CurrentlyWatchingCard watchRecordId={id} key={id} />
			))}
		</div>
	);
};

export default CurrentlyWatchingList;
