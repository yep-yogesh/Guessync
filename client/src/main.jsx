import React from "react"; 
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // <- Tailwind styles here
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/silkscreen";

ReactDOM.createRoot(document.getElementById("root")).render(
  // REMOVE <React.StrictMode> during development
  <App />
);
 