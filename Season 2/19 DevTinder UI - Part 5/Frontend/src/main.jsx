import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import appStore from "./utils/appStore.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={appStore}>
      <App />
    </Provider>
  // </StrictMode>
);
