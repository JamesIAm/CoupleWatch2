import { Accordion, ScrollView } from "@aws-amplify/ui-react";
import TvShowAccordionItem, { AccordionTvShow } from "./TvShowAccordionItem";

type Props = {
	tvShows: AccordionTvShow[];
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
