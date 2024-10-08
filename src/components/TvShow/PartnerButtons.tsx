import { SwitchField } from "@aws-amplify/ui-react";
import {
	useStartWatchingWithMutation,
	useStopWatchingWithMutation,
	Watching,
} from "../CurrentlyWatching/currentlyWatching";
import { useGetAllPairingsQuery } from "../Partners/pairing";

type Props = { watchRecord: Watching };

const PartnerButtons = ({ watchRecord }: Props) => {
	const [startWatchingWith, { isLoading: startWatchingWithUpdating }] =
		useStartWatchingWithMutation();
	const [stopWatchingWith, { isLoading: stopWatchingWithUpdating }] =
		useStopWatchingWithMutation();
	const { data: partners } = useGetAllPairingsQuery();
	if (!partners) {
		return <div></div>;
	} else {
		return (
			<div>
				{partners.map((pairing) => {
					const isWatchingThisShowWithCurrentUser =
						watchRecord.with.includes(pairing.otherUser.username);
					const changeRecord = () =>
						isWatchingThisShowWithCurrentUser
							? stopWatchingWith({
									watchRecord: watchRecord,
									partnerToRemove: pairing.otherUser,
							  })
							: startWatchingWith({
									watchRecord: watchRecord,
									partnerToAdd: pairing.otherUser,
							  });

					return (
						<SwitchField
							key={pairing.otherUser.username}
							labelPosition="start"
							label={pairing.otherUser.email}
							isChecked={isWatchingThisShowWithCurrentUser}
							isDisabled={
								startWatchingWithUpdating ||
								stopWatchingWithUpdating
							}
							onChange={changeRecord}
						/>
					);
				})}
			</div>
		);
	}
};

export default PartnerButtons;
