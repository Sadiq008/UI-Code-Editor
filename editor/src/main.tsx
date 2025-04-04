/* eslint-disable react/react-in-jsx-scope */
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

//* Importing React-Router *//
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <Router>
    <App />
  </Router>
);
