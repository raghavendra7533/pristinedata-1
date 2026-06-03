import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { addCollection } from "@iconify/react";
import solarIcons from "@iconify-json/solar/icons.json";

// Pre-load all solar icons locally so they never flash/fetch from CDN
addCollection(solarIcons as Parameters<typeof addCollection>[0]);

createRoot(document.getElementById("root")!).render(<App />);
