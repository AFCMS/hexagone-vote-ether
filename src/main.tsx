import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EthProvider } from "./eth/EthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EthProvider>
      <App />
    </EthProvider>
  </StrictMode>,
);
