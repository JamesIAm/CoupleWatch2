import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
outputs.auth.oauth.domain = import.meta.env.VITE_OAUTH_DOMAIN;
Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<Authenticator.Provider>
				<App />
			</Authenticator.Provider>
		</Provider>
	</React.StrictMode>
);
