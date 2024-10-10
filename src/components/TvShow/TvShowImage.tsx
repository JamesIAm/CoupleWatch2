import { TvShowDetails } from "./tvShowDetails";
import { Image } from "@aws-amplify/ui-react";
import "./style/style.css";

type Props = { tvShowDetails: TvShowDetails | undefined };

const BASE_IMAGE_PATH = "https://image.tmdb.org/t/p/w";
const DEFAULT_WIDTH = "185";

const TvShowImage = ({ tvShowDetails }: Props) => {
	return (
		<div className="card-image">
			{!tvShowDetails?.poster_path ? (
				<></>
			) : (
				<Image
					src={
						BASE_IMAGE_PATH +
						DEFAULT_WIDTH +
						"/" +
						tvShowDetails.poster_path
					}
					alt={tvShowDetails.name + " image"}
					width="100%"
					height="100%"
				/>
			)}
		</div>
	);
};

export default TvShowImage;
