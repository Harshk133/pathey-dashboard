import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { api } from "./features/apiSlice.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CssBaseline />
    <ApiProvider api={api}>
      <App />
    </ApiProvider>
  </StrictMode>
);
