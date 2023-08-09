import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Routees from "./Routes";
import { ErrorBoundary } from "react-error-boundary";
import Fallback from "./component/Fallback";
import 'react-toastify/dist/ReactToastify.css';
const errorHandler = (error, errorInfo) => {
  console.log("logging", error, errorInfo);
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={Fallback} onError={errorHandler}>
      <Routees />
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
