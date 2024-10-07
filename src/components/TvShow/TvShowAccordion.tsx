import { Accordion, ScrollView } from "@aws-amplify/ui-react";
import TvShowAccordionItem, { AccordionTvShow } from "./TvShowAccordionItem";
import { Partner } from "../Partners/PartnerCard";

type Props = {
	tvShows: AccordionTvShow[];
	watchingWith: Partner[] | undefined;
};

const TvShowAccordion = ({ tvShows }: Props) => {
	return (
		<ScrollView height="20vh">
			<Accordion.Container>
				{tvShows.map((show, index) => (
					<TvShowAccordionItem data={show} key={index} />
				))}
			</Accordion.Container>
		</ScrollView>
	);
};

export default TvShowAccordion;
