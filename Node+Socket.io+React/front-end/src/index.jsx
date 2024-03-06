import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { Theme } from "@radix-ui/themes";
import App from "./App.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Theme
      hasBackground={true}
      appearance="dark"
      accentColor="teal"
      grayColor="sage"
      panelBackground="solid"
      radius="medium"
      scaling="100%"
    >
      <App />
    </Theme>
  </Provider>
);
