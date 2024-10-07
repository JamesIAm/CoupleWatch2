import { SwitchField } from "@aws-amplify/ui-react";
import {
	useStartWatchingWithMutation,
	useStopWatchingWithMutation,
	Watching,
} from "../CurrentlyWatching/currentlyWatching";
import { useAppSelector } from "../../state/hooks";
import { selectPairings } from "../Partners/pairingsSlice";

type Props = { watchRecord: Watching };

const PartnerButtons = ({ watchRecord }: Props) => {
	const [startWatchingWith, { isLoading: startWatchingWithUpdating }] =
		useStartWatchingWithMutation();
	const [stopWatchingWith, { isLoading: stopWatchingWithUpdating }] =
		useStopWatchingWithMutation();
	const partners = useAppSelector((state) => selectPairings(state));
	return (
		<div>
			{partners.map((pairing) => {
				const isWatchingThisShowWithCurrentUser =
					watchRecord.with.includes(pairing.username);
				const changeRecord = () =>
					isWatchingThisShowWithCurrentUser
						? stopWatchingWith({
								watchRecord: watchRecord,
								partnerToRemove: pairing,
						  })
						: startWatchingWith({
								watchRecord: watchRecord,
								partnerToAdd: pairing,
						  });

				return (
					<SwitchField
						key={pairing.username}
						labelPosition="start"
						label={pairing.email}
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
};

export default PartnerButtons;
