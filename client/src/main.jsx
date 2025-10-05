import React from "react"; 
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; 
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/silkscreen";
import AuthProvider from "./context/AuthContext"; // 1. Import the AuthProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Wrap the <App /> component with the provider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);