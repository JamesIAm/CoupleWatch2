import { Collection, ScrollView } from "@aws-amplify/ui-react";
import CurrentlyWatchingCard from "./CurrentlyWatchingCard";

type Props = { watchingIds: string[] };
const CurrentlyWatchingList = ({ watchingIds }: Props) => {
	return (
		<ScrollView width="100%">
			<Collection
				items={watchingIds}
				type="list"
				direction="row"
				gap="20px"
				wrap="nowrap"
			>
				{(item, _index) => (
					<CurrentlyWatchingCard watchRecordId={item} />
				)}
			</Collection>
		</ScrollView>
	);
};

export default CurrentlyWatchingList;
